//require("dotenv").config();
import { l, chalk, microtime, js, ds } from "../common.js";
import { dbGetQuery, dbLog } from "../db.js";

const fetchSubroots = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let sql, result;
    /// l("fetchSubroots");
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `SELECT * from pov_v10_feed_subroots limit 10000`;
    let rows = await query(`SELECT * from pov_v10_feed_subroots limit 10000`);
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });

    // l("fetchSubroots");
    return rows;
};

const fetchRoots = async ({ threadid, sessionid, username, dbServerName }) => {
    let sql, result;
    /// l("fetchSubroots");
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `SELECT slug,root,active from pov_v10_feeds limit 10000`;
    let rows = await query(
        `SELECT slug,root,active from pov_v10_feeds limit 10000`
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    // l("fetchSubroots");
    return rows;
};
const fetchActiveFeeds = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let sql, result;
    /// l("fetchSubroots");
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `SELECT slug,root,minTimeout from pov_v10_feeds where active=1 limit 10000`;
   // l(444,sql)
    let rows = await query(
        `SELECT slug,root,minTimeout from pov_v10_feeds where active=1 limit 10000`
    );
  //  l(555,rows)
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
     //l("fetchSubroots");
    return rows;
};
const fetchLegacyRoots = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let sql, result;
    /// l("fetchSubroots");
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `SELECT c.shortname as slug,cc.root from pov_channel_crawlers cc, pov_categories c where c.xid=cc.category_xid and c.shortname NOT IN (select slug from pov_v10_feeds) limit 10000`;
    let rows = await query(
        `SELECT c.shortname as slug,cc.root from pov_channel_crawlers cc, pov_categories c where c.xid=cc.category_xid and c.shortname NOT IN (select slug from pov_v10_feeds) limit 10000`
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    // l("fetchSubroots");
    return rows;
};
const fetchTags = async ({ threadid, sessionid, username, dbServerName }) => {
    let sql, result;
    l("fetchTags");
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `SELECT tag,name,image as icon from pov_v10_defined_tags where metatag='publication' order by tag limit 10000`;
    let rows = await query(
        `SELECT tag,name,image as icon from pov_v10_defined_tags where metatag='publication' order by tag limit 10000`
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    l("fetchTags2");
    return rows;
};

const fetchFeed = async ({
    input,
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let sql, result;
    let { slug } = input;
    let feed;
    //l("fetchFeed", js({ slug, threadid }));
    let query = await dbGetQuery("povdb", threadid, dbServerName);

    /*
      slug,
        name,
        description,
        image,
        image_src,
        path,
        link,
        published,
        owner
        entity,
        rssFeeds,
        root,
        both,
        last,
        active,
        created,
        createdBy,
        updated,
        updatedBy,
        micros,
        category_xid,
        */
    sql = `SELECT dt.tag as slug,dt.*, c.xid as category_xid, c.published, f.notor,f.root,f.rss,f.both,f.last,f.active,f.notor from pov_v10_defined_tags dt, pov_categories c,pov_v10_feeds f where dt.metatag='publication' and dt.tag=c.shortname and dt.tag='${slug}' and f.slug=dt.tag`;

    const rows2 = await query(
        `SELECT dt.tag as slug,dt.*, c.xid as category_xid, c.published, f.notor,f.root,f.rss,f.both,f.last,f.active,f.notor  from pov_v10_defined_tags dt, pov_categories c,pov_v10_feeds f where dt.metatag='publication' and dt.tag=c.shortname and dt.tag=? and f.slug=dt.tag`,
        [slug]
    );
    if(slug=='americanthinker'){
        l('slug:',slug,rows2)
    }
    feed = rows2 && rows2.length ? rows2[0] : null;
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            feed ? JSON.stringify(feed, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });

    if (feed) {
       // l(chalk.yellow("Feed:",js(feed)))
        if (feed.rss == 1) {
            sql = `SELECT * from pov_v10_feed_rss where slug='${slug}'`;
            const rows3 = await query(
                `SELECT * from pov_v10_feed_rss where slug=?`,
                [slug]
            );
            const rssFeeds = rows3 ? rows3 : null;
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    rssFeeds ? JSON.stringify(rssFeeds, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
            if (rssFeeds) {
                feed.rssFeeds = rssFeeds;
            }
        }
        /* sql = `SELECT subroot,slug from pov_v10_feed_subroots where rootSlug='${slug}'`;
            rows = await query(
                `SELECT subroot,slug from pov_v10_feed_subroots where rootSlug=?`,
                [slug]
            );
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    rows ? JSON.stringify(rows, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
            if (rows && rows.length) {
                feed.subroots = rows;
            }*/

        //l("END FETCH FEED");
        return { success: true, feed };
    } else {
        l(chalk.green("LEGACY FEED"));
        /*  slug,
        name,
        description,
        image,
        image_src,
        path,
        link,
        published,
        owner
        entity,
        rssFeeds,
        root,
        both,
        last,
        active,
        created,
        createdBy,
        updated,
        updatedBy,
        micros,
        category_xid,
        */
        sql = `SELECT c.shortname as slug,c.text as name,c.description,c.icon as image, c.icon_src as image_src,c.path,'' as link,i.username as owner,c.entity, c.xid as category_xid, c.published, f.root,f.rss,f.both,f.last_crawled as last,f.approved as active,1 as notor from pov_categories c
LEFT OUTER JOIN pov_users i on i.identity=c.identity,
pov_channel_crawlers f where c.shortname ='${slug}' and f.category_xid=c.xid `;
        const rows2 = await query(
            `SELECT c.shortname as slug,c.text as name,c.description,c.icon as image, c.icon_src as image_src,c.path,'' as link,i.username as owner,c.entity, c.xid as category_xid, c.published, f.root,f.rss,f.both,f.last_crawled as last,f.approved as active,1 as notor from pov_categories c
LEFT OUTER JOIN pov_users i on i.identity=c.identity,
pov_channel_crawlers f where c.shortname =? and f.category_xid=c.xid `,
            [slug]
        );
        feed = rows2 && rows2.length ? rows2[0] : null;
        await dbLog({
            show: false,
            type: "SQL",
            body: `{server:${dbServerName},sql:${sql}, res:${
                feed ? JSON.stringify(feed, null, 4) : "null"
            }}`,
            threadid,
            sessionid,
            username,
        });
        if (feed) {
            let category_xid = feed.category_xid;
            if (feed) {
                if (feed.rss) {
                    sql = `SELECT rss,1 as active from pov_channel_crawler_rss where category_xid='${category_xid}'`;
                    // l(sql);
                    const rows3 = await query(
                        `SELECT rss,1 as active from pov_channel_crawler_rss where category_xid=?`,
                        [category_xid]
                    );
                    await dbLog({
                        show: false,
                        type: "SQL",
                        body: `{server:${dbServerName},sql:${sql}, res:${
                            rows3 ? JSON.stringify(rows3, null, 4) : "null"
                        }}`,
                        threadid,
                        sessionid,
                        username,
                    });
                    if (rows3 && rows3.length) {
                        feed.rssFeeds = rows3;
                    }
                }
                l("END FETCH");
                return { success: true, feed };
            }
        }
    }
    l("END FETCH FAILED");
    return { success: false };
};
const saveFeed = async ({
    input,
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let sql, result;
    let {
        slug,
        name,
        description,
        image,
        image_src,
        path,
        link,
        published,
        owner,
        entity,
        rssFeeds,
        subroots,
        root,
        rss,
        both,
        last,
        active,
        created,
        createdBy,
        updated,
        updatedBy,
        micros,
        category_xid,
        notor,
    } = input;
    rss = rss ? rss : rssFeeds && rssFeeds.length > 0 ? 1 : 0;
    micros = micros || microtime();
    let utime = (Date.now() / 1000) | 0;

    name = ds(name);
    description = ds(description);
    image = ds(image);
    image_src = image_src ? image_src : ds(image);
    path = ds(path);
    link = ds(link);
    published = published ? 1 : active ? 1 : 0;
    root = ds(root);
    both = both ? 1 : 0;
    last = last ? last : 0;
    active = active ? 1 : 0;
    notor = notor ? notor : 0;
    created = created ? created : utime;
    createdBy = createdBy ? createdBy : username;
    updated = updated ? updated : utime;
    updatedBy = updatedBy ? updatedBy : username;
    owner = owner ? owner : username;
    let approved = active;
    // l(chalk.yellow.bold("UTIME:", utime, created, updated));
    let metatag = "publication";
    l("saveFeed");
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    /**
     * DEFINED TAGS (V10)
     */
    sql = `SELECT micros from pov_v10_defined_tags where metatag='publication' and tag='${slug}'`;
    let rows = await query(
        `SELECT micros from pov_v10_defined_tags where metatag='publication' and tag=?`,
        [slug]
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (!rows || !rows.length) {
        sql = `INSERT INTO pov_v10_defined_tags (tag, metatag,name,description,image,image_src,link,owner,entity,path,created,createdBy,updated,updatedBy,micros) VALUES ('${slug}','${metatag}','${name}','${description}','${image}','${image_src}','${link}','${username}','${entity}','${path}',${created},'${createdBy}',${updated},'${username}',${micros}) `;
        result = await query(
            `INSERT INTO pov_v10_defined_tags (tag, metatag,name,description,image,image_src,link,owner,entity,path,created,createdBy,updated,updatedBy,micros) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                slug,
                metatag,
                name,
                description,
                image,
                image_src,
                link,
                owner,
                entity,
                path,
                created,
                createdBy,
                updated,
                updatedBy,
                micros,
            ]
        );
        await dbLog({
            show: false,
            type: "SQL",
            body: `{server:${dbServerName},sql:${sql}, res:${
                result ? JSON.stringify(result, null, 4) : "null"
            }}`,
            threadid,
            sessionid,
            username,
        });
    } else {
        let res = rows[0];
        if (micros > res.micros) {
            sql = `UPDATE pov_v10_defined_tags set name='${name}',description='${description}',image='${image}',image_src='${image_src}',link='${link}',path='${path}', updated='${updated}',updatedBy='${updatedBy}',micros=${micros} where tag='${slug}'`;
            result = await query(
                `UPDATE pov_v10_defined_tags set name=?,description=?,image=?,image_src=?,link=?,path=?, updated=?,updatedBy=?,micros=? where tag=?`,
                [
                    name,
                    description,
                    image,
                    image_src,
                    link,
                    path,
                    updated,
                    updatedBy,
                    micros,
                    slug,
                ]
            );
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    result ? JSON.stringify(result, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
        }
    }
    /**
     * CATEGORIES
     */
    sql = `SELECT xid from pov_categories where shortname='${slug}'`;
    rows = await query(`SELECT xid from pov_categories where shortname=?`, [
        slug,
    ]);
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (!rows || !rows.length) {
        l("insert feed");
        if (category_xid) {
            sql = `INSERT INTO pov_categories (xid,shortname, text,description,icon,icon_src,leaf,identity,entity,path,approval_status) VALUES ('${category_xid}','${slug}','${metatag}','${name}','${description}','${image}','${image_src}',1,'${createdBy}','${entity}','${path}','${approved}') `;
            result = await query(
                `INSERT INTO pov_categories (xid,shortname, text,description,icon,icon_src,leaf,identity,entity,path,approval_status) VALUES (?,?,?,?,?,?,1,?,?,?,?)`,
                [
                    category_xid,
                    slug,
                    name,
                    description,
                    image,
                    image_src,
                    createdBy,
                    entity,
                    path,
                    approved,
                ]
            );
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    result ? JSON.stringify(result, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
        } else {
            sql = `INSERT INTO pov_categories (shortname, text,description,icon,icon_src,leaf,identity,entity,path,approval_status) VALUES ('${slug}','${metatag}','${name}','${description}','${image}','${image_src}',1,'${createdBy}','${entity}','${path}','${approved}') `;
            result = await query(
                `INSERT INTO pov_categories (shortname, text,description,icon,icon_src,leaf,identity,entity,path,approval_status) VALUES (?,?,?,?,?,1,?,?,?,?)`,
                [
                    slug,
                    name,
                    description,
                    image,
                    image_src,
                    createdBy,
                    entity,
                    path,
                    approved,
                ]
            );
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    result ? JSON.stringify(result, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
            category_xid = result.insertId;
        }
    } else {
        let res = rows[0];
        l("updating feed micros good");
        sql = `UPDATE pov_categories set text='${name}',description='${description}',icon='${image}',icon_src='${image_src}',path='${path}', updated=now(),updatedBy='${username}',micros=${micros},approval_status='${approved}' where shortname='${slug}'`;
        l(sql);
        result = await query(
            `UPDATE pov_categories set text=?,description=?,icon=?,icon_src=?,path=?,approval_status=? where shortname=?`,
            [name, description, image, image_src, path, approved, slug]
        );
        await dbLog({
            show: false,
            type: "SQL",
            body: `{server:${dbServerName},sql:${sql}, res:${
                result ? JSON.stringify(result, null, 4) : "null"
            }}`,
            threadid,
            sessionid,
            username,
        });
    }
    /**
     * FEEDS V10
     */
    sql = `SELECT micros from pov_v10_feeds where  slug='${slug}'`;
    rows = await query(`SELECT micros from pov_v10_feeds where  slug=?`, [
        slug,
    ]);
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (!rows || !rows.length) {
        sql = `INSERT INTO pov_v10_feeds (slug, root,rss,\`both\`,active,last,created,createdBy,updated,updatedBy,notor,micros) VALUES ('${slug}','${root}','${rss}','${both}','${active}','${last}''${created}','${createdBy}','${updated}','${updatedBy}',${notor},${micros}) `;
        l(sql);
        result = await query(
            `INSERT INTO pov_v10_feeds (slug, root,rss,\`both\`,active,last,created,createdBy,updated,updatedBy,notor,micros) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                slug,
                root,
                rss,
                both,
                active,
                last,
                created,
                createdBy,
                updated,
                updatedBy,
                notor,
                micros,
            ]
        );
        await dbLog({
            show: false,
            type: "SQL",
            body: `{server:${dbServerName},sql:${sql}, res:${
                result ? JSON.stringify(result, null, 4) : "null"
            }}`,
            threadid,
            sessionid,
            username,
        });
    } else {
        let res = rows[0];
        if (micros > res.micros) {
            sql = `UPDATE pov_v10_feeds set root='${root}',rss='${rss}',\`both\`='${both}',last='${last}',active='${active}', updated=${updated},updatedBy='${updatedBy}',notor=${notor},micros=${micros} where slug='${slug}'`;
            result = await query(
                `UPDATE pov_v10_feeds set root=?,rss=?,\`both\`=?,last=?,active=?, updated=?,updatedBy=?,notor=?,micros=? where slug=?`,
                [
                    root,
                    rss,
                    both,
                    last,
                    active,
                    updated,
                    updatedBy,
                    notor,
                    micros,
                    slug,
                ]
            );
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    result ? JSON.stringify(result, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
        }
    }

    /**
     * FEEDS RSS V10
     */
    if (rssFeeds && rssFeeds.length) {
        sql = `delete from pov_v10_feed_rss where slug='${slug}'`;
        result = await query(`delete from pov_v10_feed_rss where slug=?`, [
            slug,
        ]);
        await dbLog({
            show: false,
            type: "SQL",
            body: `{server:${dbServerName},sql:${sql}, res:${
                result ? JSON.stringify(result, null, 4) : "null"
            }}`,
            threadid,
            sessionid,
            username,
        });
        rssFeeds.forEach(async feed => {
            let { rss, active } = feed;
            l("rss:", rss, active);
            sql = `INSERT into pov_v10_feed_rss (slug,rss,active) VALUES ('${slug}','${rss}',${active})`;
            l(sql);
            result = await query(
                `INSERT into pov_v10_feed_rss (slug,rss,active) VALUES (?,?,?)`,
                [slug, rss, active]
            );
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    result ? JSON.stringify(result, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
        });
    }
    /**
     * SUBROOTS V10
     */
    if (subroots && subroots.length) {
        sql = `delete from pov_v10_feed_subroots where rootSlug='${slug}'`;
        result = await query(
            `delete from pov_v10_feed_subroots where rootSlug=?`,
            [slug]
        );
        await dbLog({
            show: false,
            type: "SQL",
            body: `{server:${dbServerName},sql:${sql}, res:${
                result ? JSON.stringify(result, null, 4) : "null"
            }}`,
            threadid,
            sessionid,
            username,
        });
        subroots.forEach(async sr => {
            let { slug: subSlug, subroot } = sr;
            l("rss:", rss, active);
            sql = `INSERT into pov_v10_feed_subroots(slug,subroot,rootSlug) VALUES ('${subSlug}','${subroot}',${slug})`;
            l(sql);
            result = await query(
                `INSERT into pov_v10_feed_subroots (slug,subroot,rootSlug) VALUES (?,?,?)`,
                [subSlug, subroot, slug]
            );
            await dbLog({
                show: false,
                type: "SQL",
                body: `{server:${dbServerName},sql:${sql}, res:${
                    result ? JSON.stringify(result, null, 4) : "null"
                }}`,
                threadid,
                sessionid,
                username,
            });
        });
    }
    l("END SAVE");
    return {
        success: true,
        category_xid,
    };
};
const validateFeedSlug = async ({
    input,
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    l("input:", input);
    let sql, result;
    let { slug } = input;
    l("validateFeedSlugg", JSON.stringify({ input, slug }));
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `SELECT tag from pov_v10_defined_tags where metatag='publication' and tag='${slug}'`;
    rows = await query(
        `SELECT tag from pov_v10_defined_tags where metatag='publication' and tag=?`,
        [slug]
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });

    return { success: rows && rows.length ? false : true };
};
const fetchMigrationRules = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let sql, result;
    l("fetchTags");
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `select c.shortname,f.handler from pov_channel_feeds f, pov_categories c where c.xid=f.category_xid`;
    rows = await query(
        `select c.shortname,f.handler from pov_channel_feeds f, pov_categories c where c.xid=f.category_xid`
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    l("fetchTags2");
    return rows;
};
const logCrawl = async ({
    qwiket,
    name,
    action,
    rule,
    log_description,
    silo,
    threadid,
    sessionid,
    username,
    dbServerName,
}) => {
    let {
        slug,
        description,
        title,
        body,
        author,
        site_name,
        published_time,
        shared_time,
        image,
        category_xid,
        alt_categories,
        url,
    } = qwiket;
    const micros = microtime();
    if (!category_xid) category_xid = 0;
    alt_categories = ds(alt_categories);
    published_time = published_time || 0;
    body = ds(body);
    author = ds(author);
    description = ds(description);
    title = ds(title);
    shared_time = shared_time || 0;
    site_name = ds(site_name);
    slug = ds(slug);
    name = ds(name);
    url = ds(url);
    action = ds(action);
    rule = ds(rule);
    log_description = ds(log_description);
    let sql, result;

    let query = await dbGetQuery("povdb", threadid, dbServerName);
    sql = `INSERT into pov_crawl_log (threadid,title,description,author,site_name,published_time,shared_time,body,image,category_xid,alt_categories,micros,server,log_description,action,rule,url,silo,log_threadid) 
    VALUES('${slug}','${title}','${description}','${author}','${site_name}',${published_time},${shared_time},'${body}','${image}',${category_xid},'${alt_categories}',${micros},'${name}','${log_description}','${action}','${rule}','${url}','${silo}','${threadid}'}`;
    result = await query(
        `INSERT into pov_crawl_log (threadid,title,description,author,site_name,published_time,shared_time,body,image,category_xid,alt_categories,micros,server,log_description,action,rule,url,silo,log_threadid) 
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            slug,
            title,
            description,
            author,
            site_name,
            published_time,
            shared_time,
            "" /*body*/,
            image,
            category_xid,
            alt_categories,
            micros,
            name,
            log_description,
            action,
            rule,
            url,
            silo,
            threadid,
        ]
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            result ? JSON.stringify(result, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
};
export default {
    fetchTags,
    fetchFeed,
    saveFeed,
    validateFeedSlug,
    fetchSubroots,
    fetchRoots,
    fetchLegacyRoots,
    fetchActiveFeeds,
    fetchMigrationRules,
    logCrawl,
};
