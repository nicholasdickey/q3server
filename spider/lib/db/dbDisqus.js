//require("dotenv").config();
import { l, chalk, microtime, js, ds } from "../common.js"
import { dbGetQuery, dbLog } from "../db.js"
const getSpamFilters = async ({
    sessionid,
    threadid,
    username,
    dbServerName,
}) => {
    //l(chalk.green("getSpamFilters",dbServerName))
    let povdb = await dbGetQuery("povdb", threadid, dbServerName)
    let rows = await povdb(`SELECT * from pov_spam_filters `)
   // console.log("SPAM FILTERS",rows,dbServerName)
    return rows
}
const deletePost = async ({ input, sessionid, threadid, username }) => {
    let { id, servers } = input
    let result
    if (!servers || servers.length == 0) return
    for (var si = 0; si < servers.length; si++) {
        let dbServerName = servers[si]
        let povdb = await dbGetQuery("povdb", threadid, dbServerName)
        let hubdb = await dbGetQuery("hub1db3", threadid, dbServerName)
        // sql = `SELECT id from qwp_posts where id=${id}`;
        let rows = await hubdb(`SELECT id from qwp_posts where id=?`, [id])
        if (rows && rows.length > 0) {
            result = await hubdb(
                `UPDATE qwp_posts set status=3, state='deleted' where id=?`,
                [id]
            )
        }
        l("Updated qwp_posts", JSON.stringify({ id, result }))
        rows = await povdb(`SELECT id from pov_channel_posts where id=?`, [id])
        if (rows && rows.length > 0) {
            result = await povdb(
                `UPDATE pov_channel_posts set status=3, state='deleted' where id=?`,
                [id]
            )
            l("Updated pov_channel_posts", JSON.stringify({ id, result }))
        }
    }
}
const getKeys = async ({
    sessionid,
    threadid,
    username,
    dbServerName,
    env,
}) => {
    let undb = await dbGetQuery("un1db3", threadid, dbServerName)

    let rows = await undb(
        `SELECT distinct t.auth_token,t.refresh_token,t.refresh_date, a.secret_key, a.public_key,a.xid as appid from qwun_disqus_apps a
            INNER join qwun_userapp_tokens t ON t.appid=a.xid
            where a.role=2 AND a.env=? AND t.auth_token IS NOT NULL AND t.identity=? and t.refresh_date>NOW() ORDER BY appid`,
        [env, "1c827afe69157411c85c8ac4e20d9091"]
    )
    if (!rows || rows.length == 0) return false
    let rl = rows.length
    let r = Math.floor(Math.random() * Math.floor(rl - 1))
    return rows[r]
}
export default { deletePost, getKeys, getSpamFilters }
