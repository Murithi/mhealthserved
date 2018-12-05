import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";
const typeDefs = importSchema("schema.graphql");

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new GraphQLServer({ schema });
server.start(() => console.log("Server is running on localhost:4000"));
