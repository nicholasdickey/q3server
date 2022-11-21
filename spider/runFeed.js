// ./reindex.js
//import("dotenv").config();
//require = require("esm")(module /*, options*/ )
import { l, chalk, microtime, allowLog } from "./common.js"

import rules from "./rules.js"

//node script to be run from the terminal or pm2

/*
    Create Redisearch Indexes and repolulate them from the DB
     await redis.ft_add({
                index: 'brands', slug: brandSlug, name: brand.name,
                description: brand.description,
                image: brand.image, url: brand.url
            })

*/
const args = process.argv.slice(2)
const feedSlug = args[0]
const url = args[1]
const rule = args[2]
const sessionid = "reindex-ql-session"
const username = "reindex"
const threadid = Math.floor(Math.random() * 10000)
const notor = +process.env.NOTOR
async function runFeed() {
    l(
        "inside runFeed:",
        JSON.stringify({ feedSlug, pageUrl: url, rule, notor })
    )
    await rules({ pageUrl: url, rule, notor })
    process.exit()
}
allowLog()
l("starting runFeed script")
runFeed()
