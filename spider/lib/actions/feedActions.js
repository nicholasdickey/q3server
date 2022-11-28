//import { indexDisqusComments, indexQwikets } from "./qwiketActions.js";


import dbQwiket from "../db/dbQwiket.js"
import dbFeed from "../db/dbFeed.js"

import { dbLog, dbEnd, dbFetchLogByThreadid } from "../db.js"
import { setCDN, deleteOldCDN, loadCDN } from "../cdn.js"
//import { redis } from "../redis.js"
import { getRedisClient } from "../redis.js"
import fs from "fs"
//import { syncup as replicate } from "../replicate.js"
import { l, chalk, sleep, js, microtime, allowLog } from "../common.js"
import rules from "../rules.js"
//import UserAgent from "user-agents"


import Parser from "rss-parser"
import qwiketActions from "./qwiketActions.js"
import { SocksProxyAgent } from "socks-proxy-agent"

const dbServerNameX1 = process.env.DB_HOST_PRIMARY
const dbServerNameX2 = process.env.DB_HOST_SECONDARY
const redisServerX1 = process.env.REDIS_HOST_PRIMARY
const redisServerX2 = process.env.REDIS_HOST_SECONDARY
const redisPortX1 = process.env.REDIS_PORT_PRIMARY
const redisPortX2 = process.env.REDIS_PORT_SECONDARY

// Migration from versions < 10 (Silo 0,5,51)

const dbServerSilo5X1 = process.env.DB_HOST_SILO5_PRIMARY
const dbServerSilo5X2 = process.env.DB_HOST_SILO5_SECONDARY

const redisServerSilo5X1 = process.env.REDIS_SILO5_SERVER_X1
const redisServerSilo5X2 = process.env.REDIS_SILO5_SERVER_X2

const redisPortSilo5X1 = process.env.REDIS_SILO5_PORT_X1
const redisPortSilo5X2 = process.env.REDIS_SILO5_PORT_X2

