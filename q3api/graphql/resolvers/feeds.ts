import { resolverType } from 'fast-graphql';
import { l, chalk, js } from "../../lib/common.js";

import feedActions from "@/lib/actions/feedActions.js"
import * as schema from '@/graphql/generated/schemaType';
import { dbEnd, dbFetchLogByThreadid } from "../../lib/db.js";
import dbFeed from "../../lib/db/dbFeed.js"

const Query = {

    feedsStatus: async (parent: any, args: any, ctx: any) => {

        //(silo: Int): FeedsStatus
        const { sessionid, threadid, user } = ctx;
        const { silo } = args;
        //l("feedsStatusWrap", sessionid, threadid, user ? user.slug : "graphql");
        l("feedsStatusWrap", js({ sessionid, threadid, silo }));
    
        let result = await feedActions.feedsStatus({
            silo,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
        return result;
    },
    fetchFeed: async (parent: any, args: any, ctx: any) => {
        //(slug: String): Feed
        const { slug } = args;
        const { sessionid, threadid, user } = ctx;
        //l(11111);
        l("fetchFeedQuery", js({ sessionid, threadid, slug }));
        let result = await feedActions.fetchFeed({
            slug,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
        console.log("fetchFeedQuery 3313", JSON.stringify(result));

        let feed = result.feed;

        return feed;
    },
    allFeeds: async (parent: any, args: any, ctx: any) => {
        //(channel: String): [FeedItem]
        const { sessionid, threadid, user } = ctx;

        l("allFeedsQueryWrap", js({ sessionid, threadid, user }));
        let feeds = await dbFeed.fetchTags({ threadid, sessionid, username: user ? user.username : "graphql", dbServerName: null });
        /* let feeds = await allFeedsQuery({
             username: "anon", // username: user ? username : "anon",
             sessionid,
             threadid,
         });*/
        l("allFeedsQueryWrap end");
        return feeds;
    },
    pingPayload: (parent: any, args: any, ctx: any) => {
        //(payload: String): String
        const { sessionid, threadid, user } = ctx;
        const { payload } = args;
        l("QL PING PAYLOAD", js({ sessionid, threadid, payload }));

        /*return await qwiketActions.getTag({
            slug,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
        */
        return `Pong:${payload}`;
    },
    ping: (parent: any, args: any, ctx: any) => {
        // String
        return `Pong`;
    }
};

const Mutation = {

    pingPayloadMutation: (parent: any, args: any, ctx: any) => {
        //(payload: String): String
        const { sessionid, threadid, user } = ctx;
        const { payload } = args;
        l("QL PING PAYLOAD", js({ sessionid, threadid, payload }));

        /*return await qwiketActions.getTag({
            slug,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
        */
        return `Pong:${payload}`;
    },
    runUrl: async (parent: any, args: any, ctx: any) => {
        /*(
        url: String!
        primaryTag: String!
        tags: [String]
        silo: Int
    ): RunUrlResult
    */
        const { primaryTag, url, tags, silo } = args;
        const { sessionid, threadid, user } = ctx;
        let result = await feedActions.runUrl({
            primaryTag,
            feed: null,
            url,
            tags,
            silo,
            source: null,
            rss: null,
            username: user ? user.username : "graphql",
            sessionid,
            threadid,
        });
        //console.log("runUrl mutation 331", JSON.stringify(result));

        let qwiket = result.qwiket;
        let log = await dbFetchLogByThreadid({ threadid });
        return { qwiket, log };
    },
    runFeed: (parent: any, args: any, ctx: any) => {
        //(slug: String!, silo: Int, tags: [String]): Boolean
        const { slug, silo, tags } = args;
        const { sessionid, threadid, user } = ctx;
        l(
            "runFeedMutation111",
            js({ slug, silo, tags, sessionid, threadid, user })
        );
        feedActions.runFeed({
            tag: slug,
            silo,
            tags,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
        return true;
    },
    postUrl: async (parent: any, args: any, ctx: any) => {
        //(url: String!, silo: Int, tags: [String]): RunUrlResult
        const { url, tags, silo } = args;
        const { sessionid, threadid, user } = ctx;
        let result = await feedActions.postUrl({
            url,
            tags,
            silo,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
        let qwiket = result.qwiket;
        let log = await dbFetchLogByThreadid({ threadid });
        return { qwiket, log };
    },
    saveFeed: async (parent: any, args: any, ctx: any) => {
        const { feed } = args;
        const { sessionid, threadid, user } = ctx;
        let result = await feedActions.saveFeed({
            feed,
            username: user ? user.username : "graphql",
            sessionid,
            threadid,
        });

        return result;
    },
    runFeeds: (parent: any, args: any, ctx: any) => {
        //(silo: Int): Boolean
        const { sessionid, threadid, user } = ctx;
        const { silo } = args;

        l("runFeeds", js({ sessionid, threadid, silo }));

        let result = feedActions.runFeedsAction({
            silo,
            feedName: null,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });

        return true;
    },
    stopFeeds: (parent: any, args: any, ctx: any) => {
        const { sessionid, threadid, user } = ctx;
        const { silo } = args;
        l("stopFeedsWrap", js({ sessionid, threadid, silo }));

        let result = feedActions.stopFeeds({
            silo,
            username: user ? user.slug : "graphql",
            sessionid,
            threadid,
        });
        return true;
    }
};

const resolver: resolverType = { Query, Mutation };

export default resolver;
