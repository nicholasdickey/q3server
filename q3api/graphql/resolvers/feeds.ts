import { resolverType } from 'fast-graphql';
import { l, chalk,js } from "../../lib/common.js";
import { places } from '@/data';

import * as schema from '@/graphql/generated/schemaType';

const Query = {
    placeList: (parent: any, args: any, ctx: any): schema.Query['placeList'] => {
        return places;
    },

    place: (parent: any, args: any, ctx: any) => {
        return places.find((x) => x.id == args.id);
    },
    feedsStatus: (parent: any, args: any, ctx: any) => {

        //(silo: Int): FeedsStatus
    },
    fetchFeed: (parent: any, args: any, ctx: any) => {
        //(slug: String): Feed
    },
    allFeeds: (parent: any, args: any, ctx: any) => {
        //(channel: String): [FeedItem]
    },
    pingPayload:(parent: any, args: any, ctx: any)=>{
        //(payload: String): String
    },
    ping:(parent: any, args: any, ctx: any)=>{
        // String
    }
};

const Mutation = {
    addPlace: (parent: any, args: any, ctx: any) => {
        //return { title: 'this is addPlace mutuation' };
    },
    pingPayloadMutatio: (parent: any, args: any, ctx: any) =>{
        //(payload: String): String
    },
    runUrl: (parent: any, args: any, ctx: any) => {
        /*(
        url: String!
        primaryTag: String!
        tags: [String]
        silo: Int
    ): RunUrlResult
    */
        },
    runFeed: (parent: any, args: any, ctx: any) => {
        //(slug: String!, silo: Int, tags: [String]): Boolean
    },
    postUrl: (parent: any, args: any, ctx: any) => {
        //(url: String!, silo: Int, tags: [String]): RunUrlResult
    },
    saveFeed: (parent: any, args: any, ctx: any) => {
        //(feed: FeedInput): returnValue
    },
    runFeeds: (parent: any, args: any, ctx: any) => {
        //(silo: Int): Boolean
        const { sessionid, threadid, user } = ctx;
        const { silo } = args;

        l("runFeeds", js({ sessionid, threadid, silo }));
    
        let result = feedActions.runFeedsAction({
            silo,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
    
        return true;
    },
    stopFeeds: (parent: any, args: any, ctx: any) => {
        //(silo: Int): Boolean
    }
};

const resolver: resolverType = { Query, Mutation };

export default resolver;
