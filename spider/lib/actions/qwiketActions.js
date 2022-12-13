import dbQwiket from "../db/dbQwiket.js";

import { dbLog, dbEnd } from "../db.js";

import { redis, getRedisClient } from "../redis.js";
//import { getRedisClient } from "../lib/redis.js"
import { l, chalk, js } from "../common.js";
const dbServerNameX1 = process.env.DB_HOST_PRIMARY;
const dbServerNameX2 = process.env.DB_HOST_SECONDARY;

const redisServerX1 = process.env.REDIS_HOST_PRIMARY;
const redisServerX2 = process.env.REDIS_HOST_SECONDARY;
const redisPortX1 = process.env.REDIS_PORT_PRIMARY;
const redisPortX2 = process.env.REDIS_PORT_SECONDARY;

const redisTargetServerX1 = process.env.REDIS_SILO5_SERVER_X1;
const redisTargetServerX2 = process.env.REDIS_SILO5_SERVER_X2;
const redisTargetPortX1 = process.env.REDIS_SILO5_PORT_X1;
const redisTargetPortX2 = process.env.REDIS_SILO5_PORT_X2;
const dbTargetServerNameX1 = process.env.DB_HOST_SILO5_PRIMARY;
const dbTargetServerNameX2 = process.env.DB_HOST_SILO5_SECONDARY;

const PAGE_SIZE = 10;
const TOTAL_SIZE = 1000;
const longMigrateTable = async ({
    table,
    start_xid,
    index,
    sessionid,
    threadid,
    username,
}) => {
    const size = 500;
    //let cont = 1;
    let page = 0;

    try {
        start_xid = await dbQwiket.longMigrateTable({
            sessionid,
            threadid,
            username,
            input: {
                table,
                start_xid: start_xid,
                page,
                size,
                source: process.env.DB_HOST_SILO5_PRIMARY,
                target1: process.env.DB_HOST_PRIMARY,

            },
        });
    } catch (x) {
        l(chalk.red(`9987`, x));
    }
    l("returning", start_xid)
    return start_xid;
};
const longMigrateQwikets = async ({
    slugPrefix,
    start_xid,
    index,
    sessionid,
    threadid,
    username,
}) => {
    const size = 500;
    //let cont = 1;
    let page = 0;

    try {
        start_xid = await dbQwiket.longMigrateQwiketRecords({
            sessionid,
            threadid,
            username,
            input: {
                slugPrefix,
                start_xid: start_xid,
                page,
                size,
                source: process.env.DB_HOST_SILO5_PRIMARY,
                target: process.env.DB_HOST_PRIMARY,

            },
        });
    } catch (x) {
        l(chalk.red(`9987`, x));
    }

    return start_xid;
};

