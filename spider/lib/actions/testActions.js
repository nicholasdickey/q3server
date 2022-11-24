//import dbQwiket from "../db/dbQwiket.js";
import dbTest from "../db/dbTest.js";


//import dbFeed from "../db/dbFeed.js";
//import { setCDN, deleteOldCDN, loadCDN } from "../cdn.js";
import { redis, push } from "../redis.js";
//import { syncup as replicate } from "../replicate.mjs";
import { l, chalk, js } from "../common.js";
//import rules from "../rules.js";

const dbServerNameX1 = process.env.DB_HOST_PRIMARY;
const dbServerNameX2 = process.env.DB_HOST_SECONDARY;
const redisServerX1 = process.env.REDIS_HOST_PRIMARY;
const redisServerX2 = process.env.REDIS_HOST_SECONDARY;
const redisPortX1 = process.env.REDIS_PORT_PRIMARY;
const redisPortX2 = process.env.REDIS_PORT_SECONDARY;

const cleanTest = async ({ sessionid, threadid, username }) => {
    await dbTest.testInit({
        input: { url: itemUrl },
        sessionid,
        threadid,
        username,
        dbServerName1: dbServerNameX1,
        dbServerName2: dbServerNameX2,
    });
};
const stopTest = async ({ sessionid, threadid, username }) => {
    redis.del({
        key: `feed-running-${name}`,
        server: redisServerX1,
        port: redisPortX1,
        logContext: { sessionid, threadid, username },
    });
};

const resetTest = async ({ sessionid, threadid, username }) => {
    await dbTest.reset({
        sessionid,
        threadid,
        username,
        dbServerName1: dbServerNameX1,
        dbServerName2: dbServerNameX2,
    });
    await redis.ft_drop({
        server: redisServerX1,
        port: redisPortX1,
        index: "test-qwikets",
        logContext: { sessionid, threadid, username },
    });
    await redis.ft_drop({
        server: redisServerX2,
        port: redisPortX2,
        index: "test-qwikets",
        logContext: { sessionid, threadid, username },
    });
    l(
        chalk.green.bold("resetTest, calling ft_create"),
        js({
            redisServerX1,
            redisPortX1,
            logContext: { sessionid, threadid, username },
        })
    );
    await redis.ft_create({
        server: redisServerX1,
        port: redisPortX1,
        logContext: { sessionid, threadid, username },
        index: "test-qwikets",
        prefix: "q:",
        schema: [
            "SCHEMA",
            "title",
            "TEXT",
            "WEIGHT",
            2.0,
            "slug",
            "TAG",
            "description",
            "TEXT",
            "WEIGHT",
            1.2,
            "body",
            "TEXT",
            "WEIGHT",
            0.9,
            "author",
            "TEXT",
            "tags",
            "TEXT",
            "NOSTEM",
            "WEIGHT",
            2.5,
            "type",
            "NUMERIC",
            "NOINDEX",
            "published_time",
            "NUMERIC",
            "SORTABLE",
            "shared_time",
            "NUMERIC",
            "SORTABLE",
            "site_name",
            "TEXT",
            "WEIGHT",
            1.2,
            "image",
            "TEXT",
            "NOINDEX",
            "edited",
            "NUMERIC",
            "NOINDEX",
            "userSlug",
            "TAG",
            "userName",
            "TAG",
            "parentSlug",
            "TAG",
            "shared",
            "NUMERIC",
            "topicSlug",
            "TAG",
            "reshare",
            "NUMERIC",
            "channelSlug",
            "TAG",
        ], //topicSlug - rootid, slug - threadid, qwiketid
    });
    await redis.ft_create({
        server: redisServerX2,
        port: redisPortX2,
        logContext: { sessionid, threadid, username },
        index: "test-qwikets",
        prefix: "q:",
        schema: [
            "SCHEMA",
            "title",
            "TEXT",
            "WEIGHT",
            2.0,
            "slug",
            "TAG",
            "description",
            "TEXT",
            "WEIGHT",
            1.2,
            "body",
            "TEXT",
            "WEIGHT",
            0.9,
            "author",
            "TEXT",
            "tags",
            "TEXT",
            "NOSTEM",
            "WEIGHT",
            2.5,
            "type",
            "NUMERIC",
            "NOINDEX",
            "published_time",
            "NUMERIC",
            "SORTABLE",
            "shared_time",
            "NUMERIC",
            "SORTABLE",
            "site_name",
            "TEXT",
            "WEIGHT",
            1.2,
            "image",
            "TEXT",
            "NOINDEX",
            "edited",
            "NUMERIC",
            "NOINDEX",
            "userSlug",
            "TAG",
            "userName",
            "TAG",
            "parentSlug",
            "TAG",
            "shared",
            "NUMERIC",
            "topicSlug",
            "TAG",
            "reshare",
            "NUMERIC",
            "channelSlug",
            "TAG",
        ], //topicSlug - rootid, slug - threadid, qwiketid
    });
};
export default {
    cleanTest,
    resetTest,
    stopTest,
};
