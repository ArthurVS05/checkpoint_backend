import { startStandaloneServer } from "@apollo/server/standalone";
// import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { dataSource } from "./config/db";
import { ContinentResolver } from "./resolvers/ContinentResolver";
import { CountryResolver } from "./resolvers/CountryResolver";

export const createApp = async () => {
  await dataSource.initialize();
  console.log("Datasource is connected");

  const schema = await buildSchema({
    resolvers: [CountryResolver, ContinentResolver],
  });

  const server = new ApolloServer({ schema });

  const PORT = Number(process.env.BACKEND_PORT) || 5000;

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`GraphQL server ready at ${url}`);
};

createApp();
