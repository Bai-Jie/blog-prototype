import express from 'express';
import cors from 'cors';
import graphQLHTTP from 'express-graphql';
import {buildSchema} from "graphql";
import Database from "better-sqlite3";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Article {
    title: String
    format: String
    content: String
  }

  type Query {
    hello: String
    blogs: [Article]!
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
  blogs: getBlogs
};


const options = {
  // memory: true
};
const db = new Database('foobar.db', options);

function getBlogs() {
  const showData =`SELECT title, format, content FROM article`;
  return db.prepare(showData).all();
}




const GRAPHQL_PORT = 8080;

const graphQLServer = express();
graphQLServer.use(cors());//TODO check it
// Expose a GraphQL endpoint
graphQLServer.use('/graphql', graphQLHTTP({schema, rootValue: root, pretty: true, graphiql: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
