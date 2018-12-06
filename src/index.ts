import "reflect-metadata";
import { createTypeormConn } from "./utils/createTypeormConnection";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import * as path from "path";

export const startServer = async () => {
  const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));
  const server = new GraphQLServer({ typeDefs, resolvers });

  //Create a connection to the database
  //Connection parameters are picked up from TYPEORM config
  // await createConnection().then(() => {});
  await createTypeormConn();
  await server.start();
  console.log("Server is running on localhost:4000");
};

startServer();
