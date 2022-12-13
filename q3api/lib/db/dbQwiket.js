//require("dotenv").config();
//const slugify = require("slugify");
//import slugify from "slugify";
import { dbGetQuery, dbLog, slugify } from "../db.js"
import { l, chalk, microtime, ds, js } from "../common.js"
/*const json = {
    slug, //threadid,qwiketid
    userSlug,
    topicSlug, // non comments, tagged with topic
    rootSlug, // comments
    primarySlug, //cat
    primaryName, //catName
    primaryType,
    primaryIcon, //catIcon
    tags, //comma separate sting
    tagsSlugs, //array of {type,slug} 
    userName,

    title,
    image,
    description,
    author,
    site_name,
    published_time,
    shared_time,
    body,
    type,
    reshare,
    sharedBySlug,
    sharedByName,
    edited

};*/

const remove = async ({
    sessionid,
    threadid,
    qwiketInput,
    username,
    dbServerName,
}) => {
    let { slug } = qwiketInput
    let result
    let sql
    let sw = slug.split("-slug-")
    let silo = 0
    if (sw && sw.length > 1) silo = sw[0]
    let table = `pov_threads_view${silo}`
    let tagsTable = `pov_v10_qwiket_tags${silo}`

    let query = await dbGetQuery("povdb", threadid, dbServerName, "remove")
    sql = `REMOVE from ${tagsTable} where qwiketid='${slug}' `
    let res = await query(`REMOVE from ${tagsTable} where qwiketid=?`, [slug])
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${res ? JSON.stringify(res, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    //TBA change the ownership of all user's posts to guestUser
    sql = `REMOVE from ${table} where threadid='${slug}' `
    res = await query(`REMOVE from ${table} where threadid=?`, [slug])
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${res ? JSON.stringify(res, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (res) {
        result = {
            success: true,
            slug,
        }
    } else {
        result = {
            success: false,
            msg: `dbUser:Unable to remove qwiket ${slug}`,
        }
    }
    return result
}
const fetch = async ({
    sessionid,
    threadid,
    input,
    username,
    dbServerName,
}) => {
    let { slug } = input
    if (!slug) {
        l(chalk.red.bold("dbQwiket.fetch NOSLUG"))
        throw "NO SLUG"
        return
    }
    // micros = micros || microtime();
    // channelShortname = channelShortname || "qwiket";
    username = username || "anon"
    // page = page || 0;
    // size = size || 25;
    // const start = page * size;
    let result, sql, table, tagsTable, rows, res

    let query = await dbGetQuery("povdb", threadid, dbServerName, "fetch")

    let sw = slug.split("-slug-")
    let silo = 0
    if (sw && sw.length > 1) silo = sw[0]

    if (silo == 5 || !silo) {
        table = `q${silo ? silo : ""}`
        let key = `${slug}.qwiket`
        sql = `SELECT * from  ${table} u where \'key\'='${key}'  limit 1'`
        //l(chalk.cyan(sql));
        rows = await query(
            `SELECT *from  ${table} u where \'key\'=?  limit 1`,
            [key]
        )
        await dbLog({
            type: "SQL",
            body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                }}`,
            threadid,
            sessionid,
            username,
        })
        //  l(chalk.grey("return:", rows ? rows.length : 0));
        // await dbLog({ type: 'SQL', body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : 'null'}}`, threadid, sessionid, username });
        if (rows && rows.length) {
            let q = JSON.parse(rows[0]["value"])
            let qwiket = {}
            qwiket.slug = q.threadid
            qwiket.primarySlug = q.cat
            qwiket.primaryName = q.catName
            qwiket.primaryIcon = q.catIcon
            qwiket.primaryType = 101
            qwiket.category_xid = q.category_xid
            qwiket.slug = q.threadid
            qwiket.title = q.title
            qwiket.image = q.image
            qwiket.image_src = q.image_src
            qwiket.description = q.description
            qwiket.body = q.body
            qwiket.shared_time = q.shared_time
            qwiket.published_time = q.published_time
            qwiket.updated_time = q.updated_time
            qwiket.date = q.date
            qwiket.sharedByName = q.shared_by_user_name
            qwiket.sharedBySlug = q.identity
                ? q.identity
                : q.shared_by_user_name
            qwiket.reshare = q.reshare
            qwiket.identity = q.identity
            qwiket.micros = q.micros
            qwiket.locale = q.locale
            qwiket.created = q.qreated
            qwiket.createdBy = q.createdBy
            qwiket.updated = q.updated
            qwiket.updatedBy = q.updatedBy
            qwiket.type = 0
            qwiket.url = q.url
            console.log("RETURN:::", JSON.stringify(qwiket))
            result = {
                success: true,
                qwiket,
            }
        } else {
            console.log("RETURN NO RESULTS")
            result = {
                success: false,
                message: `fetch (legacy): No qwikets in ${table} matched the \'key \'${key}`,
            }
        }
    } else {
        table = `pov_threads_view${silo}`
        tagsTable = `pov_v10_qwiket_tags${silo}`
        sql = `SELECT threadid as slug,u.* from pov_threads_view${silo} u where threadid=${slug}`
        rows = await query(
            `SELECT threadid as slug,u.* from pov_threads_view${silo} u where threadid=?`,
            [slug]
        )
        await dbLog({
            show: false,
            type: "SQL",
            body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                }}`,
            threadid,
            sessionid,
            username,
        })
        if (rows && rows.length) {
            let q = rows[0]
            let qwiket = {}
            qwiket.slug = q.threadid
            qwiket.title = q.title
            qwiket.description = q.description
            qwiket.image = q.image
            qwiket.image_src = q.image_src
            qwiket.category_xid = q.category_xid

            qwiket.author = q.author
            qwiket.site_name = q.site_name
            qwiket.reshare = q.reshare
            qwiket.url = q.url
            qwiket.body = q.body
            qwiket.micros = q.micros
            qwiket.published_time = q.published_time
            qwiket.updated_time = q.updated_time

            qwiket.shared_time = q.shared_time
            qwiket.sharedByName = q.shared_by_user_name
            qwiket.sharedBySlug = q.identity
                ? q.identity
                : q.shared_by_user_name
            qwiket.reshare = q.reshare
            qwiket.identity = q.identity
            qwiket.micros = q.micros
            qwiket.locale = q.locale
            qwiket.created = q.qreated
            qwiket.createdBy = q.createdBy
            qwiket.updated = q.updated
            qwiket.updatedBy = q.updatedBy
            qwiket.created = q.created
            qwiket.type = 0
            sql = `SELECT * from ${tagsTable} where qwiketid='${slug}'`
            let tagRows = await query(
                `SELECT * from ${tagsTable} where qwiketid=?`,
                [slug]
            )
            await dbLog({
                show: false,
                type: "SQL",
                body: `{sql:${sql}, res:${tagRows ? JSON.stringify(tagRows, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            let tags = []
            let tagsSlugs = []
            if (tagRows && tagRows.length) {
                l("rows length:", tagRows.length)
                for (var i = 0; i < tagRows.length; i++) {
                    let tagRow = tagRows[i]
                    const { type, tag } = tagRow
                    tags.push(tag)
                    tagsSlugs.push({ type, slug: tag })
                    l(chalk.green("pushing tag:", i, tag))
                    if (type >= 100) {
                        qwiket.primarySlug = tag
                        qwiket.primaryType = type
                        switch (type) {
                            case 100: {
                                // hashtag
                                qwiket.primaryName = `#${tag}`
                                break
                            }
                            case 101: {
                                //defined
                                sql = `SELECT name,image from pov_v10_defined_tags where tag='${tag}'`
                                rows = await query(
                                    `SELECT name,image from pov_v10_defined_tags where tag=?`,
                                    [tag]
                                )
                                await dbLog({
                                    type: "SQL",
                                    body: `{sql:${sql}, res:${rows
                                        ? JSON.stringify(rows, null, 4)
                                        : "null"
                                        }}`,
                                    threadid,
                                    sessionid,
                                    username,
                                })
                                if (rows && rows.length) {
                                    let definedTag = rows[0]
                                    qwiket.primaryName = definedTag["name"]
                                    qwiket.primatyIcon = definedTag["image"]
                                }

                                break
                            }
                            case 102: {
                                ////topic
                                let sw = slug.split("-slug-")
                                let topicSilo = 0
                                if (sw && sw.length > 1) topicSilo = sw[0]
                                let pr = topicSilo ? topicSilo : ""
                                let t = `pov_threads_view${pr}`
                                sql = `SELECT title,image from ${t} where threadid='${tag}'`
                                rows = await query(
                                    `SELECT title,image from ${t} where threadid=?`,
                                    [tag]
                                )
                                await dbLog({
                                    type: "SQL",
                                    body: `{sql:${sql}, res:${rows
                                        ? JSON.stringify(rows, null, 4)
                                        : "null"
                                        }}`,
                                    threadid,
                                    sessionid,
                                    username,
                                })
                                if (rows && rows.length) {
                                    let topic = rows[0]
                                    qwiket.primaryName = topic.title
                                    qwiket.primaryImage = topic.image
                                    qwiket.topicSlug = tag
                                }
                                break
                            }
                            case 103: {
                                //channel
                                sql = `SELECT config from pov_v10_channels where slug='${tag}'`
                                rows = await query(
                                    `SELECT config from pov_v10_channels where slug=?`,
                                    [tag]
                                )
                                await dbLog({
                                    type: "SQL",
                                    body: `{sql:${sql}, res:${rows
                                        ? JSON.stringify(rows, null, 4)
                                        : "null"
                                        }}`,
                                    threadid,
                                    sessionid,
                                    username,
                                })
                                if (rows && rows.length) {
                                    let channel = rows[0]
                                    let configString = channel.config
                                    let config = JSON.parse(configString)
                                    qwiket.primaryName = config.displayName
                                    qwiket.primatyIcon = config.icon
                                }
                                break
                            }
                            case 104: {
                                //user
                                sql = `SELECT user_name,avatar from pov_v10_users where slug='${tag}'`
                                rows = await query(
                                    `SELECT user_name,avatar from pov_v10_users where slug=?`,
                                    [tag]
                                )
                                await dbLog({
                                    type: "SQL",
                                    body: `{sql:${sql}, res:${rows
                                        ? JSON.stringify(rows, null, 4)
                                        : "null"
                                        }}`,
                                    threadid,
                                    sessionid,
                                    username,
                                })
                                if (rows && rows.length) {
                                    let user = rows[0]

                                    qwiket.primaryName = user.user_name
                                    qwiket.primatyIcon = user.avatar
                                    qwiket.userSlug = tag
                                }
                                break
                            }
                        }
                    }
                }
            }
            qwiket.tags = tags.join(",")
            qwiket.tagsSlugs = JSON.stringify(tagsSlugs)
            l(
                chalk.green("tags and tagsSLugs strings"),
                qwiket.tags,
                qwiket.tagsSlugs
            )
            const url = qwiket.url
            if (url.indexOf("q://") >= 0) {
                //get rootid
                let s1 = url.split("q://")[1]
                let rootSlug = s1.split(":")[0]
                qwiket.rootSlug = rootSlug
            }
            result = {
                success: true,
                qwiket,
            }
        } else {
            result = {
                success: false,
                message: `fetch : No qwikets in ${table} matched the slug ${slug}`,
            }
        }
    }
    return result
}
const fetchAll = async ({
    sessionid,
    threadid,
    qwiketInput,
    username,
    dbServerName,
}) => {
    let { page, size, slugPrefix } = qwiketInput
    //  channelShortname = channelShortname || "qwiket";
    username = username || "anon"
    createdat = createdat || 0
    page = page || 0
    size = size || 25
    const start = page * size
    let result, sql
    let query = await dbGetQuery("povdb", threadid, dbServerName, "fetchAll")
    //let query = await dbGetQuery("hub1db3", threadid, dbServerName);
    let table = `pov_threads_view${slugPrefix ? slugPrefix : ""}`
    sql = `SELECT threadid from ${table}  limit ${start},${size}'`
    // l(chalk.cyan(sql));
    let rows = await query(
        `SELECT threadid from ${table} limit ${start},${size}`
    )
    //l(chalk.grey('return:', rows ? rows.length : 0))
    // await dbLog({ type: 'SQL', body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : 'null'}}`, threadid, sessionid, username });
    let qwikets = []
    if (rows && rows.length) {
        for (var i = 0; i < rows.length; i++) {
            let row = rows[0]
            let slug = row["threadid"]
            let qwiket = await fetch({
                sessionid,
                threadid,
                qwiketInput: { slug },
                username,
                dbServerName,
            })
            qwikets.push(qwiket)
        }
    }
    return {
        success: true,
        qwikets,
    }
}

const fetchByPublished = async ({
    sessionid,
    threadid,
    qwiketInput,
    username,
    dbServerName,
}) => {
    let {
        channelShortname,
        slugPrefix,
        slug,
        createdat,
        selectorType,
        selectorValue,
        published_time,
        shared_time,
        page,
        size,
        micros,
    } = qwiketInput
    micros = micros || microtime()
    channelShortname = channelShortname || "qwiket"
    username = username || "anon"
    createdat = createdat || 0
    page = page || 0
    size = size || 25
    const start = page * size
    let result
    let query = await dbGetQuery("povdb", threadid, dbServerName)

    let qwikets = []
    // for (var sp = 1; sp < 6; sp++) {
    sql = `SELECT * from pov_threads_view${slugPrefix} where published_time >=${published_time} order by published_time limit ${start},${size}'`
    //l(chalk.cyan(sql));
    let rows = await query(
        `SELECT * from pov_threads_view${slugPrefix} where published_time>=?  order by published_time limit ${start},${size}`,
        [published_time]
    )
    //l(chalk.red('return:', rows ? rows.length : 0))
    await dbLog({
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        qwikets.push(...rows)
    } else {
        result = {
            success: false,
            message: `fetchByPublished: No qwikets matched the published_time ${published_time}`,
        }
    }
    // }
    result = {
        success: true,
        qwikets,
    }
    return result
}
const longMigrateQwiketRecords = async ({
    sessionid,
    threadid,
    input,
    username,
}) => {
    let { slugPrefix, start_xid, page, size, source, target1, target2 } =
        input
    let targets = [target1, target2]
    let result, sql
    let povdbSource = await dbGetQuery("povdb", threadid, source)
    let povdbTarget1 = await dbGetQuery("povdb", threadid, target1)
    // let povdbTarget2 = await dbGetQuery("povdb", threadid, target2)
    const start = page * size

    //sql = `SELECT DISTINCT q.*, t.threadid from  q${slugPrefix} q, pov_threads_view${slugPrefix} t where q.\`key\`=CONCAT(t.threadid,'.qwiket') and t.shared_time>=${published_time} order by t.shared_time limit ${start},${size}`;
    sql = `SELECT xid from pov_threads_view${slugPrefix} where xid>? limit ${size}`
    //sql = `SELECT DISTINCT q.*, t.threadid from  pov_threads_view${slugPrefix} t LEFT OUTER JOIN q${slugPrefix} q on q.\`key\`=CONCAT(t.threadid,'.qwiket') where t.shared_time>=${published_time} order by t.shared_time limit ${start},${size}`
    l(chalk.cyan(sql))
    let rows = await povdbSource(sql, [start_xid])
    //l("rows", page);
    await dbLog({
        show: false,
        type: "SQL",
        body: `pre-migrate source: {sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    l(
        chalk.green(
            JSON.stringify(
                {
                    show: false,
                    type: "SQL",
                    body: `long-migrate source: {sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                },
                null,
                4
            )
        )
    );
    let xid = 0;
    if (rows && rows.length) {
        let qwikets = []
        for (let i = 0; i < rows.length; i++) {
            // l("first iter", i);
            let row = rows[i]
            xid = row['xid'];
            sql = `SELECT DISTINCT q.*, t.threadid from  pov_threads_view${slugPrefix} t LEFT OUTER JOIN q${slugPrefix} q on q.\`key\`=CONCAT(t.threadid,'.qwiket') where t.xid=? limit 1`
            let rows2 = await povdbSource(sql, [xid])

            row = rows2[0]
            //   l(chalk.yellow("Got full record from the source"),row.threadid,row.xid)
            let value = row["value"]
            //  let q = JSON.parse(value);
            //l(chalk.cyan.bold(js({ cat: q["cat"] })));
            /* if (q["cat"] == "americanthinker") {
                var br = 6;
                l(
                    chalk.red.bold(
                        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! AMERICAN THINKER"
                    )
                );
            }*/
            let keyThreadid = row["threadid"]
            sql = `SELECT DISTINCT * from pov_threads_view${slugPrefix} where threadid="${keyThreadid}"  limit 1`
            let rs = await povdbSource(
                `SELECT DISTINCT * from pov_threads_view${slugPrefix} where threadid=?  limit 1`,
                [keyThreadid]
            )
            rs = rs[0]
            //  retStart_time=rs['shared_time'];
            /* l(chalk.white(JSON.stringify({
                 show: false,
                 type: "SQL",
                 body: `pre-migrate, source: {sql:${sql}, res:${
                     rs ? JSON.stringify(rs, null, 4) : "null"
                 }}`,
                 threadid,
                 sessionid,
                 username,


             }, null, 4)))*/
            // l(chalk.yellow("got source qwiket",js(rs))) ;
            await dbLog({
                show: false,
                type: "SQL",
                body: `pre-migrate, source: {sql:${sql}, res:${rs ? JSON.stringify(rs, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            let rt1 = await povdbTarget1(
                `SELECT DISTINCT threadid,FROM_UNIXTIME(published_time) as published from pov_threads_view${slugPrefix} where threadid=?  limit 1`,
                [keyThreadid]
            )
            if (rt1 && rt1.length)
                l(chalk.green("exist target qwiket", "has row:", rt1[0]['published'], keyThreadid));
            await dbLog({
                show: false,
                type: "SQL",
                body: `pre-migrate, target1: {sql:${sql}, res:${rt1 ? JSON.stringify(rt1, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            /* l(
                chalk.yellow(
                    JSON.stringify(
                        {
                            show: false,
                            type: "SQL",
                            body: `pre-migrate, target1: {sql:${sql}, res:${
                                rt1 ? JSON.stringify(rt1, null, 4) : "null"
                            }}`,
                            threadid,
                            sessionid,
                            username,
                        },
                        null,
                        4
                    )
                )
            );*/
            if (!rt1 || !rt1.length) {
                l(chalk.green('new thredid'))
                let insertSql = `INSERT into pov_threads_view${slugPrefix} (threadid,title,site_name,url,description,locale,identity,image,text,date,published_time,updated_time,shared_by_user_name,category_xid,author,feed,reshare,shared_time,shared_by_identity,shared_by_profileurl,shared_by_avatar,thread,feed_xid,image_src,printurl,video,entity) 
                VALUES ("${rs["threadid"]}","${rs["title"]}","${rs["site_name"]
                    }","${rs["url"]}","${rs["description"]}","${rs["locale"]}",
                "${rs["identity"]}","${rs["image"]}","${rs["text"]}",${rs["date"]
                    },${rs["published_time"]},${rs["updated_time"]},
                "${rs["shared_by_user_name"]}",${rs["category_xid"] || 0},"${rs["author"]
                    }",${rs["feed"]}),${rs["reshare"]},${rs["shared_time"]},
                "${rs["shared_by_identity"]}","${rs["shared_by_profileurl"]
                    }","${rs["shared_by_avatar"]}",${rs["thread"]},${rs["feed_xid"]
                    },
                "${rs["image_src"]}","${rs["printurl"]}"},${rs["video"]},"${rs["entity"]
                    }"})`
                l(
                    "NEW",
                    insertSql,
                    "RS::::",
                    chalk.green(rs["threadid"]),
                    JSON.stringify(rs)
                )

                let res1 = await povdbTarget1(
                    `
                        INSERT into pov_threads_view${slugPrefix} (threadid,title,site_name,url,description,locale,identity,image,text,date,
                            published_time,updated_time,shared_by_user_name,category_xid,author,feed,reshare,shared_time,shared_by_identity,shared_by_profileurl,shared_by_avatar,
                            thread,feed_xid,image_src,printurl,video,entity) 
                        VALUES( ? , ? , ? , ? , ? , ? , ? , ?,?,?,
                            ?,?,?,?,?,?,?,?,?,?,
                            ?,?,?,?,?,?,? )
                        `,
                    [
                        rs["threadid"],
                        rs["title"],
                        rs["site_name"],
                        rs["url"],
                        rs["description"],
                        rs["locale"],
                        rs["identity"],
                        rs["image"],
                        rs["text"],
                        rs["date"],
                        rs["published_time"],
                        rs["updated_time"],
                        rs["shared_by_user_name"],
                        rs["category_xid"],
                        rs["author"],
                        rs["feed"],
                        rs["reshare"],
                        rs["shared_time"],
                        rs["shared_by_identity"],
                        rs["shared_by_profileurl"],
                        rs["shared_by_avatar"],
                        rs["thread"],
                        rs["feed_xid"],
                        rs["image_src"],
                        rs["printurl"],
                        rs["video"],
                        rs["entity"],
                    ]
                )
                await dbLog({
                    show: false,
                    type: "SQL",
                    body: `pre-migrate, target1: {sql:${insertSql}, res:${res1 ? JSON.stringify(res1, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                })
                if (value) {
                    insertSql = `INSERT into q${slugPrefix} (\`key\`,value) VALUES("${row["key"]}","${row["value"]}")`
                    try {
                        let rtq = await povdbTarget1(
                            `SELECT \`key\` from q${slugPrefix} where \`key\`=?  limit 1`,
                            [row["key"]]
                        )
                        if (!rtq || rtq.length == 0) {
                            res1 = await povdbTarget1(
                                `INSERT into q${slugPrefix} (\`key\`,value) VALUES(?,?) `,
                                [row["key"], row["value"]]
                            )
                            await dbLog({
                                show: false,
                                type: "SQL",
                                body: `pre-migrate, target1: {sql:${insertSql}, res:${res1
                                    ? JSON.stringify(res1, null, 4)
                                    : "null"
                                    }}`,
                                threadid,
                                sessionid,
                                username,
                            })
                        }
                        l(
                            chalk.cyan(
                                JSON.stringify(
                                    {
                                        show: false,
                                        type: "SQL",
                                        body: `pre-migrate INSERT, target1: {sql:${insertSql}, res:${res1
                                            ? JSON.stringify(res1, null, 4)
                                            : "null"
                                            }}`,
                                        threadid,
                                        sessionid,
                                        username,
                                    },
                                    null,
                                    4
                                )
                            )
                        )
                    } catch (x) {
                        l("CATCH28", x)
                    }
                }
            }

            l("looping", xid);
        }

    }
    return xid;
}
const migrateQwiketRecords = async ({
    sessionid,
    threadid,
    input,
    username,
}) => {
    let { slugPrefix, published_time, page, size, source, target1, target2 } =
        input
    let targets = [target1, target2]
    let result, sql
    let povdbSource = await dbGetQuery("povdb", threadid, source)
    let povdbTarget1 = await dbGetQuery("povdb", threadid, target1)
    // let povdbTarget2 = await dbGetQuery("povdb", threadid, target2)
    const start = page * size

    //sql = `SELECT DISTINCT q.*, t.threadid from  q${slugPrefix} q, pov_threads_view${slugPrefix} t where q.\`key\`=CONCAT(t.threadid,'.qwiket') and t.shared_time>=${published_time} order by t.shared_time limit ${start},${size}`;
    sql = `SELECT DISTINCT q.*, t.threadid from  pov_threads_view${slugPrefix} t LEFT OUTER JOIN q${slugPrefix} q on q.\`key\`=CONCAT(t.threadid,'.qwiket') where t.shared_time>=${published_time} order by t.shared_time limit ${start},${size}`
    l(chalk.cyan(sql))
    let rows = await povdbSource(sql)
    //l("rows", page);
    await dbLog({
        show: false,
        type: "SQL",
        body: `pre-migrate source: {sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    l(
        chalk.green(
            JSON.stringify(
                {
                    show: false,
                    type: "SQL",
                    body: `pre-migrate source: {sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                },
                null,
                4
            )
        )
    );
    if (rows && rows.length) {
        let qwikets = []
        for (let i = 0; i < rows.length; i++) {
            // l("first iter", i);
            let row = rows[i]
            let value = row["value"]
            //  let q = JSON.parse(value);
            //l(chalk.cyan.bold(js({ cat: q["cat"] })));
            /* if (q["cat"] == "americanthinker") {
                var br = 6;
                l(
                    chalk.red.bold(
                        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! AMERICAN THINKER"
                    )
                );
            }*/
            let keyThreadid = row["threadid"]
            sql = `SELECT DISTINCT * from pov_threads_view${slugPrefix} where threadid="${keyThreadid}"  limit 1`
            let rs = await povdbSource(
                `SELECT DISTINCT * from pov_threads_view${slugPrefix} where threadid=?  limit 1`,
                [keyThreadid]
            )
            rs = rs[0]
            /* l(chalk.white(JSON.stringify({
                 show: false,
                 type: "SQL",
                 body: `pre-migrate, source: {sql:${sql}, res:${
                     rs ? JSON.stringify(rs, null, 4) : "null"
                 }}`,
                 threadid,
                 sessionid,
                 username,


             }, null, 4)))*/
            l(chalk.yellow("got source qwiket", js(rs)));
            await dbLog({
                show: false,
                type: "SQL",
                body: `pre-migrate, source: {sql:${sql}, res:${rs ? JSON.stringify(rs, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            let rt1 = await povdbTarget1(
                `SELECT DISTINCT threadid from pov_threads_view${slugPrefix} where threadid=?  limit 1`,
                [keyThreadid]
            )
            l(chalk.green("got target qwiket", js(rs)));
            await dbLog({
                show: false,
                type: "SQL",
                body: `pre-migrate, target1: {sql:${sql}, res:${rt1 ? JSON.stringify(rt1, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            /* l(
                chalk.yellow(
                    JSON.stringify(
                        {
                            show: false,
                            type: "SQL",
                            body: `pre-migrate, target1: {sql:${sql}, res:${
                                rt1 ? JSON.stringify(rt1, null, 4) : "null"
                            }}`,
                            threadid,
                            sessionid,
                            username,
                        },
                        null,
                        4
                    )
                )
            );*/
            if (!rt1 || !rt1.length) {
                let insertSql = `INSERT into pov_threads_view${slugPrefix} (threadid,title,site_name,url,description,locale,identity,image,text,date,published_time,updated_time,shared_by_user_name,category_xid,author,feed,reshare,shared_time,shared_by_identity,shared_by_profileurl,shared_by_avatar,thread,feed_xid,image_src,printurl,video,entity) 
                VALUES ("${rs["threadid"]}","${rs["title"]}","${rs["site_name"]
                    }","${rs["url"]}","${rs["description"]}","${rs["locale"]}",
                "${rs["identity"]}","${rs["image"]}","${rs["text"]}",${rs["date"]
                    },${rs["published_time"]},${rs["updated_time"]},
                "${rs["shared_by_user_name"]}",${rs["category_xid"] || 0},"${rs["author"]
                    }",${rs["feed"]}),${rs["reshare"]},${rs["shared_time"]},
                "${rs["shared_by_identity"]}","${rs["shared_by_profileurl"]
                    }","${rs["shared_by_avatar"]}",${rs["thread"]},${rs["feed_xid"]
                    },
                "${rs["image_src"]}","${rs["printurl"]}"},${rs["video"]},"${rs["entity"]
                    }"})`
                l(
                    "NEW",
                    insertSql,
                    "RS::::",
                    chalk.green(rs["threadid"]),
                    JSON.stringify(rs)
                )

                let res1 = await povdbTarget1(
                    `
                        INSERT into pov_threads_view${slugPrefix} (threadid,title,site_name,url,description,locale,identity,image,text,date,
                            published_time,updated_time,shared_by_user_name,category_xid,author,feed,reshare,shared_time,shared_by_identity,shared_by_profileurl,shared_by_avatar,
                            thread,feed_xid,image_src,printurl,video,entity) 
                        VALUES( ? , ? , ? , ? , ? , ? , ? , ?,?,?,
                            ?,?,?,?,?,?,?,?,?,?,
                            ?,?,?,?,?,?,? )
                        `,
                    [
                        rs["threadid"],
                        rs["title"],
                        rs["site_name"],
                        rs["url"],
                        rs["description"],
                        rs["locale"],
                        rs["identity"],
                        rs["image"],
                        rs["text"],
                        rs["date"],
                        rs["published_time"],
                        rs["updated_time"],
                        rs["shared_by_user_name"],
                        rs["category_xid"],
                        rs["author"],
                        rs["feed"],
                        rs["reshare"],
                        rs["shared_time"],
                        rs["shared_by_identity"],
                        rs["shared_by_profileurl"],
                        rs["shared_by_avatar"],
                        rs["thread"],
                        rs["feed_xid"],
                        rs["image_src"],
                        rs["printurl"],
                        rs["video"],
                        rs["entity"],
                    ]
                )
                await dbLog({
                    show: false,
                    type: "SQL",
                    body: `pre-migrate, target1: {sql:${insertSql}, res:${res1 ? JSON.stringify(res1, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                })
                if (value) {
                    insertSql = `INSERT into q${slugPrefix} (\`key\`,value) VALUES("${row["key"]}","${row["value"]}")`
                    try {
                        let rtq = await povdbTarget1(
                            `SELECT \`key\` from q${slugPrefix} where \`key\`=?  limit 1`,
                            [row["key"]]
                        )
                        if (!rtq || rtq.length == 0) {
                            res1 = await povdbTarget1(
                                `INSERT into q${slugPrefix} (\`key\`,value) VALUES(?,?) `,
                                [row["key"], row["value"]]
                            )
                            await dbLog({
                                show: false,
                                type: "SQL",
                                body: `pre-migrate, target1: {sql:${insertSql}, res:${res1
                                    ? JSON.stringify(res1, null, 4)
                                    : "null"
                                    }}`,
                                threadid,
                                sessionid,
                                username,
                            })
                        }
                        l(
                            chalk.cyan(
                                JSON.stringify(
                                    {
                                        show: false,
                                        type: "SQL",
                                        body: `pre-migrate INSERT, target1: {sql:${insertSql}, res:${res1
                                            ? JSON.stringify(res1, null, 4)
                                            : "null"
                                            }}`,
                                        threadid,
                                        sessionid,
                                        username,
                                    },
                                    null,
                                    4
                                )
                            )
                        )
                    } catch (x) {
                        l("CATCH28", x)
                    }
                }
            }

            l("looping");
        }
        return rows.length
    }
    return 0
}
const fetchQ = async ({
    sessionid,
    threadid,
    qwiketInput,
    username,
    action,
    dbServerName,
}) => {
    let {
        channelShortname,
        slugPrefix,
        slug,
        createdat,
        selectorType,
        selectorValue,
        published_time,
        shared_time,
        page,
        size,
        micros,
    } = qwiketInput
    //  micros = micros || microtime();
    channelShortname = channelShortname || "qwiket"
    username = username || "anon"
    createdat = createdat || 0
    page = page || 0
    size = size || 25
    const start = page * size
    let result, sql
    let query = await dbGetQuery("povdb", threadid, dbServerName)
    //let query = await dbGetQuery("hub1db3", threadid, dbServerName);

    sql = `SELECT DISTINCT q.* from  q${slugPrefix} q, pov_threads_view${slugPrefix} t where q.\`key\`=CONCAT(t.threadid,'.qwiket') and t.shared_time>=${published_time} order by shared_time limit ${start},${size}`
    l(chalk.cyan(6661, dbServerName, sql));
    let rows = await query(sql)
    l(chalk.grey("return:", rows ? rows.length : 0, sql));
    /* await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });*/
    if (rows && rows.length) {
        result = {
            success: true,
            qwikets: rows,
        }
    } else {
        result = {
            success: false,
            message: `fetchQ: No qwikets matched the page ${page}`,
        }
    }
    return result
}
const fetchAllQ = async ({
    sessionid,
    threadid,
    qwiketInput,
    username,
    action,
    dbServerName,
}) => {
    let {
        channelShortname,
        slugPrefix,
        slug,
        createdat,
        selectorType,
        selectorValue,
        published_time,
        shared_time,
        page,
        size,
        micros,
    } = qwiketInput
    //  micros = micros || microtime();
    channelShortname = channelShortname || "qwiket"
    username = username || "anon"
    createdat = createdat || 0
    page = page || 0
    size = size || 25
    const start = page * size
    let result, sql
    let query = await dbGetQuery("povdb", threadid, dbServerName)
    //let query = await dbGetQuery("hub1db3", threadid, dbServerName);

    sql = `SELECT * from  q${slugPrefix} limit ${start},${size}'`
    // l(chalk.cyan(sql));
    let rows = await query(
        `SELECT * from q${slugPrefix} limit ${start},${size}`
    )
    //l(chalk.grey('return:', rows ? rows.length : 0))
    /* await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });*/
    if (rows && rows.length) {
        result = {
            success: true,
            qwikets: rows,
        }
    } else {
        result = {
            success: false,
            message: `fetchAllQ: No qwikets matched the page ${page}`,
        }
    }
    return result
}
const fetchAllDisqus = async ({
    sessionid,
    threadid,
    qwiketInput,
    username,
    action,
    dbServerName,
}) => {
    let {
        channelShortname,
        slugPrefix,
        slug,
        createdat,
        selectorType,
        selectorValue,
        published_time,
        shared_time,
        page,
        size,
        micros,
    } = qwiketInput
    micros = micros || microtime()
    channelShortname = channelShortname || "qwiket"
    username = username || "anon"
    createdat = createdat || 0
    page = page || 0
    size = size || 25
    const start = page * size
    let result
    let povdb = await dbGetQuery("povdb", threadid, dbServerName)
    let query = await dbGetQuery("hub1db3", threadid, dbServerName)

    sql = `SELECT * from qwp_posts where createdat>${createdat}  order by createdat desc  limit ${start},${size}'`
    // l(chalk.cyan(sql));
    let rows = await query(
        `SELECT * from qwp_posts where createdat>${createdat}  order by createdat desc limit ${start},${size} `
    )
    //l(chalk.grey('return:', rows ? rows.length : 0))
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        let qwikets = []
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            if (!row) continue
            let thread = row["thread"]
            let forum = row["forum"]
            sql = `SELECT c.slug as channelSlug,m.threadid as qwiketSlug, m.shortname as tag,m.thread_url as qwiketUrl from  pov_v10_channels c, pov_threads_map2 m where m.thread=${thread} and c.forum='${forum}'  limit 1`
            let extraRows = await povdb(
                `SELECT c.slug as channelSlug,m.threadid as qwiketSlug, m.shortname as tag,m.thread_url as qwiketUrl from  pov_v10_channels c, pov_threads_map2 m where m.thread=? and c.forum=? limit 1`,
                [thread, forum]
            )
            await dbLog({
                show: false,
                type: "SQL",
                body: `{sql:${sql}, res:${extraRows ? JSON.stringify(extraRows, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            if (extraRows && extraRows.length > 0) {
                let xr = extraRows[0]
                //l(chalk.green.bold(JSON.stringify(xr)));
                row["channelSlug"] = xr["channelSlug"]
                row["qwiketSlug"] = xr["qwiketSlug"]
                row["tag"] = xr["tag"]
                row["qwiketUrl"] = xr["qwiketUrl"]
                // l(chalk.yellow.bold(JSON.stringify(row)));
                if (
                    row["qwiketSlug"] &&
                    (row["qwiketSlug"].indexOf("51-slug") == 0 ||
                        row["qwiketSlug"].indexOf("5-slug") == 0)
                ) {
                    // console.log("disqus qwikets adding row");
                    qwikets.push(row)
                    // l(chalk.yellow.bold("PUSHED", row))
                }
            }
        }

        result = {
            success: true,
            qwikets,
            rawRows: rows.length,
        }
        //  l(chalk.green.bold('result:', JSON.stringify(result)))
    } else {
        result = {
            success: false,
            message: `fetchAllDisqus: No disqus qwikets (posts) matched the page ${page}`,
        }
    }
    return result
}
const longMigrateTable = async ({
    sessionid,
    threadid,
    input,
    username,
}) => {
    let { table, start_xid, page, size, source, target } = input
    const start = page * size

    let xid = 0;

    let result, sql, dbSource, dbTarget
    switch (table) {
        case 'qwp_posts':
        case 'qwp_posts_archive':
        case 'qwp_threads':
            dbSource = await dbGetQuery("hub1db3", threadid, source)
            dbTarget = await dbGetQuery("hub1db3", threadid, target)
            break;
        case 'pov_topics':
        case 'pov_threads_map2':
        case 'pov_users':

            dbSource = await dbGetQuery("povdb", threadid, source)
            dbTarget = await dbGetQuery("povdb", threadid, target)
            break;
    }

    l(chalk.blue.bold("source:", source, "target:", target))

    //sql = `SELECT DISTINCT q.*, t.threadid from  q${slugPrefix} q, pov_threads_view${slugPrefix} t where q.\`key\`=CONCAT(t.threadid,'.qwiket') and t.shared_time>=${published_time} order by t.shared_time limit ${start},${size}`;
    sql = `SELECT * from ${table} where xid>? limit ${size}`
    if (table == 'pov_topics')
        sql = `SELECT * from ${table} where thread_xid>? limit ${size}`
    else if (table == 'pov_users')
        sql = `SELECT * from ${table} where xid>? and username !='anon' limit ${size}`
    else
        sql = `SELECT * from ${table} where xid>? limit ${size}`

    //sql = `SELECT DISTINCT q.*, t.threadid from  pov_threads_view${slugPrefix} t LEFT OUTER JOIN q${slugPrefix} q on q.\`key\`=CONCAT(t.threadid,'.qwiket') where t.shared_time>=${published_time} order by t.shared_time limit ${start},${size}`
    l(chalk.cyan(sql))
    let rows = await dbSource(sql, [start_xid])
    //l("rows", page);

    /* l(
         chalk.green(
             JSON.stringify(
                 {
                     show: false,
                     type: "SQL",
                     body: `long-migrate ${table} source: {sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                         }}`,
                     threadid,
                     sessionid,
                     username,
                 },
                 null,
                 4
             )
         )
     );*/

    if (rows && rows.length) {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            switch (table) {
                case 'qwp_posts':
                case 'qwp_posts_archive':
                    sql = `SELECT xid from ${table} where id=? `
                    let rowsTarget = await dbTarget(
                        sql, [row['id']]
                    )
                    xid = row['xid'];
                    l("set xid", xid)
                    if (rowsTarget && rowsTarget.length) {
                        l(chalk.red("Qwp post already exists in target", row['id']))
                    }
                    else {

                        let insertSql = `INSERT INTO ${table} (xid,qforumid,forum,id,parent,message,isflagged,thread,raw_message,createdat,isedited,ishighlighted,ipaddress,isspam,isdeleted,likes,isapproved,dislikes,author_username,author_name,author_url,author_profileurl,author_emailHash,author_avatar_permalink,author_avatar_cache,author_id,author_isanonymous,author_emai,json,status,state,original,movedto_postid,children,v,ticketid,post_ticketid,watch_ticketid,watch_type,watch_identity,thread_title,thread_url,role,updatedat) 
                        VALUES( ${row["xid"]}, ${row["qforumid"]},"${row["forum"]}", ${row["id"]
                            }, ${row["parent"]},"${row["message"]}",
                        ${row["isflagged"]},"${row["thread"]}","${row["raw_message"]
                            }",${row["createdat"]},${row["isedited"]},${row["ishighlighted"]
                            },"${row["ipaddress"] || ""}",${row["isspam"]},${row["isdeleted"]
                            },${row["likes"]},${row["isapproved"]},${row["dislikes"]},"${row["author_username"]
                            }","${row["author_name"]}","${row["author_url"]}","${row["author_profileurl"]
                            }","${row["author_emailHash"]}","${row["author_avatar_permalink"]
                            }","${row["author_avatar_cache"]}","${row["author_id"]}",${row["author_isanonymous"]
                            },"${row["author_email"]}","${row["json"]}",${row["status"]},"${row["state"]
                            }","${row["original"]}",${row["movedto_postid"]},${row["children"]
                            },${row["v"]},${row["ticket_id"]},${row["post_ticketid"]},${row["watch_ticketid"]
                            },${row["watch_type"]},"${row["watch_identity"]},"${row["thread_title"]
                            }","${row["thread_url"]}",${row["role"]},${row["updatedat"]})`
                        let res1 = await dbTarget(
                            `
                           INSERT INTO ${table} (xid,qforumid,forum,id,parent,message,isflagged,thread,raw_message,createdat,isedited,
                            ishighlighted,ipaddress,isspam,isdeleted,likes,isapproved,dislikes,author_username,author_name,author_url,
                            author_profileurl,author_emailHash,author_avatar_permalink,author_avatar_cache,author_id,author_isanonymous,author_email,json,status,state,
                            original,movedto_postid,children,v,ticketid,post_ticketid,watch_ticketid,watch_type,watch_identity,thread_title,
                            thread_url,role,updatedat) 
                        VALUES(?,?,?,?,?,?,?,?,?,?,?,
                            ?,?,?,?,?,?,?,?,?,?,
                            ?,?,?,?,?,?,?,?,?,?,
                            ?,?,?,?,?,?,?,?,?,?,
                            ?,?,? )
                            `,
                            [
                                row['xid'],
                                row["qforumid"],
                                row["forum"],
                                row["id"],
                                row["parent"],
                                row["message"],
                                row["isflagged"],
                                row["thread"],
                                row["raw_message"],
                                row["createdat"],
                                row["isedited"],
                                row["ishighlighted"],
                                row["ipaddress"] || "",
                                row["isspam"],
                                row["isdeleted"],
                                row["likes"],
                                row["isapproved"],
                                row["dislikes"],
                                row["author_username"],
                                row["author_name"],
                                row["author_url"],
                                row["author_profileurl"],
                                row["author_emailHash"],
                                row["author_avatar_permalink"],
                                row["author_avatar_cache"],
                                row["author_id"],
                                row["author_isanonymous"],
                                row["author_email"],
                                row["json"],
                                row["status"],
                                row["state"],
                                row["original"],
                                row["movedto_postid"],
                                row["children"],
                                row["v"],
                                row["ticket_id"],
                                row["post_ticketid"],
                                row["watch_ticketid"],
                                row["watch_type"],
                                row["watch_identity"],
                                row["thread_title"],
                                row["thread_url"],
                                row["role"],
                                row["updatedat"],
                            ]
                        )
                        await dbLog({
                            show: false,
                            type: "SQL",
                            body: `long-migrate, target ${table}: {sql:${insertSql}, res:${res1 ? JSON.stringify(res1, null, 4) : "null"
                                }}`,
                            threadid,
                            sessionid,
                            username,
                        })
                    }
                    break;
                case 'qwp_threads':
                    sql = `SELECT xid from ${table} where thread=? `
                    let rowsTarget2 = await dbTarget(
                        sql, [row['thread']]
                    )
                    //l('rowsTarget2',rowsTarget2.length)
                    xid = row['xid'];
                    if (rowsTarget2 && rowsTarget2.length) {
                        l(chalk.red("Qwp thread already exists in target", row['thread']))
                    }
                    else {
                        let insertSql = `INSERT INTO ${table}
                            (xid,
                            thread,
                            forumid,
                            url,
                            title,
                            lastpost,
                            status)
                            VALUES(
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?);
                            `;
                        let res3 = await dbTarget(insertSql, [
                            row['xid'],
                            row['thread'],
                            row['forumid'],
                            row['url'],
                            row['title'],
                            row['lastpost'],
                            row['status']
                        ]);
                        l('inserted ', row['xid'])
                    }
                    break;
                case 'pov_topics':
                    sql = `SELECT thread_xid from ${table} where thread_xid=? `
                    let rowsTarget3 = await dbTarget(
                        sql, [row['thread_xid']]
                    )
                    xid = row['thread_xid'];
                    if (rowsTarget3 && rowsTarget3.length) {
                        l(chalk.red("pov_topic already exists in target", row['threadid']))
                    }
                    else {
                        let insertSql = `INSERT INTO ${table}
                            (thread_xid,threadid) VALUES (?,?)
                            `;
                        let res3 = await dbTarget(insertSql, [
                            row['thread_xid'],
                            row['threadid']
                        ]);
                    }
                    break;
                case 'pov_threads_map2':
                    sql = `SELECT xid from ${table} where threadid=? and thread=? `
                    let rowsTarget4 = await dbTarget(
                        sql, [row['threadid'], row['thread']]
                    )
                    xid = row['xid'];
                    if (rowsTarget4 && rowsTarget4.length) {
                        l(chalk.red("pov_thread_map2 already exists in target", row['threadid']))
                    }
                    else {
                        let insertSql = `INSERT INTO ${table}
                        (xid,thread,channel,threadid,shortname,last_updated,posts_count,last_changed_count,thread_url) VALUES (?,?,?,?,?,?,?,?,?)
                        `;
                        let res3 = await dbTarget(insertSql, [
                            row['xid'],
                            row['thread'],
                            row['channel'],
                            row['threadid'],
                            row['shortname'],
                            row['last_updated'],
                            row['post_count'],
                            row['last_changed_count'],
                            row['thread_url'] ? row['thread_url'] : "",
                        ]);
                    }
                    break;
                case 'pov_users':
                    sql = `SELECT xid from ${table} where identity=?`
                    let rowsTarget5 = await dbTarget(
                        sql, [row['identity'],]
                    )
                    xid = row['xid'];
                    if (rowsTarget5 && rowsTarget5.length) {
                        l(chalk.red("pov_users already exists in target", row['identity']))
                    }
                    else {
                        let insertSql = `INSERT INTO ${table}
                        (xid,identity,username,user_name,email,disqus_id,last_login,lang,approver,avatar,
                            url,profileurl,forum,forumsetting_collapsed,orderby_option,interests_option,advanced_interests_option,jumbo_option,theme,twitter_option,
                            topics_option,translate_option,nohelp_option,subscr_status,subscr_id,subscr_data,noads_option,nogrid_option,description,user_layout) 
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
                        l(insertSql)
                        let res3 = await dbTarget(insertSql, [
                            row['xid'],
                            row['identity'],
                            row['username'],
                            row['user_name'],
                            row['email'],
                            row['disqus_id'],
                            row['last_login'],
                            row['lang'],
                            row['approver'],
                            row['avatar'],

                            row['url'],
                            row['profileurl'],
                            row['forum'],
                            row['forumsetting_collapsed'],
                            row['orderby_option'],
                            row['interests_option'],
                            row['advanced_interests_option'],
                            row['jumbo_option'],
                            row['theme'],
                            row['twitter_option'],

                            row['topics_option'],
                            row['translate_option'],
                            row['nohelp_option'],
                            row['subscr_status'],

                            row['subscr_id'] ? row['subscr_id'] : "",
                            row['subscr_data'] ? row['subscr_data'] : "",
                            row['noads_option'],
                            row['nogrid_option'],
                            row['description'] ? row['description'] : "",
                            row['user_layout'] ? row['user_layout'] : "",
                        ]);
                    }
                    break;
            }
        }
    }
    return xid;

}
const migrateDisqusRecords = async ({
    sessionid,
    threadid,
    input,
    username,
}) => {
    let { start_time, page, size, source, target } = input
    const start = page * size
    // let targets = [target1]
    let result, sql
    let povdbSource = await dbGetQuery("povdb", threadid, source)
    let hub1db3Source = await dbGetQuery("hub1db3", threadid, source)
    let povdbTarget = await dbGetQuery("povdb", threadid, target)
    let hub1db3Target = await dbGetQuery("hub1db3", threadid, target)
    // let povdbTarget2 = await dbGetQuery("povdb", threadid, target2)
    // let hub1db3Target2 = await dbGetQuery("hub1db3", threadid, target2)
    //console.log("MIGRATING ********************************");
    sql = `SELECT * from qwp_posts where createdat>${start_time}  order by createdat desc limit ${start},${size}`
    let rows = await hub1db3Source(
        `SELECT * from qwp_posts where createdat>${start_time}  order by createdat desc limit ${start},${size} `
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `pre-migrate source: {sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        let qwikets = []
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            let thread = row["thread"]
            sql = `SELECT m.* from  pov_threads_map2 m where m.thread="${thread}"  limit 1`
            let xr = await povdbSource(
                `SELECT m.* from  pov_threads_map2 m where m.thread=? limit 1`,
                [thread]
            )
            xr = xr[0]
            // l(chalk.yellow(js(xr)))
            await dbLog({
                show: false,
                type: "SQL",
                body: `pre-migrate, source: {sql:${sql}, res:${xr ? JSON.stringify(xr, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            let rt1 = await povdbTarget1(
                `SELECT m.* from  pov_threads_map2 m where m.thread=? limit 1`,
                [thread]
            )
            //    l(chalk.grey(js({ rt1 })));
            await dbLog({
                show: false,
                type: "SQL",
                body: `pre-migrate, target1: {sql:${sql}, res:${rt1 ? JSON.stringify(rt1, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            if (!rt1 || !rt1.length) {
                l(chalk.red.bold("NEW DISQUS THREAD"))
                let insertSql = `INSERT into pov_threads_map2 (thread,channel,threadid,shortname,last_updated,posts_count,last_changed_count,thread_url) 
                VALUES ("${xr["thread"]}","${xr["channel"]}","${xr["threadid"]}","${xr["shortname"]}",${xr["last_updated"]},${xr["posts_count"]},${xr["last_changed_count"]},"${xr["thread_url"]}")`
                let res1 = await povdbTarget(
                    `
                        INSERT into pov_threads_map2(thread, channel, threadid, shortname, last_updated, posts_count, last_changed_count, thread_url) VALUES( ? , ? , ? , ? , ? , ? , ? , ? )
                        `,
                    [
                        xr["thread"],
                        xr["channel"],
                        xr["threadid"],
                        xr["shortname"],
                        xr["last_updated"],
                        xr["posts_count"],
                        xr["last_changed_count"],
                        xr["thread_url"],
                    ]
                )
                await dbLog({
                    show: false,
                    type: "SQL",
                    body: `pre-migrate, target1: {sql:${insertSql}, res:${res1 ? JSON.stringify(res1, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                })
                //  l(chalk.green("233", insertSql, res1))
            } else if (!rt1[0]["thread_url"]) {
                await povdbTarget(
                    `UPDATE pov_threads_map2 set thread_url=? where thread=?`,
                    [xr["thread_url"], xr["thread"]]
                )
            }

            sql = `SELECT id from  qwp_posts where id=${row["id"]}'  limit 1`
            let pr1 = await hub1db3Target(
                `SELECT id from  qwp_posts m where id=? limit 1`,
                [row["id"]]
            )
            await dbLog({
                show: false,
                type: "SQL",
                body: `pre-migrate, source: {sql:${sql}, res:${pr1 ? JSON.stringify(pr1, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            if (!pr1 || !pr1.length) {
                let insertSql = `INSERT INTO qwp_posts (qforumid,forum,id,parent,message,isflagged,thread,raw_message,createdat,isedited,ishighlighted,ipaddress,isspam,isdeleted,likes,isapproved,dislikes,author_username,author_name,author_url,author_profileurl,author_emailHash,author_avatar_permalink,author_avatar_cache,author_id,author_isanonymous,author_emai,json,status,state,original,movedto_postid,children,v,ticketid,post_ticketid,watch_ticketid,watch_type,watch_identity,thread_title,thread_url,role,updatedat) 
                    VALUES( ${row["qforumid"]},"${row["forum"]}", ${row["id"]
                    }, ${row["parent"]},"${row["message"]}",
                    ${row["isflagged"]},"${row["thread"]}","${row["raw_message"]
                    }",${row["createdat"]},${row["isedited"]},${row["ishighlighted"]
                    },"${row["ipaddress"] || ""}",${row["isspam"]},${row["isdeleted"]
                    },${row["likes"]},${row["isapproved"]},${row["dislikes"]},"${row["author_username"]
                    }","${row["author_name"]}","${row["author_url"]}","${row["author_profileurl"]
                    }","${row["author_emailHash"]}","${row["author_avatar_permalink"]
                    }","${row["author_avatar_cache"]}","${row["author_id"]}",${row["author_isanonymous"]
                    },"${row["author_email"]}","${row["json"]}",${row["status"]},"${row["state"]
                    }","${row["original"]}",${row["movedto_postid"]},${row["children"]
                    },${row["v"]},${row["ticket_id"]},${row["post_ticketid"]},${row["watch_ticketid"]
                    },${row["watch_type"]},"${row["watch_identity"]},"${row["thread_title"]
                    }","${row["thread_url"]}",${row["role"]},${row["updatedat"]})`
                let res1 = await hub1db3Target(
                    `
                       INSERT INTO qwp_posts (qforumid,forum,id,parent,message,isflagged,thread,raw_message,createdat,isedited,
                        ishighlighted,ipaddress,isspam,isdeleted,likes,isapproved,dislikes,author_username,author_name,author_url,
                        author_profileurl,author_emailHash,author_avatar_permalink,author_avatar_cache,author_id,author_isanonymous,author_email,json,status,state,
                        original,movedto_postid,children,v,ticketid,post_ticketid,watch_ticketid,watch_type,watch_identity,thread_title,
                        thread_url,role,updatedat) 
                    VALUES(?,?,?,?,?,?,?,?,?,?,
                        ?,?,?,?,?,?,?,?,?,?,
                        ?,?,?,?,?,?,?,?,?,?,
                        ?,?,?,?,?,?,?,?,?,?,
                        ?,?,? )
                        `,
                    [
                        row["qforumid"],
                        row["forum"],
                        row["id"],
                        row["parent"],
                        row["message"],
                        row["isflagged"],
                        row["thread"],
                        row["raw_message"],
                        row["createdat"],
                        row["isedited"],
                        row["ishighlighted"],
                        row["ipaddress"] || "",
                        row["isspam"],
                        row["isdeleted"],
                        row["likes"],
                        row["isapproved"],
                        row["dislikes"],
                        row["author_username"],
                        row["author_name"],
                        row["author_url"],
                        row["author_profileurl"],
                        row["author_emailHash"],
                        row["author_avatar_permalink"],
                        row["author_avatar_cache"],
                        row["author_id"],
                        row["author_isanonymous"],
                        row["author_email"],
                        row["json"],
                        row["status"],
                        row["state"],
                        row["original"],
                        row["movedto_postid"],
                        row["children"],
                        row["v"],
                        row["ticket_id"],
                        row["post_ticketid"],
                        row["watch_ticketid"],
                        row["watch_type"],
                        row["watch_identity"],
                        row["thread_title"],
                        row["thread_url"],
                        row["role"],
                        row["updatedat"],
                    ]
                )
                await dbLog({
                    show: false,
                    type: "SQL",
                    body: `pre-migrate, target2: {sql:${insertSql}, res:${res1 ? JSON.stringify(res1, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                })
            }
        }
    }
}
const fetchDisqus = async ({
    sessionid,
    threadid,
    input,
    username,
    dbServerName,
}) => {
    let { channelShortname, start_time, page, size } = input
    channelShortname = channelShortname || "qwiket"
    username = username || "anon"
    page = page || 0
    size = size || 25
    const start = page * size

    let result, sql
    let povdb = await dbGetQuery("povdb", threadid, dbServerName)
    let query = await dbGetQuery("hub1db3", threadid, dbServerName)

    sql = `
                        SELECT * from qwp_posts where createdat > $ { start_time }
                        order by createdat desc 'limit ${start},${size}`
    // l(chalk.cyan(sql));
    let rows = await query(
        `SELECT * from qwp_posts where createdat>${start_time}  order by createdat desc limit ${start},${size} `
    )
    //l(chalk.grey('return:', rows ? rows.length : 0))
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        let qwikets = []
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            let thread = row["thread"]
            let forum = row["forum"]
            sql = `SELECT c.slug as channelSlug,m.threadid as qwiketSlug, m.shortname as tag,m.thread_url as qwiketUrl from  pov_v10_channels c, pov_threads_map2 m where m.thread=${thread} and c.forum='${forum}'  limit 1`
            let extraRows = await povdb(
                `SELECT c.slug as channelSlug,m.threadid as qwiketSlug, m.shortname as tag,m.thread_url as qwiketUrl from  pov_v10_channels c, pov_threads_map2 m where m.thread=? and c.forum=? limit 1`,
                [thread, forum]
            )
            await dbLog({
                show: false,
                type: "SQL",
                body: `{sql:${sql}, res:${extraRows ? JSON.stringify(extraRows, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            if (extraRows && extraRows.length > 0) {
                let xr = extraRows[0]
                // l(chalk.green.bold(JSON.stringify(xr)));
                row["channelSlug"] = xr["channelSlug"]
                row["qwiketSlug"] = xr["qwiketSlug"]
                row["tag"] = xr["tag"]
                row["qwiketUrl"] = xr["qwiketUrl"]
                //l(chalk.yellow.bold(JSON.stringify(row)));
                if (
                    row["qwiketSlug"] &&
                    (row["qwiketSlug"].indexOf("51-slug") == 0 ||
                        row["qwiketSlug"].indexOf("5-slug") == 0)
                ) {
                    // console.log("disqus qwikets adding row");
                    qwikets.push(row)
                    // l(chalk.yellow.bold("PUSHED", row))
                }
            }
        }

        result = {
            success: true,
            qwikets,
            rawRows: rows.length,
        }
        //  l(chalk.green.bold('result:', JSON.stringify(result)))
    } else {
        result = {
            success: false,
            message: `fetchAllDisqus: No disqus qwikets (posts) matched the page ${page}`,
        }
    }
    return result
}
const getTag = async ({
    sessionid,
    threadid,
    input,
    username,
    dbServerName,
    micros,
}) => {
    let { slug } = input
    let sql, result
    let query = await dbGetQuery("povdb", threadid)

    sql = `SELECT * from pov_v10_unique_tags where shortname='${slug}'`
    let rows = await query(
        `SELECT * from pov_v10_unique_tags where shortname=?`,
        [slug]
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        let type = rows[0]["type"]
        if (type == 2) {
            sql = `SELECT * from pov_v10_defined_tags where tag='${slug}'`
            rows = await query(
                `SELECT t.tag as slug,t.* from pov_v10_defined_tags t where t.tag=?`,
                [slug]
            )
            await dbLog({
                show: false,
                type: "SQL",
                body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            if (rows && rows.length) {
                return {
                    success: true,
                    tag: rows[0],
                }
            }
        }
    }
    return { success: false }
}
const fetchTags = async ({
    sessionid,
    threadid,
    qwiketInput,
    username,
    dbServerName,
}) => {
    let {
        channelShortname,
        slugPrefix,
        slug,
        createdat,
        selectorType,
        selectorValue,
        published_time,
        shared_time,
        page,
        size,
        micros,
    } = qwiketInput
    micros = micros || microtime()
    channelShortname = channelShortname || "qwiket"
    username = username || "anon"
    createdat = createdat || 0
    page = page || 0
    size = size || 25
    const start = page * size
    let result, sql
    let query = await dbGetQuery("povdb", threadid, dbServerName)
    sql = `SELECT * from pov_v10_qwiket_tags${slugPrefix} where qwiketid=${slug}'`
    // l(chalk.cyan(sql));
    let rows = await query(
        `SELECT * from pov_v10_qwiket_tags${slugPrefix} where qwiketid=?`,
        [slug]
    )
    // l(chalk.grey('return:', rows ? rows.length : 0))
    await dbLog({
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        result = {
            success: true,
            tags: rows,
        }
    } else {
        result = {
            success: false,
            message: `fetchTags: No tags for qwiket ${slug}`,
        }
    }

    return result
}
const getNextFeed = async ({ threadid, sessionid, username }) => {
    let sql, result
    let query = await dbGetQuery("povdb", threadid)

    sql = `SELECT * from pov_channel_crawlers order by last_crawled desc limit 1`
    let rows = await query(
        `SELECT * from pov_channel_crawlers order by last_crawled desc limit 1`
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        return rows[0]
    }
}
const getLegacyFeed = async ({ threadid, sessionid, username, input }) => {
    let { slug } = input
    let sql, result
    let query = await dbGetQuery("povdb", threadid)
    sql = `SELECT * from pov_categories where shortname='${slug}' limit 1`
    let rows = await query(
        `SELECT * from pov_categories where shortname=? limit 1`,
        [slug]
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    let category_xid = 0
    if (rows && rows.length) {
        // l("rows[0]:", JSON.stringify(rows[0]));
        category_xid = rows[0]["xid"]
        // l("category_xid", category_xid);
    }
    if (!category_xid) {
        return {
            success: false,
            msg: `No category_xid found for ${slug}`,
        }
    }
    sql = `SELECT f.handler,c.* from pov_channel_feeds f, pov_channel_crawlers c where c.category_xid=f.category_xid and c.category_xid='${category_xid}'`
    // l(chalk.green(sql));
    rows = await query(
        `SELECT f.handler,c.* from pov_channel_feeds f, pov_channel_crawlers c where c.category_xid=f.category_xid and c.category_xid=?`,
        [category_xid]
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        let feed = rows[0]
        let rss = feed["rss"]
        if (rss) {
            sql = `SELECT * from pov_channel_crawler_rss where category_xid=${category_xid}`
            rows = await query(
                `SELECT * from pov_channel_crawler_rss where category_xid=?`,
                [category_xid]
            )
            await dbLog({
                show: false,
                type: "SQL",
                body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            if (rows && rows.length) {
                feed.rssConfig = rows[0]
            }
        }
        return {
            success: true,
            feed,
        }
    } else {
        return {
            success: false,
            msg: `No crawler and/or feed handler found for ${slug},category_xid=${category_xid}`,
        }
    }
}
const generateQwiketSlug = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    const { qwiket, silo } = input
    const { title } = qwiket
    let sql, result, slug
    let query = await dbGetQuery("povdb", threadid, dbServerName)
    let slugVerified = false
    let t = `${silo}-slug-${title}`
    if (!t) t = `${silo}-slug-${description}`
    let i = 0
    let text = t

    while (!slugVerified) {
        slug = slugify(t, { lower: true })
        slug = slug.replace(/\./g, "_")
        slug = slug.replace(/\:/g, "_")
        slug = slug.replace(/\'/g, "_")
        slug = slug.replace(/\"/g, "_")
        sql = `SELECT * from pov_threads_view${silo} where threadid='${slug}'`
        let res = await query(
            `SELECT * from pov_threads_view${silo} where threadid=?`,
            [slug]
        )
        await dbLog({
            query,
            type: "slugify",
            body: JSON.stringify({ title, t, slug, sql, res }),
            threadid,
            sessionid,
            username,
        })

        if (!result) {
            slugVerified = true
        } else {
            t = text + `-${i++}`
        }
        if (i > 100) {
            return false
        }
    }
    return slug
}
const saveTag = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { slug, tag, type, silo, micros } = input
    micros = micros || microtime()

    let sql, result
    let query = await dbGetQuery("povdb", threadid, dbServerName)
    let table = `pov_v10_qwiket_tags${silo}`
    sql = `SELECT qwiketid from ${table} where qwiketid='${slug}' and tag='${tag}'`
    //l(chalk.magenta.bold(sql));
    rows = await query(
        `SELECT qwiketid from ${table} where qwiketid=? and tag=?`,
        [slug, tag]
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })

    if (rows && rows.length)
        return {
            success: true,
        }
    sql = `INSERT INTO ${table} (qwiketid,type,tag) VALUES('${slug}',${type},'${tag}')`
    result = await query(
        `INSERT INTO ${table} (qwiketid, type, tag) VALUES(?, ?, ?)`,
        [slug, type, tag]
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${result ? JSON.stringify(result, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (result && result.affectedRows) {
        return {
            success: true,
        }
    }
    return { success: false, result }
}
const fetchOutputQueue = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let sql, result
    l(chalk.green.bold("fetchOutputQueue", dbServerName));
    const now = (Date.now() / 1000) | 0
    let query = await dbGetQuery("povdb", threadid, dbServerName)
    sql = `SELECT shared_time,CONVERT(qwiket USING utf8mb4) as qwiket,qwiketSlug,tagSlug as primaryTag,silo from pov_output_queue order by  shared_time limit 140'   //<'${now}'`
    const rows = await query(
        `SELECT shared_time,CONVERT(qwiket USING utf8mb4) as qwiket,qwiketSlug,tagSlug as primaryTag,silo from pov_output_queue order by shared_time limit 140`

    )
    l('SQL:', sql, rows.length)
    //
    // l(23984, chalk.magenta.bold(js(rows)))
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows && rows.length) {
        for (let i = 0; i < rows.length; i++) {
            let slug = rows[i].qwiketSlug
            l(chalk.green.bold("OUTPUT QUEUE DELETING", slug, `DELETE from pov_output_queue where qwiketSlug='${slug}'`))
            result = await query(`DELETE from pov_output_queue where qwiketSlug=?`, [slug])
            l(result)
        }

    }


    // sql = `DELETE from pov_output_queue order by shared_time limit 40'  //<${now}`
    // result = await query(`DELETE from pov_output_queue order by  shared_time limit 40`)
    /*  await dbLog({
          show: false,
          type: "SQL",
          body: `{sql:${sql}, res:${
              result ? JSON.stringify(result, null, 4) : "null"
          }}`,
          threadid,
          sessionid,
          username,
      })*/

    return rows
}
const outputQueue = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
    input,
}) => {
    l("outputQueue", dbServerName)
    let { tagSlug, qwiketSlug, qwiket, silo } = input
    let sql, result
    if (!tagSlug) {
        l(
            "outputQueue empty tagSlug",
            js({ qwiket, qwiketSlug, silo, cat: qwiket["cat"] })
        )
        tagSlug = qwiket["cat"]
        if (!tagSlug) return false
    }
    const qwiketString = JSON.stringify(qwiket)
    let query = await dbGetQuery("povdb", threadid, dbServerName, "outputQueue")
    sql = `SELECT tagSlug from pov_output_queue where tagSlug='${tagSlug}' and qwiketSlug='${qwiketSlug}' and silo=${silo}`
    // l(sql);
    const rows1 = await query(
        `SELECT tagSlug  from pov_output_queue where tagSlug=? and qwiketSlug=? and silo=?`,
        [tagSlug, qwiketSlug, silo]
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${rows1 ? JSON.stringify(rows1, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    if (rows1 && rows1.length) return false //another option - to update qwiket?

    /* three data points, for the the same silo:
      1. latest qwiket with the same tagSlug
      2. Number of qwikets with the same tagSlug
      3. Number of qwikets in the next 60 seconds
    */
    sql = `select shared_time from pov_output_queue where tagSlug='${tagSlug}' and silo=${silo} order by shared_time desc limit 1`
    // l(sql);
    const rows2 = await query(
        `select shared_time from pov_output_queue where tagSlug=? and silo=? order by shared_time desc limit 1`,
        [tagSlug, silo]
    )
    let lastSharedTag = rows2 && rows2.length ? rows2[0]["shared_time"] : 0
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${rows2 ? JSON.stringify(rows2, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    sql = `SELECT count (shared_time) c from pov_output_queue where tagSlug='${tagSlug}' and silo=${silo}`
    // l(sql);
    const rows3 = await query(
        `SELECT count (shared_time) c from pov_output_queue where tagSlug=? and silo=?`,
        [tagSlug, silo]
    )
    let countTag = rows3 && rows3.length ? rows3[0]["c"] : 0
    const now = (Date.now() / 1000) | 0
    const interval = now - 60
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${rows3 ? JSON.stringify(rows3, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    sql = `SELECT count (shared_time) c from pov_output_queue where silo=${silo} and shared_time>${interval}`
    // l(sql);
    const rows4 = await query(
        `SELECT count (shared_time) c from pov_output_queue where  silo=? and shared_time>?`,
        [tagSlug, silo]
    )
    let countSilo = rows4 && rows4.length ? rows4[0]["c"] : 0
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${rows4 ? JSON.stringify(rows4, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    // LOGIC:
    let shared_time = now
    lastSharedTag = lastSharedTag ? lastSharedTag : now
    /* l("########################", {
        now,
        countTag,
        countSilo,
        shared_time,
        lastSharedTag,
    });*/
    if (countTag == 0 && countSilo > 5) shared_time += 1
    else {
        if (countTag < 5) shared_time = lastSharedTag + 60
        else {
            if (countTag < 10) shared_time = lastSharedTag + 45
            else {
                if (countTag < 100) shared_time = lastSharedTag + 30
                else shared_time = lastSharedTag + 10
            }
        }
    }
    sql = `INSERT INTO  pov_output_queue (tagSlug,qwiketSlug,silo,shared_time,timestamp,qwiket) VALUES ('${tagSlug}','${qwiketSlug}',${silo},${shared_time},${now},'${qwiketString}')`
    //l(chalk.grey("4392", dbServerName || process.env.DB_HOST_PRIMARY, js({ sql, dbServerName })))

    result = await query(
        `INSERT INTO  pov_output_queue (tagSlug,qwiketSlug,silo,shared_time,timestamp,qwiket) VALUES (?,?,?,?,?,?)`,
        [tagSlug, qwiketSlug, silo, shared_time, now, qwiketString]
    )
    // if (!result) {
    //}
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${result ? JSON.stringify(result, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    return true
}
const save = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
    action,
}) => {
    l(chalk.green.bold("dbQwiket.update", dbServerName))
    let {
        slug,
        url,
        title,
        description,
        site_name,
        image,
        image_src,
        author,
        body,
        locale,
        published_time,
        updated_time,
        shared_time,
        sharedByName,
        sharedBySlug,
        created,
        createdBy,
        updated,
        updatedBy,
        micros,
        entity,
        reshare,
        date,
        category_xid,
        tagsSlugs,
        identity,
    } = input
    // l(JSON.stringify({ input }));
    micros = micros || microtime()
    let utime = (Date.now() / 1000) | 0

    entity = entity || "qwiket"
    l("save image_src", JSON.stringify({ slug, image_src }))
    let sql, result, res
    let query = await dbGetQuery("povdb", threadid, dbServerName)
    let sw = slug.split("-slug-")
    let silo = 0
    if (sw && sw.length > 1) silo = sw[0]

    let table = `pov_threads_view${silo ? silo : ""}`
    console.log("saving to table", table)
    date = date ? date : (Date.now() / 1000) | 0
    updated_time = updated_time ? updated_time : date
    shared_time = shared_time ? shared_time : date
    title = ds(title)
    description = ds(description)
    author = ds(author)
    body = ds(body)
    image = ds(image)
    image_src = ds(image_src)
    site_name = ds(site_name)
    url = ds(url)
    locale = ds(locale)
    image_src = image_src ? image_src : image
    l("category_xid save:", category_xid, slug)
    category_xid = category_xid ? category_xid : 0
    shared_time = shared_time || (Date.now() / 1000) | 0
    sharedByName = sharedByName
        ? sharedByName
        : sharedBySlug
            ? sharedBySlug
            : username
    sharedBySlug = sharedBySlug ? sharedBySlug : username
    created = created ? created : utime
    createdBy = createdBy ? createdBy : username
    updated = updated ? updated : utime
    updatedBy = updatedBy ? updatedBy : username
    identity = identity ? identity : username
    if (action != "insert") {
        sql = `SELECT * from ${table} where threadid='${slug}'`
        let rows = await query(`SELECT * from ${table} where threadid=?`, [
            slug,
        ])
        res = false
        if (rows) res = rows[0]
        // l("after test", res);
        await dbLog({
            show: false,
            query,
            type: "SQL",
            body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                }}`,
            threadid,
            sessionid,
            username,
        })
        if (res) {
            l("UPDADING.....", js({ slug }))
            if (
                res.micros < micros &&
                (res.title != title ||
                    res.site_name != site_name ||
                    res.url != url ||
                    res.description != description ||
                    res.author != author ||
                    res.body != body)
            ) {
                // l(1251);
                shared_time = res.shared_time
                sql = `UPDATE ${table} set title='${title}',site_name='${site_name}',url='${url}',description='${description}',locale='${locale}',identity='${identity}',image='${image}',date='${date}',published_time='${published_time}',updated_time='${updated_time}',shared_by_user_name='${sharedByName}',category_xid='${category_xid}',author='${author}',reshare=${reshare},shared_time='${shared_time}',image_src='${image_src}',entity='${entity}',body='${body}',micros=${micros},updated=${updated},updatedBy='${updatedBy}
                 where threadid='${slug}'`
                // l(1252);
                try {
                    result = await query(
                        `UPDATE ${table} set title=?,site_name=?,url=?,description=?,locale=?,identity=?,image=?,date=?,published_time=?,updated_time=?,shared_by_user_name=?,category_xid=?,author=?,reshare=?,shared_time=?,image_src=?,entity=?,body=?,micros=?,updated=?,updatedBy=? where threadid='${slug}'`,
                        [
                            title,
                            site_name,
                            url,
                            description,
                            locale,
                            identity,
                            image,
                            date,
                            published_time,
                            updated_time,
                            sharedByName,
                            category_xid,
                            author,
                            reshare,
                            shared_time,
                            image_src,
                            entity,
                            body,
                            micros,
                            updated,
                            updatedBy,
                        ]
                    )
                } catch (x) {
                    l("CATCH29", x)
                    l(JSON.stringify(x))
                    await dbLog({
                        show: false,
                        type: "XSQL",
                        body: `{sql:${sql}, res:${x ? JSON.stringify(x, null, 4) : "null"
                            }}`,
                        threadid,
                        sessionid,
                        username,
                    })
                }
                l("UPDADING2.....", slug)
                await dbLog({
                    show: false,
                    type: "SQL",
                    body: `{sql:${sql}, res:${result ? JSON.stringify(result, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                })
                return {
                    success: true,
                    slug,
                }
            } else {
                // l(3331, js({ slug }));
                return {
                    success: true,
                    slug,
                }
            }
        }
    }
    // l(chalk.yellow.bold("INSERTING"));
    sql = `INSERT INTO ${table} (threadid,title,site_name,url,description,locale,identity,image,date,published_time,updated_time,shared_by_user_name,category_xid,author,reshare,
        shared_time,image_src,entity,body,micros,created,createdBy,updated,updatedBy) VALUES ('${slug}','${title}','${site_name}','${url}','${description}','${locale}','${identity}','${image}',${date},${published_time},
        ${updated_time},'${sharedByName}',${category_xid},'${author}',${reshare},${shared_time},'${image}','${entity}','${body}',${micros},${created},'${createdBy}',${updated},'${updatedBy}')`
    //l(chalk.blue.bold(category_xid, sql));
    result = await query(
        `INSERT INTO ${table} (threadid,title,site_name,url,description,locale,identity,image,date,published_time,updated_time,shared_by_user_name,category_xid,author,reshare, shared_time,image_src,entity,body,micros,created,createdBy,updated,updatedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            slug,
            title,
            site_name,
            url,
            description,
            locale,
            identity,
            image,
            date,
            published_time,
            updated_time,
            sharedByName,
            category_xid,
            author,
            reshare,
            shared_time,
            image_src,
            entity,
            body,
            micros,
            created,
            createdBy,
            updated,
            updatedBy,
        ]
    )

    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${result ? JSON.stringify(result, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })

    if (result) {
        let xid = result.insertId
        l("inserted xid=", xid)
        sql = `SELECT * from ${table} where threadid=${slug} limit 1`
        let rows = await query(
            `SELECT * from ${table} where threadid=? limit 1`,
            [slug]
        )
        await dbLog({
            show: false,
            type: "SQL",
            body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                }}`,
            threadid,
            sessionid,
            username,
        })

        if (rows && rows.length) {
            let table3 = `pov_v10_qwiket_tags${silo ? silo : ""}`
            sql = `DELETE FROM ${table3} where qwiketid='${slug}'`
            result = await query(`DELETE FROM ${table3} where qwiketid=?`, [
                slug,
            ])
            await dbLog({
                show: false,
                type: "SQL",
                body: `{sql:${sql}, res:${result ? JSON.stringify(result, null, 4) : "null"
                    }}`,
                threadid,
                sessionid,
                username,
            })
            l(chalk.cyan("SAVING TAGS", tagsSlugs, table3))
            let ts =
                typeof tagsSlugs === "string"
                    ? JSON.parse(tagsSlugs)
                    : tagsSlugs
            for (var i = 0; i < ts.length; i++) {
                let tagSlug = ts[i]
                let { slug: tag, type } = tagSlug
                l("inserging tag slug", tagSlug, tag, type)
                sql = `INSERT INTO ${table3} (qwiketid,type,tag) VALUES ('${slug}',${type},'${tag}')`
                l(sql)
                result = await query(
                    `INSERT INTO ${table3} (qwiketid,type,tag) VALUES (?,?,?)`,
                    [slug, type, tag]
                )
                await dbLog({
                    show: false,
                    type: "SQL",
                    body: `{sql:${sql}, res:${result ? JSON.stringify(result, null, 4) : "null"
                        }}`,
                    threadid,
                    sessionid,
                    username,
                })
            }
        }

        return {
            success: true,
            slug,
        }
    }

    return result
}
const checkUrl = async ({
    threadid,
    sessionid,
    username,
    input,

    dbServerName,
}) => {
    let { url, silo } = input
    let sql, result
    let query = await dbGetQuery("povdb", threadid, dbServerName, "checkUrl")
    //  l("checkUrl", silo);
    //  for (var i = 0; i < 6; i++) {
    let i = silo
    sql = `SELECT threadid as slug, published_time,shared_time,title,description,author,image from pov_threads_view${i ? i : ""
        } where url='${url}' limit 1`
    let rows = await query(
        `SELECT threadid as slug , published_time,shared_time,title,description,author,image from pov_threads_view${i ? i : ""
        } where url=? limit 1`,
        [url]
    )
    await dbLog({
        show: false,
        type: "SQL",
        body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
            }}`,
        threadid,
        sessionid,
        username,
    })
    let category_xid = 0
    if (rows && rows.length) {
        let slug = rows[0]["slug"]
        let published_time = rows[0]["published_time"]
        let shared_time = rows[0]["shared_time"]

        let key = `${slug}.qwiket`
        sql = `SELECT value from q${i ? i : ""} where \`key\`='${key}'`
        rows = await query(`SELECT value from q${i ? i : ""} where \`key\`=?`, [
            key,
        ])
        await dbLog({
            show: false,
            type: "SQL",
            body: `{sql:${sql}, res:${rows ? JSON.stringify(rows, null, 4) : "null"
                }}`,
            threadid,
            sessionid,
            username,
        })
        // if (rows[0]) l(chalk.green.bold("Q:", rows[0]["value"]));
        // l("check return false");
        return {
            success: false,
            slug,
            published_time,
            shared_time,
            q: rows && rows.length ? JSON.parse(rows[0]["value"]) : {},
        }
    }
    // }
    //  l("checkUrl end");
    return {
        success: true,
    }
}

const cacheTimestamps = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { type, key } = input
    let sql, result;
    try {
        let query = await dbGetQuery("povdb", threadid, dbServerName, "cacheTimestamps");
        sql = `SELECT * from pov_cache_timestamps where \`type\`='${type}' and \`key\`='${key}'`;
        console.log(sql, type, key)
        result = await query(`SELECT * from pov_cache_timestamps where \`type\`=? and \`key\`=?`, [type, key]);
        l("result", result)
        return result ? result[0] : null;
    }
    catch (x) {
        l(chalk.red.bold(x))
    }
}

const fetchQwiketsIndexedSince = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { time, field, test } = input
    let sql, result;
    let query = await dbGetQuery("povdb", threadid, dbServerName, "fetchQwiketsIndexedSince");
    if (time) {
        sql = `SELECT * from pov_category_qwikets where \`${field}\`>='${time}' and test='${test}' `;
        result = await query(`SELECT * from pov_category_qwikets where \`${field}\`>=? and test=? `, [time, test]);
    }
    else {
        sql = `SELECT * from pov_category_qwikets where  test='${test}' `;
        result = await query(`SELECT * from pov_category_qwikets where test=? `, [test]);
    }
    console.log(sql)
    return result;
}

const primaryThreadXid = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { threadid: qThreadid, } = input
    let sql, result;
    let query = await dbGetQuery("povdb", threadid, dbServerName, "primaryThreadXid");
    let table = splitQwiketid(qThreadid);
    sql = `SELECT xid as thread_xid FROM \`${table}\` where threadid='${qThreadid}' order by reshare desc limit 1`;
    let rows = await query(`SELECT xid as thread_xid FROM \`${table}\` where threadid=? order by reshare desc limit 1`, [qThreadid]);
    console.log(sql);
    return rows['thread_xid'];
}
const splitTable = (table, qwiketid) => {

    // let table = 'pov_threads_view';
    l("splitTable", table, qwiketid)
    const e = qwiketid.split('-slug-');//explode('-slug-',$qwiketid);
    if (e.length > 1) {
        table += e[0];
    } else {
        e = qwiketid.split('$-');

        if (e.length > 1) {
            table += e[0];
        }
    }
    return table;
}
const tableByXid = (xid) => {

    // let table = 'pov_threads_view';
    l("splitTable", table, qwiketid)
    let table = 'pov_threads_view';
    if (xid >= 2000000000)
        table = 'pov_threads_view1';
    if (xid >= 3000000000)
        table = 'pov_threads_view2';
    if (xid >= 4000000000)
        table = 'pov_threads_view3';
    if (xid >= 5000000000)
        table = 'pov_threads_view4';
    if (xid >= 6000000000)
        table = 'pov_threads_view5';
    if (xid >= 7000000000)
        table = 'pov_threads_view51';
    return table;
}


const getQwiket = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { xid, qThreadid } = input
    l("getQwiket", js(input))
    let sql, result;
    let query = await dbGetQuery("povdb", threadid, dbServerName, "primaryThreadXid");
    let table = splitTable('pov_threads_view', qThreadid);
    sql = `SELECT * FROM \`${table}\` where xid=${xid} limit 1' `;
    result = await query(`SELECT * FROM \`${table}\` where xid=? limit 1`, [xid]);
    console.log(sql);
    return result[0];
}
const getUser = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { identity } = input
    let sql, result;
    let query = await dbGetQuery("povdb", threadid, dbServerName, "primaryThreadXid");

    sql = `SELECT username,user_name,profileurl FROM pov_users where identity='${identity}' limit 1' `;
    result = await query(`SELECT username,user_name,profileurl FROM pov_users where identity=? limit 1`, [identity]);
    console.log(sql);
    return result[0];
}
const getQ = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { key } = input
    l("getQ", js(input))
    let sql, result;
    let query = await dbGetQuery("povdb", threadid, dbServerName, "primaryThreadXid");
    let table = splitTable('q', key);
    sql = `SELECT value FROM \`${table}\` where key=${key} limit 1' `;
    result = await query(`SELECT value FROM \`${table}\` where \`key\`=? limit 1`, [key]);
    console.log(sql);
    return result && result.length ? result[0]['value'] : null;
}
const trimCategoryQwikets = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { field, test } = input
    let sql, result;
    const time = Date.now() | 1000 | 0 - 7 * 24 * 3600;
    let query = await dbGetQuery("povdb", threadid, dbServerName, "fetchQwiketsIndexedSince");
    sql = `DELETE FROM pov_category_qwikets where time < ${time} ' `;
    result = await query(`DELETE FROM pov_category_qwikets where time < ?`, [time]);
    console.log(sql);
}

const fetchChannelPostsSince = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { time, forum } = input
    let sql, result;
    //$table= tableByXid($thread_xid);
    let query = await dbGetQuery("povdb", threadid, dbServerName, "fetchQwiketsIndexedSince");
    sql = `SELECT * FROM pov_channel_posts where forum='${forum}' and createdat> '${time}' `;
    result = await query(`SELECT * FROM pov_channel_posts where forum=? and createdat> ?`, [forum, time]);
    console.log(sql);
    return result;
}
const getThreadQwiket = async ({
    threadid,
    sessionid,
    username,
    input,
    dbServerName,
}) => {
    let { thread } = input
    let sql, result;
    //$table= tableByXid($thread_xid);
    let query = await dbGetQuery("povdb", threadid, dbServerName, "fetchQwiketsIndexedSince");
    sql = `SELECT * FROM pov_threads_map2 where thread='${thread}' `;
    result = await query(`SELECT * FROM pov_threads_map2 where thread=? `, [thread]);
    l(chalk.yellow(js(result)))
    console.log(sql);
    if (result&&result.length>0) {
        const qThreadid = result[0]['threadid'];
        l('qThredid', qThreadid)
        let table = splitTable('pov_threads_view', qThreadid);
        sql = `SELECT * FROM \`${table}\` where threadid='${qThreadid}' order by reshare desc limit 1`;
        result = await query(`SELECT * FROM \`${table}\` where threadid=? order by reshare desc limit 1 `, [qThreadid]);
        return result;
    }
    else
        return 0;
}

export default {
    migrateQwiketRecords,
    longMigrateQwiketRecords,
    longMigrateTable,
    migrateDisqusRecords,
    getNextFeed,
    getLegacyFeed,
    checkUrl,
    generateQwiketSlug,
    save,
    saveTag,
    fetchByPublished,
    fetchQ,
    fetchAllQ,
    fetchAllDisqus,
    fetchDisqus,
    fetchTags,
    fetch,
    fetchAll,
    getTag,
    outputQueue,
    fetchOutputQueue,
    remove,
    cacheTimestamps,
    fetchQwiketsIndexedSince,
    primaryThreadXid,
    getQwiket,
    getUser,
    getQ,
    trimCategoryQwikets,
    fetchChannelPostsSince,
    getThreadQwiket
}