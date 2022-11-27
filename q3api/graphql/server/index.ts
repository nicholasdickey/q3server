import type { NextApiRequest, NextApiResponse } from 'next';
import { ApolloServer } from 'apollo-server-micro';

import { createContext } from '@/graphql/context';

import typeDefs from '@/graphql/typeDefs';
import resolvers from '@/graphql/resolvers';

const ss=async ():Promise<ApolloServer>=>{
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});

const startServer =await apolloServer.start();
return apolloServer;
}
export default async function graphqlServer({
  req,
  res,
  serverConfig = {},
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  serverConfig?: any;
}) {
  console.log("graphqlServer")
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  const server=await ss();
 // await server.startServer;
  await server.createHandler({
    path: '/api/graphql',
  })(req, res);
}
