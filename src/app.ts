import { startStandaloneServer } from "@apollo/server/standalone";
// import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { dataSource } from "./config/db";
import { CountryResolver } from "./resolvers/CountryResolver";

// export type MyContext = {
//   req: IncomingMessage;
//   res: ServerResponse;
//   user?: User;
// };

export const createApp = async () => {
  await dataSource.initialize();
  console.log("Datasource is connected");

  const schema = await buildSchema({
    resolvers: [CountryResolver],
  });

  // const context = async ({ req, res }: MyContext): Promise<MyContext> => {
  //   return { req, res };
  // };

  const server = new ApolloServer({ schema });

  const PORT = Number(process.env.BACKEND_PORT) || 5000;

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    // context: context,
  });

  console.log(`GraphQL server ready at ${url}`);
};

createApp();
