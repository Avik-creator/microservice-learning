import { ApolloServer } from "apollo-server";
import express from "express";
import { resolvers } from "./resolver";
import { typeDefs } from "./schema";

const app = express();
app.use(express.json())

const server = new ApolloServer({ typeDefs, resolvers,context: ({ req }) => ({ req }) });
const startServer = async () => {
  await server.start();

  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
}

startServer().catch(err => console.log(err));
