import express from 'express';
import cors from 'cors';
import graphQLHTTP from 'express-graphql';
import {buildSchema} from "graphql";

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
  blogs() {
    return [
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
  }
};

const GRAPHQL_PORT = 8080;

const graphQLServer = express();
graphQLServer.use(cors());//TODO check it
// Expose a GraphQL endpoint
graphQLServer.use('/graphql', graphQLHTTP({schema, rootValue: root, pretty: true, graphiql: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