const preMigrateQwikets = async ({
    slugPrefix,
    start_time,
    index,
    sessionid,
    threadid,
    username,
}) => {
    const size = 50;
    let cont = 1;
    let page = 0;
    let rows = 0;
    while (cont) {
        try {
            rows = await dbQwiket.migrateQwiketRecords({
                sessionid,
                threadid,
                username,
                input: {
                    slugPrefix,
                    published_time: start_time,
                    page,
                    size,
                    source: process.env.DB_HOST_SILO5_PRIMARY,
                    target1: process.env.DB_HOST_PRIMARY,
                    target2: process.env.DB_HOST_SECONDARY,
                },
            });
        } catch (x) {
            l(chalk.red(`9987`, x));
        }
        if (rows == 0) {
            cont = false;
            l(chalk.red.bold("PRE-MIGRATE X1 STOP", page, rows, start_time));
        } else {
            page++;
            l(chalk.green.bold("PRE-MIGRATE X1 CONTINUE", page));
        }
    }

    console.log(
        "====== after migrateQwiketRecords",
        process.env.DB_HOST_SILO5_PRIMARY
    );
    /*  page = 0;
      while (cont) {
          try {
              rows = await dbQwiket.migrateQwiketRecords({
                  sessionid,
                  threadid,
                  username,
                  input: {
                      slugPrefix,
                      published_time: start_time,
                      page,
                      size,
                      source: process.env.DB_HOST_SILO5_SECONDARY,
                      target1: process.env.DB_HOST_PRIMARY,
                      target2: process.env.DB_HOST_SECONDARY,
                  },
              });
          } catch (x) {
              l(chalk.red(`876111`, x));
          }
          console.log(
              "====== after migrateQwiketRecords",
              process.env.DB_HOST_SILO5_SECONDARY
          );
          if (rows < size) {
              cont = false;
              l(chalk.red.bold("PRE-MIGRATE X2 STOP", page));
          } else {
              page++;
              l(chalk.green.bold("PRE-MIGRATE X2 CONTINUE", page));
          }
      }*/
};
const indexQwikets = async ({
    slugPrefix,
    start_time,
    index,
    sessionid,
    threadid,
    username,
}) => {
    const size = 50;
    let cont = 1;
    let page = 0;
    let rows = 0;

    l('indexQwikets')
    /*
        if (process.env.PRE_MIGRATE == 1||process.env.PRE_MIGRATE2022) {
            while (cont) {
                try {
                    rows = await dbQwiket.migrateQwiketRecords({
                        sessionid,
                        threadid,
                        username,
                        input: {
                            slugPrefix,
                            published_time: start_time,
                            page,
                            size,
                            source: process.env.DB_HOST_SILO5_PRIMARY,
                            target1: process.env.DB_HOST_PRIMARY,
                            target2: process.env.DB_HOST_SECONDARY,
                        },
                    });
                } catch (x) {
                    l(chalk.red(`9987`, x));
                }
                console.log(
                    "====== after migrateQwiketRecords",
                    process.env.DB_HOST_SILO5_PRIMARY
                );
                if (rows < size) {
                    cont = false;
                    l(chalk.blue.bold("indexQwikets X1 STOP", page));
                } else {
                    page++;
                    l(chalk.green.bold("indexQwikets X1 CONTINUE", page));
                }
            }
            while (cont) {
                try {
                    rows = await dbQwiket.migrateQwiketRecords({
                        sessionid,
                        threadid,
                        username,
                        input: {
                            slugPrefix,
                            published_time: start_time,
                            page,
                            size,
                            source: process.env.DB_HOST_SILO5_SECONDARY,
                            target1: process.env.DB_HOST_PRIMARY,
                            target2: process.env.DB_HOST_SECONDARY,
                        },
                    });
                } catch (x) {
                    l(chalk.red(`876111`, x));
                }
                console.log(
                    "====== after migrateQwiketRecords",
                    process.env.DB_HOST_SILO5_SECONDARY
                );
                if (rows < size) {
                    cont = false;
                    l(chalk.blue.bold("indexQwikets X2 STOP", page));
                } else {
                    page++;
                    l(chalk.green.bold("indexQwikets X2 CONTINUE", page));
                }
            }
        }
        */
    while (cont) {
        console.log(
            `&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& page=${page}`
        );
        const qwiketInput = {
            // published_time,
            slugPrefix,
            published_time: start_time,
            page: page++,
            size,
        };
        //console.log("before fetchQ!");
        let { success, qwikets: inputQwikets } = await dbQwiket.fetchQ({
            sessionid,
            threadid,
            qwiketInput,
            username,
        });
        console.log(
            "after fetchQ!",
            js({
                success,
                threadid,
                page,
                length: inputQwikets ? inputQwikets.length : 0,
            })
        );
        if (success && inputQwikets && inputQwikets.length) {
            for (var i = 0; i < inputQwikets.length; i++) {
                l("QWIKET", chalk.blue.bold(inputQwikets[i].value));
                const q = JSON.parse(inputQwikets[i].value);
                /* if (q["cat" == "americanthinker"]) {
                    var br = 1;
                    console.log(
                        chalk.yellow.bold(
                            2662,
                            `cat AMERICAN THINKER ********************`
                        )
                    );
                }*/
                let tags = new Set();
                if (q["cat"]) {
                    tags.add(q["cat"]);
                }
                if (q["username"]) {
                    tags.add(q["username"]);
                }
                const slug = q[`threadid`] || q[`qwiketid`];
                const qInput = {
                    slug,
                    slugPrefix,
                };
                let { success, tags: qwiketTags } = await dbQwiket.fetchTags({
                    sessionid,
                    threadid,
                    qwiketInput: qInput,
                    username,
                });
                if (success) {
                    //  l(chalk.blue("adding tag", item["shortname"]));
                    qwiketTags.forEach(item => tags.add(item["shortname"]));
                }
                // console.log("after fetchTags");
                l(chalk.yellow('TAGS OBJECT', JSON.stringify(tags)))
                let tagsString = tags ? [...tags].join(",") : `""`;

                if (typeof q["body"] === "object")
                    q["body"] = JSON.stringify(q["body"]);

                const type = 1; //0 - disqus, q - qwiket;
                let shared =
                    q["reshared"] > 0 &&
                        (q["reshared"] < 50 || q["reshared"] >= 100)
                        ? 1
                        : 0;
                const record = {
                    index: "qwikets",
                    slug: `q:${slug}`,
                    fields: {
                        title: q["title"],
                        slug,
                        description: q["description"] || `""`,
                        body: q["body"] ? q["body"] : `""`,
                        author: q["author"] ? q["author"] : `""`,
                        tags: tagsString,
                        type: type,
                        published_time: q["published_time"],
                        shared_time: q["shared_time"],
                        site_name: q["site_name"] || "",
                        url: q["url"] || `""`,
                        image: q["image"]
                            ? q["image"]
                            : q["image_src"]
                                ? q["image_src"]
                                : `""`,
                        edited: 0,
                        userSlug: q["username"] || q["cat"] || "feed",
                        userName: q["catName"] || `""`,
                        parentSlug: q["parent_threadid"] | `""`,
                        topicSlug: q["root_threadid"] | `""`,
                        shared,
                        channelSlug: q["channelSlug"] || q["channel"] || `""`,
                        reshare: q["reshare"] || 0,
                    },
                    replace: true,
                    server: redisServerX1,
                    port: redisPortX1,
                    logContext: { sessionid, threadid, username },
                };
                l(
                    chalk.magenta(
                        JSON.stringify({
                            channelSlug: q["channelSlug"],
                            channel: q["channel"],
                            url: q["url"],
                        },
                            null,
                            4
                        )
                    )
                );
                l("********************")
                await redis.ft_add(record);
                l("after ft_add", page, i);
            }
            /*if (inputQwikets.length < size) {
                l(
                    chalk.green.bold(
                        "last page break:",
                        page,
                        "length:",
                        inputQwikets.length
                    )
                );
                cont = false;
            }*/
            // if (page++ > 10) break;
            // l(chalk.green(`continue,sp:${slugPrefix}; page:`, page));
        } else {
            l(chalk.green.bold("NO RETURN: last page break:", page));
            cont = false;
        }
    }
};
const indexDisqusComments = async ({
    start_time,
    index,
    sessionid,
    threadid,
    username,
}) => {
    const size = 200;
    let cont = 1;
    let page = 0;
    let count = 0;
    while (cont) {
        // l("while cont", { page, cont })
        if (!count) threadid = "d-" + Math.floor(Math.random() * 1000000000);
        try {
            if (process.env.PRE_MIGRATE == 1) {
                await dbQwiket.migrateDisqusRecords({
                    sessionid,
                    threadid,
                    username,
                    input: {
                        start_time,
                        page,
                        size,
                        source: dbTargetServerNameX1,
                        target1: dbServerNameX1,
                        target2: dbServerNameX2,
                    },
                });
                await dbQwiket.migrateDisqusRecords({
                    sessionid,
                    threadid,
                    username,
                    input: {
                        start_time,
                        page,
                        size,
                        source: dbTargetServerNameX2,
                        target1: dbServerNameX1,
                        target2: redisServerX2,
                    },
                });
            }
            let result = await dbQwiket.fetchDisqus({
                sessionid,
                threadid,
                username,
                input: { start_time, page: page++, size },
            });
            if (result && result.success) {
                let qwikets = result.qwikets;
                if (qwikets && qwikets.length) {
                    for (var i = 0; i < qwikets.length; i++) {
                        let q = qwikets[i];
                        //l("qwiket loop", i, qwikets.length)
                        /**
                         * remapping disqus comment to qwiket
                         */
                        if (q) {
                            let fields = {
                                title: q["thread_title"],
                                slug: q["id"],
                                description: q["message"] ? q["message"] : `""`,
                                author: q["author_user_name"],
                                tags: q["author_username"],
                                type: 0,
                                published_time: q["createdat"],
                                shared_time: q["createdat"],
                                userSlug: q["author_username"] || "",
                                userName: q["author_name"] || `""`,
                                parentSlug: q["parent"] | `""`,
                                topicSlug: q["qwiketSlug"] | `""`,
                                url: `${q["qwiketUrl"]}/cc/comment-${q["id"]}/$comment-${q["id"]}`,
                                channelSlug: q["channelSlug"],
                                reshare: 2,
                            };
                            let pjson = await redis.get({
                                key: `pjson-${fields.slug}`,
                                server: redisTargetServerX1,
                                port: redisTargetPortX1,
                                logContext: {
                                    sessionid,
                                    threadid,
                                    username,
                                },
                            });
                            if (!pjson)
                                pjson = await redis.get({
                                    key: `pjson-${fields.slug}`,
                                    server: redisTargetServerX2,
                                    port: redisTargetPortX2,
                                    logContext: {
                                        sessionid,
                                        threadid,
                                        username,
                                    },
                                });
                            let p;
                            try {
                                p = JSON.parse(pjson);
                            } catch (x) {
                                l(
                                    chalk.red.bold(
                                        "EXCEPTION PARSING PJSON:",
                                        x
                                    )
                                );
                            }
                            if (p) {
                                fields.authorAvatar = p.author_avatar;
                                fields.subscr_status = p.subscr_status
                                    ? p.subscr_status
                                    : 0;
                                fields.threadTagImage = p.cat_icon;
                                fields.threadPublished_time = p.published_time;
                                fields.userRole = p.role;
                                fields.threadDescription = p.description;
                                fields.threadTag = p.category;
                                fields.threadImage = p.thread_image;
                                fields.threadAuthor = p.thread_author;
                                fields.threadSlug = p.threadid;
                                fields.threadTitle = p.title;
                                fields.threadTagName = p.cat_name;
                                fields.author = p.author_name;
                                fields.tags = p.author_username;
                                fields.threadUrl = p.thread_url;
                                fields.shared_time = p.createdat;
                                fields.published_time = p.createdat;
                                fields.chidren_summary =
                                    typeof p.children_summary === "string"
                                        ? p.children_summary
                                        : `"${JSON.stringify(
                                            p.children_summary
                                        )}"`;
                                fields.parent_summary =
                                    typeof p.parent_summary === "string"
                                        ? p.parents_summary
                                        : `"${JSON.stringify(
                                            p.parent_summary
                                        )}"`;
                                const record = {
                                    index: "qwikets",
                                    slug: `q:${q["id"]}`,
                                    fields,
                                    replace: true,
                                    server: redisServerX1,
                                    port: redisPortX1,
                                    logContext: {
                                        sessionid,
                                        threadid,
                                        username,
                                    },
                                };
                                //  l(chalk.cyan(JSON.stringify(record, null, 4)));
                                await redis.ft_add(record);
                                record.server = redisServerX2;
                                await redis.ft_add(record);

                                // l("after add record");
                            } else {
                                l(
                                    "skip null record",
                                    pjson,
                                    redisServerX1,
                                    redisServerX2
                                );
                            }
                        } else "skipping null q";
                    }
                } else cont = 0;
            } else break;
            //     l("done 1");
        } finally {
            try {
                try {
                    l("redis.end 1");
                    await redis.end({
                        server: redisServerX1,
                        port: redisPortX1,
                        logContext: { sessionid, threadid, username },
                    });
                } catch (x) {
                    l("handled", x);
                }
            } catch (x) {
                l.chalk.red("UNABLE TO END REDIS", x);
            } finally {
                if (++count > 10) {
                    count = 0;
                    l(`dbEnd indexDisqusComments, thread:${threadid}`);
                    await dbEnd(threadid);
                    threadid = `removed-${threadid}`;
                }
            }
        }
    }
    // l("done 2");
};
const getTag = async ({ slug, sessionid, threadid, username }) => {
    let results = await dbQwiket.getTag({
        input: { slug },
        sessionid,
        threadid,
        username,

        dbServerName: dbServerNameX1,
    });
    if (results && results.success) {
        // console.log("results:", results);
        return results.tag;
    }
    return null;
};
const doFreshSearch = async ({
    search,
    sortBy,
    silo,
    sessionid,
    threadid,
    username,
}) => {
    let x1 = true;
    let info, results, qid;
    let index = silo == 4 ? "test-qwikets" : "qwikets";
    // l("doFreshSearch", index);
    try {
        info = await redis.ft_info({
            index,
            server: redisServerX1,
            port: redisPortX1,
            logContext: { sessionid, threadid, username },
        });
        // l("doFreshSearch info:", JSON.stringify(info));
        if (!info) {
            info = await redis.ft_info({
                index,
                server: redisServerX2,
                port: redisPortX2,
                logContext: { sessionid, threadid, username },
            });
            if (info) {
                x1 = false;
                await dbLog({
                    type: "FAILOVER",
                    body: `doFreshSearch REDIS failover`,
                    threadid,
                    sessionid,
                    username,
                });
            }
        }
        results = x1
            ? await redis.ft_search({
                index,
                query: search,
                orderBy: sortBy,
                orderDir: "DESC",
                page: 0,
                nocontent: true,
                size: TOTAL_SIZE,
                server: redisServerX1,
                port: redisPortX1,
                logContext: {
                    sessionid,
                    threadid,
                    username,
                },
            })
            : await redis.ft_search({
                index,
                query: search,
                orderBy: sortBy,
                orderDir: "DESC",
                page: 0,
                nocontent: true,
                size: TOTAL_SIZE,
                server: redisServerX2,
                port: redisPortX2,
                logContext: {
                    sessionid,
                    threadid,
                    username,
                },
            });
        // l("results=", JSON.stringify(results));
    } catch (x) {
        await dbLog({
            type: "ERROR",
            body: `doFreshSearch: ${x}`,
            threadid,
            sessionid,
            username,
        });
        l(chalk.red.bold("CATCH23", x));
    }
    let num_records = info.num_records;
    qid = num_records;
    let key = `${index}-${silo}-${search}-${sortBy}-${num_records}`;
    let expire = 3600;
    /* console.log(
        "SAVING TO SEARCH CACHE",
        js({ key, expire, num_records, redisServerX1, redisServerX2 })
    );*/
    try {
        await redis.set({
            key,
            value: JSON.stringify(results),
            server: redisServerX1,
            port: redisPortX1,
            expire,
            logContext: { sessionid, threadid, username },
        });
        // l("12222");
        await redis.set({
            key,
            value: JSON.stringify(results),
            server: redisServerX2,
            port: redisPortX2,
            expire,
            logContext: { sessionid, threadid, username },
        });
        // l("13333");
    } catch (x) {
        l(chalk.red.bold("CATCH24", x));
        await dbLog({
            type: "ERROR",
            body: `doFreshSearch: ${x}`,
            threadid,
            sessionid,
            username,
        });
    }
    let pageResults = results ? results.slice(1, 1 + PAGE_SIZE) : [];
    // l("pageResults:", js(pageResults));
    let pageQwikets = x1
        ? await redis.ft_mget({
            index,
            ids: pageResults,
            server: redisServerX1,
            port: redisPortX1,
            logContext: { sessionid, threadid, username },
        })
        : await redis.ft_mget({
            index,
            ids: pageResults,
            server: redisServerX2,
            port: redisPortX2,
            logContext: { sessionid, threadid, username },
        });
    // l("pageQwikets:", js(pageQwikets));
    return {
        total: results[0],
        qid,
        qwikets: pageQwikets,
    };
};
const doFetchSearchPage = async ({
    search,
    sortBy,
    silo,
    page,
    size,
    qid,
    sessionid,
    threadid,
    username,
}) => {
    let index = silo == 4 ? "test-qwikets" : "qwikets";
    let key = `${index}-${silo}-${search}-${sortBy}-${qid}`;
    let results;
    let x1 = true;
    if (qid) {
        try {
            results = await redis.get({
                key,
                server: redisServerX1,
                port: redisPortX1,
                logContext: { sessionid, threadid, username },
            });
            if (!results) {
                results = await redis.get({
                    key,
                    server: redisServerX2,
                    port: redisPortX2,
                    logContext: { sessionid, threadid, username },
                });
                if (results) x1 = false;
            }
        } catch (x) {
            l(chalk.red.bold("CATCH25", x));
            await dbLog({
                type: "ERROR",
                body: `doFetchSearchPage: ${x}`,
                threadid,
                sessionid,
                username,
            });
        }
        if (results) results = JSON.parse(results);
        if (results) {
            let pageResults = results
                ? results.slice(1 + page * size, 1 + page * size + size)
                : [];
            let total = results[0];
            // l("pageResults:", js(results));
            let pageQwikets = x1
                ? await redis.ft_mget({
                    index,
                    ids: pageResults,
                    server: redisServerX1,
                    port: redisPortX1,
                    logContext: { sessionid, threadid, username },
                })
                : await redis.ft_mget({
                    index,
                    ids: pageResults,
                    server: redisServerX2,
                    port: redisPortX2,
                    logContext: { sessionid, threadid, username },
                });
            //  l("pageQwikets:", js(pageQwikets));
            let r = {
                total,
                qid,
                qwikets: pageQwikets,
            };
            //   console.log(js({ r }));
            return r;
        } else {
            let res;
            try {
                res = await doFreshSearch({
                    search,
                    sortBy,
                    silo,
                    sessionid,
                    threadid,
                    username,
                });
            } catch (x) {
                l(chalk.red.bold("CATCH26", x));
                await dbLog({
                    type: "ERROR",
                    body: `doFetchSearchPage: ${x}`,
                    threadid,
                    sessionid,
                    username,
                });
            }
            qid = res.qid;
            if (page)
                return await doFetchSearchPage({
                    search,
                    sortBy,
                    silo,
                    page,
                    qid,
                    sessionid,
                    threadid,
                    username,
                });
            else {
                return res;
            }
        }
    } else {
        return await doFreshSearch({
            search,
            sortBy,
            silo,
            sessionid,
            threadid,
            username,
        });
    }
};
const qwiketQuery = async ({
    search,
    qid,
    page,
    size,
    silo,
    sortBy,
    sessionid,
    threadid,
    username,
}) => {
    /*  let results = await redis.ft_search({
          index: silo == 4 ? "test-qwikets" : "qwikets",
          query: search,
          orderBy: sortBy,
          orderDir: "DESC",
          page: page ? page : 0,
          size: PAGE_SIZE,
          server: environment ? redisServerX2 : redisServerX1,
          port: environment ? redisPortX2 : redisPortX1,
          logContext: {
              sessionid,
              threadid,
              username,
          },
      });
      return results;
      */
    let results;
    try {
        results = await doFetchSearchPage({
            search,
            sortBy,
            silo,
            page,
            size,
            qid,
            sessionid,
            threadid,
            username,
        });
        /*l(
            // "query results:********************************************************************************",
            js(results)
        );*/
    } catch (x) {
        console.log("EXCEPTION13", x);
    }
    return results;
};
const qwiketTagsQuery = async ({
    tags,
    silo,
    operation,
    sortby,
    page,
    environment,
    sessionid,
    threadid,
    username,
}) => {
    //l(chalk.blue.bold("qwiketTagsQuery1"));
    let tagsString = tags
        ? tags.length > 1
            ? tags.join(operation == "OR" ? "|" : " ")
            : tags[0]
        : "";
    /*l(
        chalk.red.bold(
            "qwiketTagsQuery2",
            tagsString,
            `@tags:${tagsString} SORTBY ${
                sortby == "shared" ? "shared_time" : "published_time"
            } DESC`,
            `environment:${environment}`
        )
    );*/
    let index = silo == 4 ? "test-qwikets" : "qwikets";
    let query = `@tags:${tagsString} `;
    let orderBy = sortby == "shared" ? "shared_time" : "published_time";
    let orderDir = "DESC";
    // l(chalk.blue.bold("ft_search", index, query, page));
    let results = await redis.ft_search({
        index,
        query,
        orderBy,
        orderDir,
        page: page ? page : 0,
        size: 6,
        server: environment ? redisServerX2 : redisServerX1,
        port: environment ? redisPortX2 : redisPortX1,
        logContext: {
            sessionid,
            threadid,
            username,
        },
    });
    return results;
};
const cacheQwiket = async ({
    sessionid,
    threadid,
    username,
    input
}) => {
    const { qwiket, days, primary, cache } = input;
    const qThreadid = qwiket['threadid'];
    if (!qThreadid)
        return false;

    const url = qwiket['url'];
    if (!url)
        return false;


    let reshare = qwiket['reshare'];
    const short = reshare == 6 || reshare == 7 || reshare == 56 || reshare == 57 || reshare == 106 || reshare == 107;
    const draft = reshare >= 50 && reshare <= 60;
    let body = qwiket['body'] ? $qwiket['body'] : null;
    let json;
    if (!short && !body) {
        json = await dbQwiket.getQ({
            input: { key: qThreadid + (draft ? ".draft" : ".prod") },
            sessionid,
            threadid,
            username
        });
        if (!json)
            json = await dbQwiket.getQ({
                input: { key: qThreadid + ".qwiket" },
                sessionid,
                threadid,
                username
            });
        if (json) {
            const q = JSON.parse(json);
            qwiket['body'] = q['body'];
        }
    }

    let thread_xid = qwiket['xid'];

    if (!primary && (reshare < 100)) {
        //find potential primary qwiket (same threadid) and share its xid instead with own category
        thread_xid = dbQwiket.primaryThreadXid({
            input: { threadid: qThreadid },
            sessionid,
            threadid,
            username
        });

    }


    let publishedTime = qwiket['published_time'];
    let sharedTime = qwiket['shared_time'];

    if (!sharedTime) {
        sharedTime = time() - 3600;
        qwiket['shared_time'] = sharedTime;
    }
    if (!qwiket['date'] && sharedTime)
        qwiket['date'] = sharedTime;

    qwiket['cat'] = shortname;

    if (!qwiket['identity'])
        qwiket['identity'] = '00e98e251067b27107189bd7c8316ba2';



    const user = await dbQwiket.getUser({
        input: { identity: qwiket['identity'] },
        sessionid,
        threadid,
        username
    });
    if (user) {
        qwiket['s_un'] = user['user_name'];
        qwiket['s_pu'] = user['profileurl']
    }
    else {
        if (qwiket['shared_by_user_name']) {
            qwiket['s_un'] = qwiket['shared_by_user_name'];
        }
        if (qwiket['shared_by_profileurl']) {
            qwiket['s_pu'] = qwiket['shared_by_profileurl'];
        }
    }

    //note, skipped setting qwiket['channel'], makes no sense
    delete qwiket.log;
    delete qwiket.rss;
    delete qwiket.shared_by_avatar;
    delete qwiket.shared_by_identity;
    delete qwiket.shared_by_profileurl;
    delete qwiket.thread;
    delete qwiket.feed;
    delete qwiket.feed_xid;
    delete qwiket.local_category_xid;
    delete qwiket.qpostid;
    delete qwiket.createdat;

    const jsonKey = 'ntjson-' + thread_xid;
    const jsonQwiket = JSON.stringify(qwiket);

    l(chalk.green.bold("processing qwiket shortname:", shortname, ";threadid:", qwiket.threadid))
    await cache.setex(`tview-username-${thread_xid}`, days * 24 * 3600, user['username']);
    await cache.setex(jsonKey, days * 24 * 3600, jsonQwiket);
    await cache.setex(`txid-${qwiket['threadid']}`, days * 24 * 3600, thread_xid);
    return true;
}
const validateQwiketCache = async ({
    sessionid,
    threadid,
    username,
}) => {
    const keys = ['test', '']
    const cache = await getRedisClient({});

    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];

        let dbCacheRecord = await dbQwiket.cacheTimestamps({
            input: { type: 'qwiket', key: k },
            sessionid,
            threadid,
            username
        });
        l("dbCacheRecord", dbCacheRecord);
        if (!dbCacheRecord)
            continue;
        const testSuffix = k == 'test' ? '-test' : '';
        let memoryTime = await cache.get(`cache-timestamps-qwiket${testSuffix}`);
        if (!memoryTime)
            memoryTime = 0;
        l(
            "memoryTime:", memoryTime,
            "dbCacheRecord.time:", dbCacheRecord.time
        )


        let updateType = dbCacheRecord.update_type;
        if (dbCacheRecord.time > memoryTime) {
            if (dbCacheRecord.time - memoryTime > 3600)
                updateType = 'c';
            let qwikets = [];
            let nextTime = 0;
            let incrementalCatsPublished = [];
            let incrementalCatsShared = [];
            let cats = [];
            if (updateType == 'i') {
                qwikets = await dbQwiket.fetchQwiketsIndexedSince({
                    input: { time: memoryTime, field: 'time', test: k },
                    sessionid,
                    threadid,
                    username
                })


            }
            else {
                qwikets = await dbQwiket.fetchQwiketsIndexedSince({ // all stored in pov_category_qwikets, at the end of the task trim for a week
                    input: { time: 0, field: 'time', test: k },
                    sessionid,
                    threadid,
                    username
                })
            }
            nextTime = Date.now() / 1000 | 0;
            for (let i = 0; i < qwikets.length; i++) {
                const qi = qwikets[i];
                l(chalk.magenta.bold("qwiket:", js(qi)))
                let xid = qi['xid'];
                const shortname = qi['shortname'];
                let qwiket = await dbQwiket.getQwiket({
                    input: { xid, qThreadid: qi['threadid'] },
                    sessionid,
                    threadid,
                    username
                })

                const result = await cacheQwiket({
                    sessionid, threadid, username,
                    input: {
                        qwiket,
                        days: 7,
                        cache
                    }
                })
                if (!result)
                    continue;
                if (reshare == 7 || reshare == 107 | reshare == 6 || reshare == 106 || reshare == 56 || reshare == 57) { //qwiket - comments, not implemented at the moment
                    continue;
                }
                const trim = 250;
                const tidsCatKey = `${testPrefix}tids-cat-published-${shortname}`;
                await cache.zadd(tidsCatKey, publishedTime, thread_xid);
                await cache.zremrangebyrank(tidsCatKey, 0, -1 * trim);
                let it = 0;
                while (true) {
                    const ret = await cache.zscan(`${testPrefix}2l-tids`, it, 'match', `*${shortname}*`);
                    l(chalk.yellow.bold("zscan return", js(ret)));
                    it = ret[0];

                    const res = ret[1];
                    const removeTids = async (testPrefix, newsline) => {
                        await cache.del(`${testPrefix}${newsline}`);
                        await cache.zrem(`${testPrefix}2l-tids`, $newsline); // clean up after P
                        await cache.del(`${testPrefix}tids-${$newsline}-published`);
                        await cache.del(`${testPrefix}tids-${$newsline}-shared`);
                    }
                    res.forEach(async newsline => {
                        l(chalk.green("newsline:", newsline))
                        if (newsline.indexOf(':') < 0) {
                            //invalid key
                            await removeTids(testPrefix, newsline);
                            return;
                        }
                        if (await cache.exists(`${testPrefix}${newsline}`)) { //expiring monitor
                            await cache.zadd(`${testPrefix}tids-${newsline}-published`, publishedTime, thread_xid);
                            await cache.zremrangebyrank(`${testPrefix}tids-${newsline}-published`, 0, -1 * trim);
                            await cache.zadd(`${testPrefix}tids-${newsline}-shared`, sharedTime, thread_xid);
                            await cache.zremrangebyrank(`${testPrefix}tids-${newsline}-shared`, 0, -1 * trim);
                        }
                        else {
                            await removeTids(testPrefix, newsline);
                        }
                    })
                    if (!it || +it == 0)
                        break;
                }
            }
            await cache.set(`cache-timestamps-qwiket${testSuffix}`, nextTime);
            qwikets = await dbQwiket.trimCategoryQwikets({ // all stored in pov_category_qwikets, at the end of the task trim for a week
                input: { type: 'qwiket', key: k },
                sessionid,
                threadid,
                username
            })
        }
    }
}
const validatePostsCache = async ({
    forum,
    sessionid,
    threadid,
    username,
}) => {

    const cache = await getRedisClient({});
    /**
     * 1. Get all posts from channelPosts for forum after the timestamp
     * 2. Loop, get thread post, combine info into a single post object, add to tid-qpostid, set pjson and add to lpxids-forum-qpostid
     */
    let dbCacheRecord = await dbQwiket.cacheTimestamps({
        input: { type: 'post', key: forum },
        sessionid,
        threadid,
        username
    });
    l("dbCacheRecord", dbCacheRecord);
    if (!dbCacheRecord)
        return;

    let memoryTime = await cache.get(`cache-timestamps-posts-${forum}`);
    if (!memoryTime)
        memoryTime = 0;
    l(
        "memoryTime:", memoryTime,
        "dbCacheRecord.time:", dbCacheRecord.time
    )


    let updateType = dbCacheRecord.update_type;
    if (dbCacheRecord.time > memoryTime) {
        if (dbCacheRecord.time - memoryTime > 3600)
            updateType = 'c';


        let nextTime = Date.now() / 1000 | 0;
        let posts = await dbQwiket.fetchChannelPostsSince({ //channel posts has 24 hours of posts
            input: { time: updateType == 'i' ? memoryTime : 0, forum },
            sessionid,
            threadid,
            username
        })
        if (!posts)
            return;
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            l("got post:",js(post))
            post['xid'] = post['qpostid']
            const thread = post['thread'];
            const threadQwiket = await dbQwiket.getThreadQwiket({
                input: { thread },
                sessionid,
                threadid,
                username
            })
            const result = await cacheQwiket({
                sessionid, threadid, username,
                input: {
                    qwiket: threadQwiket,
                    days: 7, 
                    cache,
                    primary: 1 // no need to look for primary, already taken care of in getThreadQwiket
                }
            })
            if (!result)
                continue;
            post['category_xid'] = threadQwiket['category_xid'];
            post['thread_image'] = threadQwiket['image'];
            post['thread_author'] = threadQwiket['author'];
            post['thread_xid'] = threadQwiket['xid'];
            if ([pst['url']] == "http://qwiket.com/context/usconservative/topic/nro-is-moving-to-facebook-comments") {
                post['url'] = "http://qwiket.com/context/topic/nro-is-moving-to-facebook-comments";
            }
            const pjson = JSON.stringify(post)
            const tidKey = `tid-${post['xid']}`;
            await cache.setex(tidKey, 7*24 * 3600, qwiket[xid])
            const channelPjsonKey = `pjson-${forumn}-${post['xid']}`;
            await cache.setex(channelPjsonKey, 7*24 * 3600);
            const v6Key = `pjson-${p[id]}`;
            await cache.setex(v6Key, 7 * 24 * 3600, pjson);
            const lpxidKey = `lpxids-${forum}`;
            await cache.zadd(lpxidKey, post['createdat'], p['xid']);
            await cache.zremrangebyrank(lpxidKey, 0, -1 * 1000);
            const disqKey = `disq-tids-${forum}`;
            await cache.zadd(disqKey, post['createdat'], qwiket['xid']);
            await cache.zremrangebyrank(disqKey, 0, -1 * 1000);
            l("end post processing")
        }
        await cache.set(`cache-timestamps-posts-${forum}`, nextTime);
    }
    
}
const validateCatsCache = async ({
    sessionid,
    threadid,
    username,
}) => {

    const cache = await getRedisClient({});
    /**
     * 1. Get all posts from channelPosts for forum after the timestamp
     * 2. Loop, get thread post, combine info into a single post object, add to tid-qpostid, set pjson and add to lpxids-forum-qpostid
     */
    let dbCacheRecord = await dbQwiket.cacheTimestamps({
        input: { type: 'cat', key: '' },
        sessionid,
        threadid,
        username
    });
    l("dbCacheRecord", dbCacheRecord);
    if (!dbCacheRecord)
        return;

    let memoryTime = await cache.get(`cache-timestamps-posts-${forum}`);
    if (!memoryTime)
        memoryTime = 0;
    l(
        "memoryTime:", memoryTime,
        "dbCacheRecord.time:", dbCacheRecord.time
    )


    let updateType = dbCacheRecord.update_type;
    if (dbCacheRecord.time > memoryTime) {
        if (dbCacheRecord.time - memoryTime > 3600)
            updateType = 'c';


        let nextTime = Date.now() / 1000 | 0;
    }
}

    
export default {
    indexDisqusComments,
    indexQwikets,
    qwiketQuery,
    qwiketTagsQuery,
    getTag,
    preMigrateQwikets,
    longMigrateQwikets,
    longMigrateTable,
    validateQwiketCache,
    validatePostsCache
};
