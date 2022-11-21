//require("dotenv").config();
//require = require("esm")(module /*, options*/);
import { redis } from "./redis.js"
import { dbEnd } from "./db.js"
import dbDisqus from "./db/dbDisqus.js"
import { l, chalk, microtime, allowLog, js, sleep } from "./common.js"
//import Disqus from "disqus";
//import { DisqusCore } from "disqus-server-client-core"
import fetch from "node-fetch"

const disqusDel = "posts/remove"
const args = process.argv.slice(2)

const username = args[0]
var redisHost = "redis" //args[1];
const redisPort = 6379 //args[2];
const apiUrl = "http://dr.qwiket.com:8088/api?task="
//const forum = args[3];
const noop = args[1]
const sessionid = "deleteComments-ql-session"

const threadid = Math.floor(Math.random() * 10000)
let logContext = { sessionid, threadid, username: "master" }
async function deleteComments() {
    try {
        allowLog();
        while (true) {
            let forums = ["usconservative", "pointofviewworld"]
            l("FORUM LOOP--")
            for (var jj = 0; jj < 2; jj++) {
                let forum = forums[jj]
                let hosts = ["dr.qwiket.com"]
                l("ITERATION LOOP")
                for (var iii = 0; iii < 1; iii++) {
                    redisHost = hosts[iii]
                    l("iteration ", redisHost)
                    l(
                        "inside deleteComments:",
                        JSON.stringify({
                            username,
                            redisHost,
                            redisPort,
                            forum,
                        })
                    )
                    let key = `lpxids-${forum}`
                    let start = 0
                    let stop = 1000

                    let posts = await redis.zrevrange({
                        key,
                        start,
                        stop,
                        withscores: false,
                        server: redisHost,
                        port: redisPort,
                        logContext,
                    })
                    //
                    //  l('after revrange', { posts })
                    let filteredPosts = []
                    for (var i = 0; i < posts.length; i++) {
                        let k = `pjson-${forum}-${posts[i]}`
                        //  l({ k });
                        let pjson = JSON.parse(
                            await redis.get({
                                key: k,
                                server: redisHost,
                                port: redisPort,
                                logContext,
                            })
                        )
                        if (pjson) {
                            pjson.xid = posts[i]
                            pjson.k = k
                        } else continue
                        let author_username = pjson ? pjson.author_name : ""
                        let body = pjson ? pjson.body : ""
                        let lowerCaseBody = body.toLowerCase()
                        // let id = pjson ? pjson.id : 0;
                        // l(js(pjson))
                        //l('getting pjson', JSON.stringify({ key, author_username: pjson.author_name, id: pjson.id }));
                        if (author_username == username) {
                            l(`match:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        const filters = await dbDisqus.getSpamFilters({
                            sessionid,
                            threadid,
                            username,
                            env: redisHost == "prod.qwiket.com" ? "prod" : "dr",
                            dbServerName:
                                redisHost == "prod.qwiket.com"
                                    ? process.env.DB_HOST_SILO5_PRIMARY
                                    : process.env.DB_HOST_SILO5_SECONDARY,
                        })
                        for (let i = 0; i < filters.length; i++) {
                            const filter = filters[i].filter
                            // if(filter.includes("18"))
                            // l(chalk.yellow.bold("process filter:", filter))
                            if (filter == "bit.ly") {
                                //  l(chalk.yellow.bold(filter))
                                if (body.toLowerCase().includes("bit.ly"))
                                    l(chalk.green.bold(js(body)))
                            }
                            if (body.toLowerCase().includes(filter)) {
                                l(chalk.magenta("matched"))
                                l(chalk.green.bold(filter, js({ author_username, k })))
                                filteredPosts.push(pjson)
                            }
                        }
                        if ((body.includes("t.co") || body.includes("twitter.com")) && body.includes("</s>")) {
                            l(`twitter porn:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("$193 per h")) {
                            l(`match 193 per h:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("$105 hourly")) {
                            l(`match $105 hourly:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("$88")) {
                            l(`$88:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("80 US dollars")) {
                            l(`$80:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("anoni.sh")) {
                            l(`.sh`, { author_username, k })
                            filteredPosts.push(pjson)
                        }

                        if (body.includes(".Com")) {
                            l(`match .Com:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("0rz.tw")) {
                            l(`0rz.tw:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes(".coM")) {
                            l(`match .coM:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes(".Net")) {
                            l(`match .Net:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("bit.ly")) {
                            l(`bit.ly:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("f.ls")) {
                            l(`f.ls:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("urlgeni.us")) {
                            l(`urlgeni.us:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("t1p.de")) {
                            l(`t1p.de:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("link.gy")) {
                            l(`link.gy:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("disqus-blog.com")) {
                            l(`disqus-blog.com:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("urlgeni.us")) {
                            l(`urlgeni.us:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes(".disqus.com")) {
                            l(`match .disqus.com:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("kurzelinks.de")) {
                            l(`match kurzelinks.de:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("f.ls")) {
                            l(`f.ls:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("f.Ls")) {
                            l(`f.Ls:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("url.com")) {
                            l(`url.com:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("google.com.")) {
                            l(`match google.com.:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }

                        if (
                            body.includes("google.") &&
                            !body.includes("google.com")
                        ) {
                            l(`match google.xx:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }

                        if (
                            body.includes("thank you very much") &&
                            body.length < 32
                        ) {
                            l(`thank you very much:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (
                            lowerCaseBody.includes("www") &&
                            !body.includes("www")
                        ) {
                            l(`mixed case www`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (
                            lowerCaseBody.includes("http") &&
                            !body.includes("http")
                        ) {
                            l(`mixed case http`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (
                            lowerCaseBody.includes("google.") &&
                            !body.includes("google")
                        ) {
                            l(`mixed case google`, { author_username, k })
                            filteredPosts.push(pjson)
                        }

                        if (
                            body.includes("thank you a lot") &&
                            body.length < 32
                        ) {
                            l(`thank you a lot:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (
                            body.includes("thank you so much") &&
                            body.length < 32
                        ) {
                            l(`thank you so much:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (
                            body.includes("Ok. Thank you") &&
                            body.length < 32
                        ) {
                            l(`Ok. Thank you:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (
                            body.includes("thank you for the invitation") &&
                            body.length < 48
                        ) {
                            l(`thank you for the invitation:`, {
                                author_username,
                                k,
                            })
                            filteredPosts.push(pjson)
                        }
                        if (
                            body.includes("Yes! good site") &&
                            body.length < 32
                        ) {
                            l(`Yes! good site:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }

                        if (
                            body.includes("thank you my friend") &&
                            body.length < 32
                        ) {
                            l(` thank you my friend:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }

                        if (body.includes("I recommend!") && body.length < 24) {
                            l(`I recommend!:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        /*  if (body.includes("nice") && body.length < 12) {
                            l(`nice:`, { author_username, k });
                            filteredPosts.push(pjson);
                        }
                        if (body.includes("thanks") && body.length < 32) {
                            l(`thanks:`, { author_username, k });
                            filteredPosts.push(pjson);
                        }
                        if (body.includes("thank you") && body.length < 32) {
                            l(`thank you:`, { author_username, k, post: posts[i] });
                            filteredPosts.push(pjson);
                        }*/
                        if (body.includes("t.co") && body.length < 256) {
                            l(`t.co`, {
                                author_username,
                                k,
                                post: posts[i],
                            })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("I advice!") && body.length < 32) {
                            l(`I advice!:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes(".De")) {
                            l(`.De:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes(".Se")) {
                            l(`.Se:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes(".su")) {
                            l(`.su:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                        if (body.includes("lnkd.in")) {
                            l(`lnkd.in:`, { author_username, k })
                            filteredPosts.push(pjson)
                        }
                    }
                    for (var i = 0; i < filteredPosts.length; i++) {
                        let pjson = filteredPosts[i]
                        let value = pjson.xid
                        l(`removing ${pjson.xid}`)

                        if (noop !=1) {
                            l("REMOVE KEY")
                            await redis.zrem({
                                key,
                                value: pjson.xid,
                                server: redisHost,
                                port: redisPort,
                                logContext,
                            })
                        }
                        let k = pjson.k
                        l(`removing pjson:`, { k })
                        if (noop !=1) {
                            l("REMOVE PJSON", k, redisHost, redisPort)
                            await redis.del({
                                key: k,
                                server: redisHost,
                                port: redisPort,
                                logContext,
                            })
                        }
                        let qid = pjson.id
                        l(`removing DISQUS:`, {
                            qid,
                            dbServer:
                                redisHost == "prod.qwiket.com"
                                    ? process.env.DB_HOST_SILO5_PRIMARY
                                    : process.env.DB_HOST_SILO5_SECONDARY,
                        })
                        let delParams = { post: qid }
                        let disqusReturn
                        l("calling getKeys")
                        let keys = await dbDisqus.getKeys({
                            sessionid,
                            threadid,
                            username,
                            env: redisHost == "prod.qwiket.com" ? "prod" : "dr",
                            dbServerName:
                                redisHost == "prod.qwiket.com"
                                    ? process.env.DB_HOST_SILO5_PRIMARY
                                    : process.env.DB_HOST_SILO5_SECONDARY,
                        })
                        l("GOT KEYS", chalk.green(JSON.stringify(keys)))
                        let client, disqus
                        try {
                            /*  client = new Disqus({
                                access_token: keys["auth_token"],
                                api_key: keys["public_key"],
                                api_secret: keys["secret_key"],
                            });*/
                            const config = {
                                accessToken: keys["auth_token"],
                                apiKey: keys["public_key"],
                                apiSecret: keys["secret_key"],
                                disableCache: true,
                            }
                            l("got config:", js(config))
                            //  disqus = new DisqusCore(config);
                        } catch (x) {
                            client("DISQUS EXCEPTION: ", x)
                            continue
                        }
                        l("calling api", apiUrl + "disqusPost")
                        let body = `url=${disqusDel}&access_token=${keys["auth_token"]
                            }&secret_key=${keys["secret_key"]
                            }&par=${encodeURIComponent(`post=${qid}`)}`
                        try {
                            let response = await fetch(apiUrl + "disqusPost", {
                                method: "post",
                                credentials: "same-origin",
                                body,
                                headers: {
                                    "Content-type":
                                        "application/x-www-form-urlencoded",
                                },

                                /*  headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },*/
                            })
                            let r = await response.json()
                            l("API RESPONSE:", js(r)) //  l("got client:");
                            if (!r.success || r.results.code != 0) {
                                l(chalk.red.bold("STOPPING ON API ERROR"))
                                return
                            }
                        } catch (x) {
                            l(chalk.red.bold("EXCEPTION IN API", x))
                        }
                        /*  const r = await disqus.request("whitelists/add", {
                            user: "85248550",
                            forum: "usconservative",
                        });
                        const posts = r.response.map(post => ({
                            msg: post.msg,
                            by: post.author.name || post.author.username,
                            thread: post.thread,
                        }));
                        console.log(posts);*/

                        await dbDisqus.deletePost({
                            input: {
                                id: qid,
                                servers:
                                    redisHost == "prod.qwiket.com"
                                        ? [
                                            process.env.DB_HOST_PRIMARY,
                                            process.env.DB_HOST_SILO5_PRIMARY,
                                        ]
                                        : [
                                            process.env.DB_HOST_SECONDARY,
                                            process.env
                                                .DB_HOST_SILO5_SECONDARY,
                                        ],
                            },
                            sessionid,
                            threadid,
                            username,
                        })
                    }
                }
            }
            await sleep(6)
        }
    } catch (x) {
        l(chalk.red.bold("EXCEPTION11", x, JSON.stringify(x, null, 4)))
    } finally {
        await dbEnd(threadid)
        process.exit()
    }
}
allowLog()
l("starting deleteComments script")
deleteComments()
