import express from 'express';
import graphQLHTTP from 'express-graphql';
import {buildSchema} from "graphql";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
};

const GRAPHQL_PORT = 8080;

const graphQLServer = express();
// Expose a GraphQL endpoint
graphQLServer.use('/', graphQLHTTP({schema, rootValue: root, pretty: true, graphiql: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
