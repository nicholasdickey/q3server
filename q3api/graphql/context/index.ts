// import { PrismaClient } from '@prisma/client';
// import prisma from '@/lib/prisma';
//import { getSession } from 'next-auth/react';

export type Context = {
  session: any; // TODO: set session types
};

export async function createContext({req,res}) {
  //const session = await getSession({ req }); // TODO: credentials not working on graphql studio (/api/graphql)
  console.log("createContext SESSION:",req.query)
  const threadid = Math.floor(Math.random() * 10000);
  
  const        testSessionID = Math.floor(Math.random() * 10000000000);
  const     sessionID = `test-${testSessionID}`;
  let c = {
    sessionID,
    logContext: {
        threadid,
        sessionid: sessionID,
        username: "apollo-context",
    },
};
/*l(
    chalk.green.bold(
        "APOLLO CONTEXT calling sessionAction.getSession"
    )
);*/
/*
try {
    session = await sessionActions.getSession(null, {}, c, {
        newslineSlug,
    });
    // l(chalk.green.bold(js({ user: session.user })));
} catch (x) {
    l(chalk.red.bold("APOLLO CONTEXT EXCEPTION", x));
}
*/
  return {
    session: { isAuth: true },
    threadid,
    sessionid:sessionID,
    username:"apollo"
  };
}
