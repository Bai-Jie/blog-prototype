import commander from 'commander';
import Database from 'better-sqlite3';

function wrapTransaction(sql) {
  return `
  BEGIN TRANSACTION;

  ${sql}

  COMMIT TRANSACTION;
  `;
}

const createTable = wrapTransaction(`
CREATE TABLE article (id INTEGER PRIMARY KEY, title TEXT, format TEXT, content TEXT);
`);

const dropTable = wrapTransaction(`
DROP TABLE article;
`);



const options = {
  // memory: true
};
const db = new Database('foobar.db', options);


const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

// Higher order function - returns a function that always runs in a transaction
function asTransaction(func) {
  return function (...args) {
    begin.run();
    try {
      func(...args);
      commit.run();
    } catch(e) {
      if (db.inTransaction) rollback.run();
      throw e;
    }
  };
}

function insertData() {
  const insertData =`INSERT INTO article (title, format, content) VALUES (:title, :format, :content)`;
  const data = [
    {title: "title 0", format: "plaintext", content: "blog 0"},
    {title: "title 1", format: "plaintext", content: "blog 1"},
    {title: "title 2", format: "plaintext", content: "blog 2"},
    {title: "title 3", format: "plaintext", content: "blog 3"},
    {title: "title 4", format: "plaintext", content: "blog 4"},
    {title: "title 5", format: "plaintext", content: "blog 5"},
    {title: "server?", format: "plaintext", content: "hello from server @ " + new Date()},
    {title: "raw html sample", format: "html", content: "Hello from <strong>HTML</strong> <script>alert('bad')</script>"},
    {title: "markdown sample", format: "markdown", content: "Hello from **Markdown** <script>alert('bad')</script>"}
  ];

  const statement = db.prepare(insertData);
  asTransaction(() => data.forEach(value => statement.run(value)))();
}

function showData() {
  const showData =`SELECT * FROM article`;
  const rows = db.prepare(showData).all();
  console.log(JSON.stringify(rows, null, ' '));
}


commander
  .command('createTable')
  .action(() => {
    db.exec(createTable);
  });

commander
  .command('dropTable')
  .action(() => {
    db.exec(dropTable);
  });

commander
  .command('insertData')
  .action(insertData);

commander
  .command('showData')
  .action(showData);

commander.parse(process.argv);
if (!commander.args.length) commander.help();
