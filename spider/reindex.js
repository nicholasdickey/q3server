// ./reindex.js
//require("dotenv").config();
//require = require("esm")(module /*, options*/);
import { redis } from "./lib/redis.js";
import { dbEnd } from "./lib/db.js";
//const dbQwiket = require("./db/dbQwiket");
import qwiketActions from "./lib/actions/qwiketActions.js";
import { l, chalk, microtime, allowLog } from "./lib/common.js";

//node script to be run from the terminal or pm2

/*
    Create Redisearch Indexes and repolulate them from the DB
     await redis.ft_add({
                index: 'brands', slug: brandSlug, name: brand.name,
                description: brand.description,
                image: brand.image, url: brand.url
            })

*/
const args = process.argv.slice(2);
const drop = args[0];
const source = args[1];
const server = args[2];
const port = args[3];
let page = 0;
let size = 1500;
const sessionid = "reindex-ql-session";
const username = "reindex";
const threadid = Math.floor(Math.random() * 10000);

async function reindex() {
    l("inside reindex:", JSON.stringify({ drop, source, server, port }));
    try {
        if (drop == "dropIndexes")
        l("drop alerts")
            await redis.ft_drop({
                index: "alerts",
                server,
                port,
                logContext: { sessionid, threadid, username },
            });

        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "alerts",
            prefix: "alert:",
            schema: [
                "SCHEMA",
                "slug",
                "TAG",
                "userSlug",
                "TAG",
                "title",
                "TEXT",
                "body",
                "TEXT",
                "NOINDEX",
                "viewed",
                "TAG",
                "link",
                "TEXT",
                "NOINDEX",
                "date",
                "NUMERIC",
                "SORTABLE",
                "micros",
                "NUMERIC",
                "SORTABLE",
            ],
        });
        if (drop == "dropIndexes")
            await redis.ft_drop({
                index: "newslines",
                server,
                port,
                logContext: { sessionid, threadid, username },
            });
        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "newslines",
            prefix: "nsl:",
            schema: [
                "SCHEMA",
                "slug",
                "TAG",
                "entitySlug",
                "TAG",
                "definition",
                "TEXT",
                "NOINDEX",
                "micros",
                "NUMERIC",
                "SORTABLE",
            ],
        });
        if (drop == "dropIndexes")
            await redis.ft_drop({
                index: "metatags",
                server,
                port,
                logContext: { sessionid, threadid, username },
            });
        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "metatags",
            prefix: "metatag:",
            schema: [
                "SCHEMA",
                "slug",
                "TAG",
                "entitySlug",
                "TAG",
                "definition",
                "TEXT",
                "NOINDEX",
                "micros",
                "NUMERIC",
                "SORTABLE",
            ],
        });
        if (drop == "dropIndexes")
            await redis.ft_drop({
                index: "channels",
                server,
                port,
                logContext: { sessionid, threadid, username },
            });
        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "channels",
            prefix: "channel:",
            schema: [
                "SCHEMA",
                "slug",
                "TAG",
                "entity",
                "TAG",
                "forum",
                "TEXT",
                "NOINDEX",
                "config",
                "TEXT",
                "NOINDEX",
                "micros",
                "NUMERIC",
                "SORTABLE",
            ],
        });

        if (drop == "dropIndexes")
            await redis.ft_drop({
                index: "users",
                server,
                port,
                logContext: { sessionid, threadid, username },
            });
        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "users",
            prefix: "u:",
            schema: [
                "SCHEMA",
                "slug",
                "TAG",
                "user_name",
                "TEXT",
                "joined_slug",
                "TAG",
                "subscr_status",
                "NUMERIC",
                "NOINDEX",
                "alias_slug",
                "TAG",
                "micros",
                "NUMERIC",
                "SORTABLE",
            ],
        });

        if (drop == "dropIndexes")
            await redis.ft_drop({
                index: "sync",
                server,
                port,
                logContext: { sessionid, threadid, username },
            });
        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "sync",
            prefix: "sync:",
            schema: [
                "SCHEMA",
                "state",
                "NUMERIC",
                "slug",
                "TAG",
                "type",
                "TAG",
                "block",
                "TEXT",
                "NOINDEX",
                "micros",
                "NUMERIC",
                "SORTABLE",
            ],
        });

        if (drop == "dropIndexes")
            await redis.ft_drop({
                server,
                port,
                index: "qwikets",
                logContext: { sessionid, threadid, username },
            });
        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "qwikets",
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
                "TAG",
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
                "TAG",
                "NOINDEX",
                "userSlug",
                "TAG",
                "userName",
                "TAG",
                "parentSlug",
                "TAG",
                "shared",
                "TAG",
                "topicSlug",
                "TAG",
                "reshare",
                "TAG",
                "channelSlug",
                "TAG",
            ], //topicSlug - rootid, slug - threadid, qwiketid
        });
        await redis.ft_drop({
            server,
            port,
            index: "test-qwikets",
            logContext: { sessionid, threadid, username },
        });
        await redis.ft_create({
            server,
            port,
            logContext: { sessionid, threadid, username },
            index: "test-qwikets",
            prefix: "t-q:",
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
                "TAG",
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
                "TAG",
                "NOINDEX",
                "userSlug",
                "TAG",
                "userName",
                "TAG",
                "parentSlug",
                "TAG",
                "shared",
                "TAG",
                "topicSlug",
                "TAG",
                "reshare",
                "TAG",
                "channelSlug",
                "TAG",
            ], //topicSlug - rootid, slug - threadid, qwiketid
        });
    } catch (x) {
        l(chalk.red(l));
    }
    /* if (drop == 'dropIndexes')
         await redis.ft_drop({ index: 'reviews' });
     await redis.ft_create({
         index: 'reviews', schema: ["SCHEMA", "slug", "TAG", "title", "TEXT", "WEIGHT", 2,
             "description", "TEXT", "WEIGHT", 1.2, "publicationSlug", "TAG", "productSlug", "TAG",
             "author", "TEXT", "NOINDEX", "sentimentScore", "NUMERIC", "SORTABLE", "stars", "TEXT", "NOINDEX", "fakespot", "TEXT", "NOINDEX", "verified", "NUMERIC", "NOINDEX", "location", "TEXT", "NOINDEX"]
     });
     if (drop == 'dropIndexes')
         await redis.ft_drop({ index: 'publications' });
     await redis.ft_create({
         index: 'publications', schema: ["SCHEMA", "slug", "TAG", "name", "TEXT", "WEIGHT", 2,
             "description", "TEXT", "WEIGHT", 1.2, "url", "TEXT", "NOINDEX", "image", "TEXT", "NOINDEX"]
     });
     if (drop == 'dropIndexes')
         await redis.ft_drop({ index: 'categories' });
     await redis.ft_create({ index: 'categories', schema: ["SCHEMA", "slug", "TAG", "name", "TEXT", "path", "TEXT", "NOINDEX"] }); */
    // const username = "reindex";

    try {
        // const published_time = Date.parse('January 1, 2019 12:00:00 GMT') / 1000 | 0
        if (source == "all1" || source == "qwiket") {
            l(chalk.blue.bold("INSIDE source qwiket"));
            // for (let slugPrefix = 1; slugPrefix < 6; slugPrefix++) {
            let slugPrefix = 51;
            let start_time = ((Date.now() / 1000) | 0) - 24*3600 * 365*4;

            await qwiketActions.indexQwikets({
                slugPrefix,
                start_time,
                index: "qwikets",
                sessionid,
                threadid,
                username,
            });
        }
        if (source == "disqus" || source == "all1") {
            /*
             start_time,
    index,
    sessionid,
    threadid,
    username,
    */
            let start_time = ((Date.now() / 1000) | 0) - 3600 * 1;
            await qwiketActions.indexDisqusComments({
                start_time,
                index: "qwikets",
                sessionid,
                threadid,
                username,
            });
            /*let cont = true;
            while (cont) {
                const createdat =
                    (Date.parse("September 1, 2019 12:00:00 GMT") / 1000) | 0;
                const qwiketInput = {
                    page,
                    size,
                    createdat,
                };
                const username = "reindex";

                // l(JSON.stringify(qwiketInput))
                let {
                    success,
                    qwikets: inputQwikets,
                    rawRows,
                } = await dbQwiket.fetchAllDisqus({
                    sessionid,
                    threadid,
                    qwiketInput,
                    username,
                });
                if (success) {
                    for (var i = 0; i < inputQwikets.length; i++) {
                        //  l(chalk.blue(inputQwikets[i].value));
                        const q = inputQwikets[i];
                        l(chalk.blue.bold(JSON.stringify(q)));
                        //let tagsString = `""`;

                        //   if (typeof q["body"] === "object")
                        //       q["body"] = JSON.stringify(q["body"])
                        const type = 0; //0 - disqus, 1 - qwiket;
                        let shared = 1;
                        const record = {
                            index: "qwikets",
                            slug: q["id"],
                            fields: {
                                title: q["thread_title"],
                                slug: q["id"],
                                description: `""`,
                                body: q["message"] ? q["message"] : `""`,
                                author: q["author_username"]
                                    ? q["author_username"]
                                    : `""`,
                                tags: q["tag"] | `""`,
                                type: type,
                                published_time: q["createdat"],
                                shared_time: q["createdat"],
                                site_name: "disqus",
                                edited: 0,
                                userSlug: q["author_username"] || "",
                                userName: q["author_name"] || `""`,
                                parentSlug: q["parent"] | `""`,
                                topicSlug: q["qwiketSlug"] | `""`,
                                url: `${q["qwiketUrl"]}/cc/comment-${q["id"]}/$comment-${q["id"]}`,
                                shared,
                                channelSlug: q["channelSlug"],
                                reshare: 2,
                            },
                            replace: true,
                            server,
                            port,
                            logContext: { sessionid, threadid, username },
                        };
                        l(chalk.cyan(JSON.stringify(record, null, 4)));
                        await redis.ft_add(record);
                        l("after add record");
                    }
                    
                    if (page++ > 3) break;
                    l(chalk.green(`continue page:`, page));
                } else {
                    if (page++ > 3) break;
                    if (rawRows > 0) l(chalk.green(`continue page:`, page));
                    else {
                        l(
                            chalk.green.bold(
                                "NO RETURN: last page break:",
                                page
                            )
                        );
                        cont = false;
                    }
                }
            }*/
        }
    } catch (x) {
        l(chalk.red.bold("EXCEPTION", x, JSON.stringify(x, null, 4)));
    } finally {
        await dbEnd(threadid);
    }
}
allowLog();
l("starting reindex script");
reindex();