const runFeed = async ({ tag, tags, silo, sessionid, threadid, username }) => {
    try {
        setTimeout(async () => {
            l(chalk.magenta.bold("TIMOUT!!!!!!!!!!!!", tag, threadid))
            const redis = await getRedisClient({});
            await redis.set(`feed-break-thread-${slug}-${threadid}`, 1, 'EX', 60000);
            await redis.quit();
            // resolve(val)
        }, process.env.FEED_TIMEOUT)
        const slug = tag
        const agent = new SocksProxyAgent(`socks5h://tor:9050`)
        console.log("FEED RUN:", slug, threadid);
        username = "feed " + slug
        // threadid = `${slug}-${Math.floor(Math.random() * 10000000)}`;
        let running = await getRunning({
            name: slug,
            silo,
            logContext: { sessionid, threadid, username },
        })
        if (running) {
            await stopRunning({
                name: slug,
                silo,
                logContext: { sessionid, threadid, username },
            })
            await sleep(3000)
        }
        // l("runFeed startRunning", js({ slug, silo }));
        await startRunning({
            name: slug,
            silo,
            logContext: { sessionid, threadid, username },
        })

        const result = await fetchFeed({
            slug,
            sessionid,
            threadid,
            username,
        })
        console.log("fetchFeed inside")
        if (!result.success) {
            l("fetchFeed failed")
            return result
        }
        if (slug == 'abcnews')
            l('*******************************************************************************************')
        const feed = result.feed
        l("feed started ", js({ slug }))
        await dbLog({
            show: false,
            type: "FEED",
            body: JSON.stringify(feed),
            threadid,
            sessionid,
            username,
        })
        if (process.env.LOGCRAWL == 1)
            await dbFeed.logCrawl({
                qwiket: {},
                silo,
                name: `feedActions:${slug}:silo:${silo}`,
                action: `Feed:fetched`,
                rule: slug,
                threadid,
                sessionid,
                username,

            })
        //   l(JSON.stringify({ feed }));
        if (feed.rss) {
            const rssFeeds = feed.rssFeeds
            const notor = feed.notor
            // l("RSS", JSON.stringify(rssFeeds));
            if (rssFeeds) {
                for (var i = 0; i < rssFeeds.length; i++) {
                    let rssFeed = rssFeeds[i]
                    let { rss, active, slug: rssSlug } = rssFeed

                    //  l("rssFeed:", "notor=", notor, js({ notor, rss, active, }), JSON.stringify({ rssFeed }));
                    if (active) {
                        let parser = new Parser({
                            timeout: 124000,
                            //defaultRSS: 2.0,
                            requestOptions: notor ? {} : { agent },
                            headers: {
                                "User-Agent":
                                    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
                            },
                        })
                        // l(chalk.green("Parser", js(parser)))

                        let rssFeed
                        try {
                            if (rss.indexOf("http") < 0) rss = `http://${rss}`
                            //  l(9999, rss)
                            rssFeed = await parser.parseURL(rss)
                        } catch (x) {
                            l(
                                chalk.red(
                                    "RSS PARSER EXCEPTION",
                                    rssFeed,
                                    rss,
                                    x
                                )
                            )
                        }
                        // l(chalk.blue("rss parsed", JSON.stringify(rssFeed)));
                        if (rssFeed) console.log(rssFeed.title)
                        const items = rssFeed ? rssFeed.items : []
                        await dbLog({
                            show: false,
                            type: "RSS",
                            body: JSON.stringify(items),
                            threadid,
                            sessionid,
                            username,
                        })
                        for (var j = 0; j < items.length; j++) {
                            const item = items[j]
                            if (slug == 'fnc')
                                item.link = item.guid;
                            //  l("rss item",js(item))
                            if (!item.link)
                                continue;
                            if (item.link.indexOf("http") < 0) continue
                            item.link = item.link.replace(
                                "minx.cc",
                                "acecomment.mu.nu"
                            )
                            let key = `spiderurl-${silo}-${item.link}`
                            /* console.log(
                                "NEW RSS",
                                item.title + ":" + item.link
                            );*/

                            /**==>  let value = await redis.get({
                                 key,
                                 server: redisServerX1,
                                 port: redisPortX1,
                                 logContext: { sessionid, threadid, username },
                             })*/
                            if (process.env.LOGCRAWL == 1)
                                await dbFeed.logCrawl({
                                    qwiket: item,
                                    silo,
                                    name: `feedActions:${slug}:silo:${silo}`,
                                    action: `Feed:got rss item`,
                                    rule: slug,
                                    threadid,
                                    sessionid,
                                    username,

                                })
                            const redis = await getRedisClient({});
                            let stop = await redis.get(`feed-break-thread-${slug}-${threadid}`);
                            if(stop)
                            l(chalk.magenta.bold("******************  GOT STOP", stop, slug, threadid))
                            if (stop) {
                                l(chalk.magenta.bold("******************  BREAKING", slug, threadid))
                                return;
                            };
                            let value = await redis.get(key);
                            if (value == 1&&!process.env.FEED2022) {
                                l(
                                    chalk.green.bold(
                                        "rss key less than an hour old, skipping"
                                    ),
                                    key,
                                    value
                                );
                                if (process.env.LOGCRAWL == 1)
                                    await dbFeed.logCrawl({
                                        qwiket: {},
                                        silo,
                                        name: `feedActions:${slug}:silo:${silo}`,
                                        action: `Feed:already running`,
                                        rule: slug,
                                        threadid,
                                        sessionid,
                                        username,

                                    })
                                continue
                            }
                            let avalue = "1"
                            let expire = 300
                            l("setting redis", js({ key, avalue, expire }))
                            try {

                                await redis.set(key, avalue, "EX", expire)

                                /* await redis.set({
                                     key,
                                     value: avalue,
                                     server: redisServerX1,
                                     port: redisPortX1,
                                     expire,
                                     logContext: {
                                         sessionid,
                                         threadid,
                                         username,
                                     },
                                 })*/
                            } catch (x) {
                                l(chalk.red.bold("CATCH 14", x))
                            }
                            redis.quit();
                            if (item.link) {
                                if (slug == 'fnc')
                                    l("call runUrl", rssSlug)
                                let result = await runUrl({
                                    primaryTag: rssSlug,
                                    source: "rss",
                                    feed,
                                    url: item.link,
                                    silo,
                                    tags,
                                    sessionid,
                                    threadid,
                                    rss: item,
                                    username,
                                })

                                /* l(
                                    chalk.cyan(
                                        `RETURNED from runUrl ${JSON.stringify(
                                            result
                                        )}`
                                    )
                                );*/
                            }
                        }
                    }
                }
            }
            if (feed.both != 1) {
                await dbLog({
                    show: false,
                    type: "END FEED",
                    body: JSON.stringify(feed),
                    threadid,
                    sessionid,
                    username,
                })
                await stopRunning({
                    name: slug,
                    silo,
                    logContext: { sessionid, threadid, username },
                })
                //33333 await dbEnd(threadid);
                l("END RSS FEED ", slug)
                return
            }
        }
        l("not rss", feed.root)
        const root = feed.root
        await runFeedUrl({
            level: 0,
            primaryTag: slug,
            feed,
            silo,
            tags,
            rootUrl: root,
            sessionid,
            threadid,
            username,
        })
        await stopRunning({
            name: slug,
            silo,
            logContext: { sessionid, threadid, username },
        })
        l("feed done", feed.root)
    } catch (x) {
        l(chalk.red.bold("EXCEPTION FEED", x, js(x)))
    }

    //33333 await dbEnd(threadid);
}
const postUrl = async ({ url, silo, tags, sessionid, threadid, username }) => {
    // 1. match subroots
    // 2. if not matches, match feeds
    // 3. runUrl
    // l("\n\n!!!!!! ===>postUrl", url, threadid);
    silo = silo ? silo : 3
    let matched = null
    /* let subFeeds = await dbFeed.fetchSubroots({
        sessionid,
        threadid,
        username,
        dbServerName: dbServerNameX1,
    });

    for (var i = 0; i < subFeeds.length; i++) {
        let subFeed = subFeeds[i];
        let subroot = subFeed.subroot;
        // l("!!!!!!!11111", subroot);
        let u = subroot.replace(/https:\/\//g, "").replace(/http:\/\//g, "");
        if (url.indexOf(u) >= 0) {
            //match
            l("matched", js(subFeed));
            matched = { rootslug: subFeed.rootSlug, slug: subFeed.slug };
            break;
        }
    } */
    // l(0);
    if (!matched) {
        let feeds = await dbFeed.fetchRoots({
            sessionid,
            threadid,
            username,

        })
        for (var i = 0; i < feeds.length; i++) {
            let subFeed = feeds[i]
            let subroot = subFeed.root
            //  l("!!!!!!!", JSON.stringify(subFeed));
            let u = subroot.replace(/https:\/\//g, "").replace(/http:\/\//g, "")
            if (url.indexOf(u) >= 0) {
                //match
                // l(chalk.green("matched", js(subFeed)));
                matched = { rootslug: subFeed.slug, slug: subFeed.slug }

                break
            }
        }
        if (!matched) {
            let feeds = await dbFeed.fetchLegacyRoots({
                sessionid,
                threadid,
                username,

            })
            for (var i = 0; i < feeds.length; i++) {
                let subFeed = feeds[i]
                let subroot = subFeed.root
                //  l("!!!!!!!", JSON.stringify(subFeed));
                let u = subroot
                    .replace(/https:\/\//g, "")
                    .replace(/http:\/\//g, "")
                // l("matching  url:", url, "to:", u);
                if (url.indexOf(u) >= 0) {
                    //match

                    matched = { rootslug: subFeed.slug, slug: subFeed.slug }
                    l("matched legacy Roots", js({ url, u, matched }))
                    break
                }
            }
        }
    }
    // l(1);
    let primaryTag = tags ? tags[0] : "generic"
    let rootTag = null
    if (matched) {
        primaryTag = matched.slug
        rootTag = matched.rootslug
    } else {
        rootTag = "generic"
    }
    //  l(js({ primaryTag, rootTag, matched }));
    let result = await fetchFeed({
        slug: primaryTag,
        sessionid,
        threadid,
        username,
    })
    // l("done fetchFeed");
    let feed
    if (!result.success) {
        feed = { category_xid: 21 }
    } else {
        feed = result.feed
    }
    //l(js({ feed }));
    const result2 = await runUrl({
        primaryTag,
        rootTag,
        feed,
        url,
        silo,
        source: "postUrl",
        tags,
        sessionid,
        threadid,
        username,
    })
    //l("END postUrl", js(result));
    return result2
}

const runFeedUrl = async ({
    primaryTag,
    feed,
    silo,
    tags,
    rootUrl,
    sessionid,
    threadid,
    username,
    level,
}) => {
    if (!level) level = 0
    let redis;
    try {
        redis = await getRedisClient({});
        console.log(
            "runFeed entry",
            js({ silo, primaryTag, rootUrl, level }),
            threadid
        )
        await startRunning({
            redis,
            name: primaryTag,
            silo,
            logContext: { sessionid, threadid, username },
        })
        try {
            let result = await runUrl({
                primaryTag,
                feed,
                url: rootUrl,
                silo,
                source: "runFeedUrl",
                tags,
                sessionid,
                threadid,
                username,
            })
            // l(chalk.cyan(`RETURNED from runUrl ${JSON.stringify(result)}`));
            if (result && result.childRefs) {
                let ch = result.childRefs.map((p) => p.split("#")[0])
                let childs = new Set(ch)
                let childRefs = [...childs]
                // l("has children", js(childRefs));
                for (var i = 0; i < childRefs.length; i++) {
                    let running = await getRunning({
                        name: primaryTag,
                        silo,
                        logContext: { sessionid, threadid, username },
                    })
                    if (running == 0) break
                    let childRef = childRefs[i]
                    let key = `spiderurl-${silo}-${childRef}`


                    let value = await redis.get(key);


                    /*  let value = await redis.get({
                          key,
                          server: redisServerX1,
                          port: redisPortX1,
                          logContext: { sessionid, threadid, username },
                      })*/
                    if (!value) {
                        let value = 1
                        let expire = 600
                        await redis.set(
                            key,
                            value,
                            { EX: expire }
                        )
                        // l(chalk.green(">>> feed descending:", level + 1, childRef));
                        let running = await getRunning({
                            redis,
                            name: primaryTag,
                            silo,
                            logContext: { sessionid, threadid, username },
                        })
                        //  l("running x:", running);
                        if (running == 1) {
                            // l("isRunning");
                            if (level < 3)
                                await runFeedUrl({
                                    primaryTag,
                                    feed,
                                    silo,
                                    rootUrl: childRef,
                                    sessionid,
                                    threadid,
                                    username,
                                    level: level + 1,
                                })
                            // l(chalk.blue("<<< feed back:", level + 1, childRef));
                        }
                    }
                }
            }
            //  console.log("runFeed exit", level, rootUrl);
        } catch (x) {
            l(chalk.red.bold("CATCH15", x))
        }
        if (level == 0)
            await stopRunning({
                redis,
                name: primaryTag,
                silo,
                logContext: { sessionid, threadid, username },
            })
    }
    finally {
        if (redis)
            await redis.quit();
    }
}
const runUrl = async ({
    primaryTag,
    //  rootTag,
    //  qpostid,

    url,
    feed,
    source,
    sessionid,
    threadid,
    username,
    silo,
    rss,
    tags,
}) => {
    try {
        await dbLog({
            show: false,
            type: "RUNURL",
            body: url,
            threadid,
            sessionid,
            username,
        })
        if (process.env.LOGCRAWL == 1)
            await dbFeed.logCrawl({
                qwiket: { url },
                silo,
                name: `feedActions:${primaryTag}:silo:${silo}`,
                action: `Feed:runUrl`,
                rule: primaryTag,
                threadid,
                sessionid,
                username,

            })
        let qwiket
        l(
            chalk.yellow.bold(
                "runUrl",
                // js({ feed }),
                silo,
                url,
                primaryTag

            )
        );
        //  index = index ? index : "sync"
        let logContext = {
            sessionid,
            threadid,
            username,
        }
        if (!feed) {
            let result = await fetchFeed({
                slug: primaryTag,
                sessionid,
                threadid,
                username,
            })
            if (result.success) feed = result.feed
        }
        if (!feed) {
            await dbLog({
                show: false,
                type: "NO FEED",
                body: JSON.stringify({ primaryTag, url }),
                threadid,
                sessionid,
                username,
            })
            return { success: false, qwiket: null }
        }

        // l(chalk.magenta.bold("feed:", js(feed)));
        let category_xid = feed["category_xid"]
        l(chalk.magenta.bold("feed:", js(feed["slug"]), silo, threadid))
        // try {
        let { item, childRefs } = await rules({
            pageUrl: url,
            rule: primaryTag,
            threadid,
            sessionid,
            username,
            silo,
            rss,
            tags,
            notor: feed["notor"],
        })
        /*} catch (x) {
            l(chalk.red.bold(x));
        }*/
        l("after rules", silo)

        if (item && process.env.LOGCRAWL == 1)
            await dbFeed.logCrawl({
                qwiket: item,
                silo,
                name: `${source}:feedActions:${username}:silo:${silo}`,
                action: item ? `Rule:accept` : `Rule:reject`,
                rule: primaryTag,
                threadid,
                sessionid,
                username,

            })
        //l("RULE returned ", item, threadid);
        // l(chalk.green("GOT ITEM", JSON.stringify(item)));

        if (item) {
            l(
                chalk.green.bold(
                    "GOT ITEM VALID",
                    silo,
                    item.url,
                    threadid

                )
            )
            let result;
            let itemUrl = item.url;
            let image = item.image;
            let qwiketid, q;
            item.category_xid = category_xid;
            item.reshare = 100;

            let check1 = await dbQwiket.checkUrl({
                input: { url: itemUrl, silo },
                sessionid,
                threadid,
                username,

            })
            if (check1.success && silo == 5) {
                // l(chalk.green.bold("checkUrl5:", dbServerNameX1))
                check1 = await dbQwiket.checkUrl({
                    input: { url: itemUrl, silo: 0 },
                    sessionid,
                    threadid,
                    username,
                    dbServerName: dbServerNameX1,
                })
                if (check1.success) {
                    check1 = await dbQwiket.checkUrl({
                        input: { url: itemUrl, silo: 51 },
                        sessionid,
                        threadid,
                        username,
                        dbServerName: dbServerNameX1,
                    })

                    if (check1.success) {
                        //  l(chalk.green.bold("checkUrl:", dbServerSilo5X1))
                        check1 = await dbQwiket.checkUrl({
                            input: { url: itemUrl, silo: 5 },
                            sessionid,
                            threadid,
                            username,
                            dbServerName: dbServerSilo5X1,
                        })
                    }
                }
            }

            //  l(333, "check", js(check1));
            /*   let check2 = await dbQwiket.checkUrl({
                    input: { url: itemUrl },
                    sessionid,
                    threadid,
                    username,
                    dbServerName: dbServerNameX2,
                });*/
            //  l(chalk.yellow.bold("CHECKS", JSON.stringify(check1)));
            qwiket = item

            let now = (Date.now() / 1000) | 0

            //qwiket.slug = slug;
            if (check1.success /* && check2.success*/) {
                //  l(chalk.green.bold("Q!QQ"))
                qwiketid = await dbQwiket.generateQwiketSlug({
                    input: {
                        qwiket: { title: item.title },
                        silo: silo == 5 ? 3 : silo,
                    },
                    sessionid,
                    threadid,
                    username,
                    dbServerName: silo == 5 ? dbServerSilo5X1 : dbServerNameX1,
                })
                qwiket.shared_time = now
            } else {
                if (
                    silo == 5 &&
                    qwiket.title == (check1.title || check1.q.title) &&
                    qwiket.description ==
                    (check1.description || check1.q.description) &&
                    qwiket.author == (check1.author || check1.q.author)
                ) {
                    l(chalk.yellow.bold("QWIKET EXISTS"))
                    await dbLog({
                        show: false,
                        type: "QWIKET EXISTS",
                        body: JSON.stringify({ check1, url }),
                        threadid,
                        sessionid,
                        username,
                    })
                    return { success: false, qwiket: null }
                }
                /* await dbLog({
                     show: false,
                     type: "QWIKET EXISTS BC",
                     body: JSON.stringify({
                         title: { title1: check1.q.title, title: qwiket.title },
                         description: {
                             description1: check1.q.description,
                             description: qwiket.description,
                         },
                         author: {
                             author1: check1.q.author,
                             author: qwiket.author,
                         },
                         slug: check1.slug,
                     }),
                     threadid,
                     sessionid,
                     username,
                 }) */
                //  l(99992);
                qwiket.slug = check1.slug
                qwiketid = qwiket.slug
                qwiket.shared_time = check1.shared_time
                qwiket.published_time = check1.published_time
                if (!qwiket.shared_time)
                    qwiket.shared_time = qwiket.published_time
                // l(8448);
                //return;
            }

            if (!qwiket.published_time)
                qwiket.published_time = qwiket.shared_time
            if (!qwiket.published_time) {
                qwiket.published_time = now
                qwiket.shared_time = now
            }
            if (username == "feed") {
                let published_ago = now - qwiket.published_time
                if (published_ago > 30 * 24 * 3600) {
                    qwiket.shared_time = qwiket.published_time
                }
            }
            if (qwiket.published_time >= now) {
                qwiket.published_time =
                    now - (Math.floor(Math.random() * 10) + 1) * 3 * 60
            }

            let stags = new Set()
            let tagsSlugs = []
            if (primaryTag) {
                stags.add(primaryTag)
                tagsSlugs.push({ type: 101, slug: primaryTag })
            }
            // l(111, stags);
            if (stags) {
                if (tags) stags.add(...tags)
                // l(112, stags);
                let tagsString = stags ? [...stags].join(",") : `""`
                // l(1121, tagsString);
                qwiket.tags = tagsString
                //l(11211, js(tagsSlugs));
                let s1 = [...stags]
                if (s1)
                    for (var i = 0; i < s1.length; i++) {
                        let t = s1[i]
                        //l(112110, t);
                        if (t != primaryTag)
                            tagsSlugs.push({ type: 1, slug: t })
                    }
                // l(11212, js(tagsSlugs));
                qwiket.tagsSlugs = JSON.stringify(tagsSlugs)
                // l(1122, tagsSlugs);
            }
            //   l(chalk.yellow("TAGS OBJECT", JSON.stringify(qwiket)));
            //console.log("Q3", q);
            // let q = qwiket;
            qwiket.slug = qwiketid
            qwiket.reshare = 100
            if (qwiket["body"] && typeof qwiket["body"] === "object")
                qwiket["body"] = JSON.stringify(qwiket["body"])
            //  l(441);
            if (process.env.LOGCRAWL == 1)
                await dbFeed.logCrawl({
                    qwiket,
                    silo,
                    name: `${source}:feedActions:${username}:silo:${silo}`,
                    action: `SAVE-READY`,
                    rule: primaryTag,
                    threadid,
                    sessionid,
                    username,

                })
            if (silo == 4) {
                await pushOutputQwiket({
                    sessionid,
                    threadid,
                    username,

                    source,
                    input: { qwiket, silo, primaryTag },
                })
            } else {
                l("calling dbQwiket.outputQueue", silo)
                if (silo == 5) {
                    if (qwiket) {
                        l(chalk.green.bold("2checkUrl:", dbServerSilo5X1))
                        let check = await dbQwiket.checkUrl({
                            input: { url, silo: 0 },
                            sessionid,
                            threadid,
                            username,
                            dbServerName: dbServerSilo5X1,
                        })
                        if (!check.success) {
                            qwiket = await processExistingQwiket({
                                qwiket,
                                xQwiket: check,
                                now,
                            })
                            if (!qwiket) return { success: false, qwiket: null }
                        }
                        l(chalk.green.bold("2checkUrl:", dbServerSilo5X1))
                        check = await dbQwiket.checkUrl({
                            input: { url, silo: 5 },
                            sessionid,
                            threadid,
                            username,
                            dbServerName: dbServerSilo5X1,
                        })
                        if (!check.success) {
                            qwiket = await processExistingQwiket({
                                qwiket,
                                xQwiket: check,
                                now,
                            })
                            if (!qwiket) return { success: false, qwiket: null }
                        }
                        l(chalk.green.bold("2checkUrl:", dbServerSilo5X1))
                        check = await dbQwiket.checkUrl({
                            input: { url, silo: 51 },
                            sessionid,
                            threadid,
                            username,
                            dbServerName: dbServerSilo5X1,
                        })
                        if (!check.success) {
                            qwiket = await processExistingQwiket({
                                qwiket,
                                xQwiket: check,
                                now,
                            })
                            if (!qwiket) return { success: false, qwiket: null }
                        }
                    }
                }
                l(chalk.cyan.bold("OUTPUT_QUEUE", qwiket.slug))
                await dbQwiket.outputQueue({
                    threadid,
                    sessionid,
                    username,
                    input: {
                        tagSlug: primaryTag,
                        qwiketSlug: qwiket.slug,
                        qwiket,
                        silo,
                    },
                })
                await dbLog({
                    show: false,
                    type: "AFTER OUTPUTQUEUE",
                    body: `url=${JSON.stringify(url)}, qwiket=${JSON.stringify(
                        qwiket
                    )},silo=${silo}`,
                    threadid,
                    sessionid,
                    username,
                })
            }
        } else {
            l("NO ITEM", threadid)
        }
        await dbLog({
            show: false,
            type: "END RUNURL",
            body: `url=${JSON.stringify(url)}, qwiket=${JSON.stringify(
                qwiket
            )}`,
            threadid,
            sessionid,
            username,
        })
        return { success: true, childRefs, qwiket }
    } catch (x) {
        l(chalk.red.bold("CATCH16", x))
        await dbLog({
            show: false,
            type: "ERROR RUNURL",
            body: `url=${JSON.stringify(url)}, x=${JSON.stringify(x)}`,
            threadid,
            sessionid,
            username,
        })
        return { success: false, exception: x, qwiket: null }
    }
}
const processExistingQwiket = async ({ now, qwiket, xQwiket }) => {
    qwiket.slug = xQwiket.slug
    if (
        xQwiket.q.title == qwiket.title &&
        xQwiket.q.author == qwiket.author &&
        xQwiket.q.description == qwiket.description
    )
        return false
    if (xQwiket.shared_time) qwiket.shared_time = xQwiket.shared_time
    qwiket.published_time = xQwiket.published_time
    if (!qwiket.shared_time) qwiket.shared_time = xQwiket.published_time
    if (!qwiket.shared_time) xQwiket.shared_time = now
    if (!qwiket.published_time)
        qwiket.published_time =
            now - (Math.floor(Math.random() * 10) + 1) * 3 * 60
    return qwiket
}
const pushOutputQwiket = async ({
    sessionid,
    threadid,
    username,

    input,
    qpostid,
    source,
}) => {
    let logContext = {
        sessionid,
        threadid,
        username,
    }
    let { qwiket, silo, primaryTag, now } = input
    let { url, shared_time } = qwiket
    let result
    l("pushOutputQwiket")
    if (silo == 5) {
        if (qwiket) {
            let check = await dbQwiket.checkUrl({
                input: { url, silo: 0 },
                sessionid,
                threadid,
                username,
                dbServerName: dbServerSilo5X1,
            })
            if (!check.success) {
                qwiket = processExistingQwiket({ qwiket, xQwiket: check, now })
                if (!qwiket) return false
            }
            check = await dbQwiket.checkUrl({
                input: { url, silo: 5 },
                sessionid,
                threadid,
                username,
                dbServerName: dbServerSilo5X1,
            })
            if (!check.success) {
                qwiket = processExistingQwiket({ qwiket, xQwiket: check, now })
                if (!qwiket) return false
            }
            check = await dbQwiket.checkUrl({
                input: { url, silo: 51 },
                sessionid,
                threadid,
                username,
                dbServerName: dbServerSilo5X1,
            })
            if (!check.success) {
                qwiket = processExistingQwiket({ qwiket, xQwiket: check, now })
                if (!qwiket) return false
            }

            qwiket.xid = 0
            //item.category_xid = category_xid;
            //  l(chalk.yellow(js({ category_xid })));
            let alt_categories = []
            let tagsSlugs = qwiket.tagsSlugs
                ? JSON.parse(qwiket.tagsSlugs)
                : null
            if (tagsSlugs) {
                for (var k = 0; k < tagsSlugs.length; k++) {
                    let t = tagsSlugs[k]

                    if (t.type == 1) {
                        let alt_result = await fetchFeed({
                            sessionid,
                            threadid,
                            username,
                            slug: t.slug,
                        })
                        if (alt_result.success) {
                            let alt_feed = alt_result.feed
                            let alt_category_xid = alt_feed["category_xid"]
                            alt_categories.push(alt_category_xid)
                        }
                    }
                }
                if (alt_categories && alt_categories.length > 0) {
                    l("silo5 alt_categories=", js(alt_categories))
                    qwiket.alt_categories = alt_categories
                }
            }
            qwiket.accepted = 1
            if (qpostid) qwiket.qpostid = qpostid
            qwiket.s_un = username
            qwiket.date = qwiket.shared_time
            qwiket.sort = qwiket.shared_time
            qwiket.primary = 1
            l(chalk.yellow.bold("SILO 5 PUSHING" /*, js(qwiket)*/))
            const redis = await getRedisClient({ server: process.env.REDIS_SILO5_SERVER_X, port: process.env.REDIS_SILO5_PORT_X, x: true });

            try {
                /* await redis.lpush({
                     server: process.env.REDIS_SILO5_SERVER_X1,
                     port: process.env.REDIS_SILO5_PORT_X1,
 
                     key: `items_output`,
                     value: js(qwiket),
                     logContext,
                 })*/
                l('redis.lpush')
                await redis.lpush(
                    `items_output`,
                    js(qwiket)
                )
                l('after redis.lpush')
                if (process.env.LOGCRAWL == 1)
                    await dbFeed.logCrawl({
                        qwiket: qwiket,
                        silo,
                        name: `${source}:feedActions:${username}:silo:${silo}`,
                        action: `PUSH items_output`,
                        rule: primaryTag,
                        threadid,
                        sessionid,
                        username,

                    })
            } catch (x) {
                l(chalk.red.bold("CATCH18", x))
                await dbLog({
                    show: false,
                    type: "SILO5 ERROR",
                    body: `Exception on lpush to ${process.env.REDIS_SILO5_SERVER_X}:${process.env.REDIS_SILO5_PORT_X}`,
                    threadid,
                    sessionid,
                    username,
                })
            }
            finally {
                redis.quit();
            }
        }
    }
    try {
        l("!!!!!!!!!!!!!!!>>>>>>>>>>")
        if (qwiket.locale == "cdn") {
            if (qwiket.image?.indexOf('ucarecdn') < 0) {
                let image = qwiket.image_src ? qwiket.image_src : qwiket.image

                l(chalk.magenta.bold("CDN ", image))
                let result = await setCDN({
                    image,
                    logContext: {
                        sessionid,
                        threadid,
                        username,
                    },
                })
                if (!result || !result.success) {
                    l(chalk.red.bold(`ERROR calling setCDN: ${result}`))
                }
                l("CDN result", result.image, result.image_src)
                qwiket.image = result.image
                qwiket.image_src = result.image_src
                /*result = await deleteOldCDN({
                    seconds: 7 * 24 * 3600,
                    logContext: {
                        sessionid,
                        threadid,
                        username,
                    },
                })
                // l(123);
                if (!result || !result.success) {
                    l(chalk.red.bold(`ERROR calling deleteOldCDN: ${result}`))
                }*/
            }
        }
        let localSilo = silo

        if (localSilo == 5) {
            return
            /*
            localSilo = 3;
            console.log("SAVING!!!!!!!!!!!!!!!!!!!!!!!!", qwiket.slug);
            qwiket.slug = qwiket.slug
                .replace("51-slug", "3-slug")
                .replace("5-slug", "3-slug");
                */
        }

        //  console.log("new qiketid", qwiketid);
        // qwiket.slug = qwiketid;
        await dbLog({
            show: false,
            type: "SAVE QWIKET",
            body: JSON.stringify(qwiket),
            threadid,
            sessionid,
            username,
        })
        result = await dbQwiket.save({
            input: qwiket,
            sessionid,
            threadid,
            username,
            action: "update",
            dbServerName: dbServerNameX1,
        })
        if (process.env.LOGCRAWL == 1)
            await dbFeed.logCrawl({
                qwiket,
                silo: localSilo,
                name: `${source}:feedActions:${username}:silo:${silo}`,
                action: `DB SAVE`,
                rule: primaryTag,
                threadid,
                sessionid,
                username,

            })
        // l(444);
        let saved = result.success
        result = await dbQwiket.fetch({
            sessionid,
            threadid,
            username,
            input: { slug: qwiket.slug },
        })

        //l("after fetch", JSON.stringify(result));
        if (result && result.success) qwiket = result.qwiket

        /* await dbLog({
             show: false,
             type: "AFTER FETCH",
             body: JSON.stringify(qwiket),
             threadid,
             sessionid,
             username,
         })
         */
        //  l("after 2", JSON.stringify(result));
        /*  if (saved) {
              console.log("SYNCUP:", JSON.stringify({ index, slug: qwiket.slug }))
              try {
                  result = await replicate({
                      index,
                      type: "qwiket",
                      slug: qwiket.slug,
                      supressLog: false,
                      logContext: { sessionid, threadid, username },
                  })
              } catch (x) {
                  l("Replicate Error", x)
              }
              console.log("SYNCUP DONE:", JSON.stringify({ slug: qwiket.slug }))
          } else {
              l("skipping save for existing silo 5")
          }*/
    } catch (x) {
        l("EXCEPTION12", x)
        await dbLog({
            show: false,
            type: "EXCEPT",
            body: JSON.stringify(x),
            threadid,
            sessionid,
            username,
        })
    }

}
const feedTicker = async ({ sessionid, threadid, username, source }) => {
    let items = await dbQwiket.fetchOutputQueue({
        threadid,
        sessionid,
        username,
        source,
    })
    //  if (items) console.log("feedTicker got items", JSON.stringify(items))
    if (items) {
        l('items.length', items.length);
        for (var i = 0; i < items.length; i++) {
            // l(112);
            let item = items[i]
            // l("item:", JSON.stringify(item))
            // l(113);
            let { shared_time, primaryTag, qwiket: qwiketString, silo } = item
            let qwiket
            if (typeof qwiketString !== "string") {
                qwiketString = Buffer.from(qwiketString).toString("base64")
            }
            try {
                qwiket =
                    typeof qwiketString === "string"
                        ? JSON.parse(qwiketString)
                        : qwiketString
            } catch (z) {
                l("Exception parsing qwiket in feedTicker", z)
            }
            /*l(
                "after qwiket parse:",
                JSON.stringify({ shared_time, qwiket, primaryTag, silo },
                    null,
                    4
                )
            );*/
            qwiket.shared_time = shared_time
            l('call pushOutputQwiket')
            await pushOutputQwiket({
                sessionid,
                threadid,
                username,

                source,
                input: { qwiket, silo, primaryTag },
            })
        }
    }
}
const saveFeed = async ({ feed, sessionid, threadid, username }) => {
    try {
        // index = index ? index : "sync"
        l("saveFeed", JSON.stringify(feed))
        if (
            feed.image == feed.image_src ||
            !feed.image_src ||
            (!feed.image && feed.image_src)
        ) {
            if (!feed.image) feed.image = feed.image_src
            l("CDN!!!", feed.image)
            if (feed.image && feed.image.indexOf("ucarecdn") < 0) {
                let image = feed.image_src ? feed.image_src : feed.image
                l("CDN2", image)
                l(chalk.magenta.bold("CDN ", image))
                let result = await setCDN({
                    image,
                    logContext: {
                        sessionid,
                        threadid,
                        username,
                    },
                })
                if (!result || !result.success) {
                    l(chalk.red.bold(`ERROR calling setCDN: ${result}`))
                }
                l("CDN result", result.image, result.image_src)
                feed.image = result.image
                feed.image_src = result.image_src
                /* result = await deleteOldCDN({
                     seconds: 7 * 24 * 3600,
                     logContext: {
                         sessionid,
                         threadid,
                         username,
                     },
                 })
                 // l(123);
                 if (!result || !result.success) {
                     l(chalk.red.bold(`ERROR calling deleteOldCDN: ${result}`))
                 }*/
            }
        }
        feed.micros = 0
        //  l("saving feed:", js(feed));
        let result = await dbFeed.saveFeed({
            sessionid,
            threadid,
            username,
            input: feed,
        })
        if (result.success) {
            let category_xid = result.category_xid
            /*result = await replicate({
                index,
                type: "feed",
                slug: feed.slug,
                supressLog: false,
                logContext: { sessionid, threadid, username },
            })*/
            console.log("END ACTION SAVE FEED")
            return { success: true }
        }
    } catch (x) {
        l(chalk.red.bold("CATCH19", x))
        return { success: false, exception: x }
    }
    return { success: false }
}
const fetchFeed = async ({ slug, sessionid, threadid, username }) => {
    try {
        l(chalk.green.bold("fetchFeed", slug));
        let result = await dbFeed.fetchFeed({
            sessionid,
            threadid,
            username,
            input: { slug },
        })
        l(chalk.green.bold("fetchFeedAction", JSON.stringify(result)))
        return result
    } catch (x) {
        l(chalk.red.bold("CATCH20", x))
        return { success: false, exception: x, feed: null }
    }
}
const validateFeedSlug = async ({ slug, sessionid, threadid, username }) => {
    try {
        let result = await dbFeed.validateFeedSlug({
            sessionid,
            threadid,
            username,
            input: { slug },
        })
        return result
    } catch (x) {
        l(chalk.red.bold("CATCH21", x))
        return { success: false, exception: x }
    }
}
const runDisqus = async ({ sessionid, threadid, username }) => {
    let run = 1
    let count = 0
    while (run) {
        if (count == 0)
            threadid = "disqus-toploop-" + Math.floor(Math.random() * 10000000)
        let start_time = ((Date.now() / 1000) | 0) - 3600

        l(
            chalk.magenta.bold(
                "CALLING indexDisqusComments",
                start_time,
                threadid
            )
        )
        try {
            await qwiketActions.indexDisqusComments({
                start_time,
                index: "qwikets",
                sessionid,
                threadid,
                username,
            })
        } catch (x) {
            l(chalk.magenta.bold("EXCEPTION indexDisqusComments", x, threadid))
        } finally {
            if (++count > 10) {
                count = 0
                l("dbEnd runDisqus topLoop", threadid)
                await dbEnd(threadid)
            }
        }
        start_time = ((Date.now() / 1000) | 0) - 1000

        // await sleep(30000)
    }
}
const runPreMigrate = async ({ sessionid, threadid, username }) => {
    let run = true
    let count = 0
    // while (run) {
    if (!count) threadid = "pm-" + Math.floor(Math.random() * 10000)
    l("feedTicker", threadid)
    try {
        let slugPrefix = 51
        let start_time = ((Date.now() / 1000) | 0) - 3600 * 1

        await qwiketActions.preMigrateQwikets({
            slugPrefix,
            start_time,
            index: "qwikets",
            sessionid,
            threadid,
            username,
        })
    } catch (x) {
        l(
            chalk.magenta.bold(
                `EXCEPTION indexQwikets PreMigrate threadid=${threadid}`,
                x
            )
        )
    } finally {
        if (++count > 10) {
            count = 0
            console.log("dbEnd runPreMigrate", threadid)
            await dbEnd(threadid)
        }
    }
    //    await sleep(10000)
    // }
}
const runLongMigrate = async ({ sessionid, threadid, username, slugPrefix }) => {
    let run = true
    let count = 0
    while (run) {
        if (!count) threadid = "pm-" + Math.floor(Math.random() * 10000)
        l("feedTicker", threadid);
        const redis = await getRedisClient({});
        try {
            //let slugPrefix = 51

            const key = `long-migrate-${slugPrefix}`;
            let start_xid = await redis.get(key);
            if (!start_xid) {
                start_xid = 0;//((Date.now() / 1000) | 0) - 3600 * 24 * 2
                l(chalk.green.bold("START runLongMigrate from scratch"))
                await redis.set(key, "" + start_xid);
            }
            //if no more do migrate, return 0
            start_xid = await qwiketActions.longMigrateQwikets({
                slugPrefix,
                start_xid,
                index: "qwikets",
                sessionid,
                threadid,
                username,
            })
            await redis.set(key, "" + start_xid);
        } catch (x) {
            l(
                chalk.magenta.bold(
                    `EXCEPTION indexQwikets PreMigrate threadid=${threadid}`,
                    x
                )
            )
        } finally {
            redis.quit();
            if (++count > 10) {
                count = 0
                run = false;
                console.log("dbEnd runPreMigrate", threadid)
                await dbEnd(threadid)
            }
        }
        // await sleep(10000)
    }
}
const runIndexQwikets = async ({ sessionid, threadid, username }) => {
    let run = true
    let count = 0
    // while (run) {
    if (!count) threadid = "pm-" + Math.floor(Math.random() * 10000)
    l("feedTicker", threadid)
    try {
        let slugPrefix = 51
        let start_time = ((Date.now() / 1000) | 0) - 3600

        await qwiketActions.indexQwikets({
            slugPrefix,
            start_time,
            index: "qwikets",
            sessionid,
            threadid,
            username,
        })
    } catch (x) {
        l(
            chalk.magenta.bold(
                `EXCEPTION indexQwikets PreMigrate threadid=${threadid}`,
                x
            )
        )
    } finally {
        if (++count > 10) {
            count = 0
            console.log("dbEnd runPreMigrate", threadid)
            await dbEnd(threadid)
        }
    }
    //  await sleep(10000)
    // }
}
const runOutputQueue = async ({ sessionid, username }) => {
    let run = true
    l("RUN OUTPUT QUEUE")
    let count = 0
    let threadid
    while (run) {
        if (!count) threadid = "oq-" + Math.floor(Math.random() * 10000)
        l(chalk.yellow.bold("runOutputQueue", threadid))
        try {
            await feedTicker({
                sessionid,
                threadid,
                username,

                source: "runOutputQueue",
            })
        } catch (x) {
            l("top level X runOutputQueue", x)
        } finally {
            if (++count > 10) {
                count = 0
                l("dbEnd runOutputQueue")
                await dbEnd(threadid)
            }
        }
        await sleep(10000)
    }
}
const runFeedsAction = async ({ silo, sessionid, threadid, username, feedName }) => {
    allowLog()
    console.log("ENTERED runFeeds", feedName);
    let key = `feeds-last-${silo}`
    // l("runFeeds==>", js({ silo }));
    let startTime = ((Date.now() / 1000) | 0) - 3600
    let logContext = {
        sessionid,
        threadid,
        username,
    }
    // const redis = await getRedisClient({});
    //console.log("got client")
    try {
        await startRunning({ name: `all`, silo, logContext })


        l(chalk.green("ENDED INIT THREAD", threadid))

        if (feedName) {
            l(chalk.green("calling runFeed", feedName))
            return runFeed({

                silo,
                tag: feedName,
                sessionid,
                threadid,
                username,
            })

        }
    }
    finally {

        await dbEnd(threadid)
    }
    if (!process.env.AUTO_FEED && !process.env.AUTO_FEED2022)
        return;
    let run = true
    let count = 0
    // while (run) {
    if ((count = 0))
        threadid = "rf-" + Math.floor(Math.random() * 100000000)
    const redis = await getRedisClient({});

    let noop = true
    l(chalk.yellow("new feed threadid", threadid))
    try {
        run = await getRunning({ redis, silo, name: "all", logContext })
        if (!run) {
            return;
        }
        // l(111)
        /* let lastFeeds = await redis.zrevrange({
             key,
             start: 0,
             withscores: true,
             stop: -1,
             logContext,
         }) */
        let res = await redis.zrevrange(
            key,
            0,
            -1,
            'WITHSCORES')
        let lastFeeds = [];
        for (var i = 0; i < res.length; i++) {
            lastFeeds.push({ value: res[i], score: res[++i] });
        }
        // l(222,lastFeeds)
        let feeds = await dbFeed.fetchActiveFeeds({
            sessionid,
            threadid,
            username,
            dbServerName: dbServerNameX1,
        })
        //  l(chalk.yellow("activeFeeds", js(feeds)));
        //feeds=feeds.filter(p=>p.slug=='fnc')
       /* feeds = feeds.map((f) => {
            //if(f.slug!='americanthinker')
            // return null;LOGC
            if (f.slug == 'fnc')
                l("f:", f);
            let now = (Date.now() / 1000) | 0
            let score = now - 305
            if (lastFeeds)
                for (var i = 0; i < lastFeeds.length; i++) {
                    let f1 = lastFeeds[i]
                    if (f.slug == 'fnc')
                        l('f1:', f1)
                    if (f1.value == f.slug) {
                        score = f1.score
                        break
                    }
                }
            return {

                value: f.slug,
                score,
                minTimeout: f.minTimeout
            }
            
        })*/
        //  l("combnined feeds:", js(feeds));
        /*  Promise.delay = function (t, val) {
              return new Promise((resolve) => {
                 // setTimeout(resolve.bind(null, val), t)
                 setTimeout(async ()=>{
 
                  const redis = await getRedisClient({});
                  redis.set(`feeds-break-thread-${threadid}`,1,'EX',10000);
                  resolve(val)
                 }, t)
              })
          }*/

        /* Promise.raceAll = function (promises, timeoutTime, timeoutVal) {
             return Promise.all(
                 promises.map((p) => {
                     return Promise.race([
                         p,
                         // Promise.delay(timeoutTime, timeoutVal),
                     ])
                 })
             )
         }*/
        if (feeds) {
            //let f = async () => {
            l("build Promises")
            feeds = feeds.map((f) => {
                 l("f:", f);
                let score = 0
                if (lastFeeds)
                    for (var i = 0; i < lastFeeds.length; i++) {
                        let f1 = lastFeeds[i]
                        if (f1.value == f.slug) {
                            score = f1.score
                            break
                        }
                    }
                return {
                    value: f.slug,
                    score,
                    minTimeout:f.timeout
                }
            })
            // l("combnined feeds:", js(feeds));
            Promise.delay = function (t, val) {
                return new Promise((resolve) => {
                    setTimeout(resolve.bind(null, val), t)
                })
            }

            Promise.raceAll = function (promises, timeoutTime, timeoutVal) {
                return Promise.all(
                    promises.map((p) => {
                        return Promise.race([
                            p,
                            Promise.delay(timeoutTime, timeoutVal),
                        ])
                    })
                )
            }
            if (feeds) {
                let f = async () => {
                    let promises = feeds.map(async (feed) => {
                        l("feed:", js(feed));
                        let now = (Date.now() / 1000) | 0
                        let ago = now - feed.score
                        l(
                            chalk.blue.bold(
                                "*****************************feed:",
                                js(feed),
                                js({ ago })
                            )
                        )
                        if (ago < 300||feed.minTimeout*60*1000>process.env.FEED_TIMEOUT) return
                        l(
                            chalk.blue.bold(
                                "=============>>>>feed:",
                                js(feed),
                                js({ ago })
                            )
                        )
                        if (
                            await getRunning({
                                silo,
                                name: feed.value,
                                logContext,
                            })
                        ) {
                            l("running, so return")
                            return
                        }
                        if (
                            !(await getRunning({
                                silo,
                                name: "all",
                                logContext,
                            }))
                        ) {
                            l("no 'all', return")
                            return
                        }
                        noop = false

                        const tag = feed.value
                        await sleep(Math.floor(Math.random() * 30000))
                        l(`CALL runFeed`, tag, threadid)
                        await runFeed({
                            silo,
                            tag,
                            sessionid,
                            threadid,
                            username,
                        })
                        l(chalk.green.bold(`FEED done`, tag, threadid))
                        //return resolve();

                        // await sleep(5000);
                    })
                    await Promise.raceAll(promises, process.env.TIMEOUT, null)
                }
                await f()
                l("dbEnd runFeeds", threadid)
                //if (++count > 200) {
                count = 0
                l(chalk.green("all feeds loop end", threadid))
                await dbEnd(threadid)
                threadid = `removed-${threadid}`
            }
                //break;
                //}
                // l("ALL FEEDS IN A LOOP DONE", threadid)
            }
        } finally {

            await redis.quit();
            l("finally")
        }

        if (noop) {
            l("sleep", threadid)
            await sleep(10000)
        }
        // }

    }

const stopFeeds = async ({ silo, sessionid, threadid, username }) => {
        let logContext = {
            sessionid,
            threadid,
            username,
        }

        const redis = await getRedisClient({});
        try {
            await stopRunning({ redis, name: `all`, silo, logContext })
            let key = `feeds-last-${silo}`

            /*let feeds = await redis.zrevrange({
                key,
                start: 0,
                withscores: true,
                stop: -1,
                logContext,
            })*/
            let res = await redis.zrevrange(
                key,
                0,
                -1,
                'WITHSCORES'
            )
            let feeds = [];
            for (var i = 0; i < res.length; i++) {
                feeds.push({ value: res[i], score: res[++i] });
            }
            if (feeds) {
                feeds.forEach(async (feed) => {
                    stopRunning({ redis, silo, name: feed.value, logContext })
                })
            }
        }
        finally {
            redis.quit();
        }
    }
    const feedsStatus = async ({ sessionid, silo, threadid, username }) => {
        const redis = await getRedisClient({});
        try {
            let key = `feeds-last-${silo}`

            let logContext = { sessionid, threadid, username }
            //l("logcontext:", js(logContext));
            let res = await redis.zrevrange(
                key,
                0,
                -1,
                'WITHSCORES'
            )
            let feeds = [];
            for (var i = 0; i < res.length; i++) {
                feeds.push({ value: res[i], score: res[++i] });
            }
            l(1, js(feeds));
            let runningFeeds = []
            let lastFeeds = []
            const now = (Date.now() / 1000) | 0
            for (var i = 0; i < feeds.length; i++) {
                let feed = feeds[i]
                const statusKey = `feed-${silo}-running-${feed.value}`;
                let status = await redis.get(
                    statusKey
                )
                l("feedsStatus runningFeeds", statusKey, status);
                if (+status) runningFeeds.push({ name: feed.value, status })

                lastFeeds.push({ name: feed.value, last: now - feed.score })
            }
            return { success: true, lastFeeds, runningFeeds }
        } catch (x) {
            l(chalk.red.bold("CATCH22", x))
            return { success: false, exception: x }
        }
        finally {
            redis.quit();
        }
    }
    const getRunning = async ({ name, silo, logContext }) => {
        let key = `feed-${silo}-running-${name}`
        const redis = await getRedisClient({});
        // l("getRunning", key, redis.status)
        try {
            //l(99)
            let value = await redis.get(
                key
            )
            //  l(100)
            l("getRunning result", js({ key, logContext, value }));

            return +value
        }
        catch (x) {
            l(chalk.red(x))
        }
        finally {
            redis.quit();
        }
    }
    const startRunning = async ({ name, silo, logContext }) => {
        console.log("startRunning", name);
        let key = `feed-${silo}-running-${name}`
        const redis = await getRedisClient({});
        //l("ss")
        try {
            // l(33, key)
            let value = await redis.get(
                'test'
            )
            // l(11)
            await redis.set(
                key,
                1,
                'EX',
                (name == "all" ? 24 * 3600 : 300),


            )
            // l(chalk.blue("after redis.set"))
            let now = (Date.now() / 1000) | 0
            key = `feeds-last-${silo}`
            // l("calling zadd", js({ key, now, name }));
            await redis.zadd(
                key,
                now,
                name,
            )
            /*
             await redis.zadd({
                key,
                score: now,
                value: name,
                server: redisServerX1,
                port: redisPortX1,
                logContext,
            })*/
            // console.log("startRunning ADDED feeds-last", key, now, name);
        }
        finally {
            redis.quit();
        }
    }
    const stopRunning = async ({ name, silo, logContext }) => {
        // console.log("stopRunning", name);
        const redis = await getRedisClient({});
        try {
            let key = `feed-${silo}-running-${name}`
            await redis.del(
                key
            );
        }
        finally {
            redis.quit();
        }
    }

    export default {
        postUrl,
        runUrl,
        runFeedUrl,
        runFeed,
        saveFeed,
        fetchFeed,
        validateFeedSlug,
        feedsStatus,
        getRunning,
        startRunning,
        stopRunning,
        runFeedsAction,
        stopFeeds,
        runDisqus,
        feedTicker,
        runOutputQueue,
        runPreMigrate,
        runLongMigrate,
        runIndexQwikets,
    }
