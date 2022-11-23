import { combineResolvers, resolverType } from 'fast-graphql';

import user from './user';
import place from './place';
import review from './review';
import feeds from './feeds';

const resolvers: resolverType[] = [place, user, review,feeds];

const cominedResolvers = combineResolvers({ resolvers });

export default cominedResolvers;
