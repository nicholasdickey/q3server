// ./src/server.js
//import redis from "redis";
//import redisearch from "redis-redisearch";
//console.log(redis)
//redisearch(redis);
//import module from "module"
//import fs from "fs" //.promises;
/*module.Module._extensions[".js"] = function (module, filename) {
    const contents = fs.readFileSync(filename, "utf8")
    module._compile(fs.readFileSync(filename, "utf8"), filename)
}*/
//Simport fs from "fs"; //.promises;
//import express from "express"

//import cors from "cors"
//import http from "http"
//import next from "next"


import feedActions from "./lib/actions/feedActions.js"
import qwiketActions from "./lib/actions/qwiketActions.js"
import { dbEnd } from "./lib/db.js"
const {
    runFeedsAction,
    runDisqus,
    runOutputQueue,
    runPreMigrate,
    runLongMigrate,
    runIndexQwikets,
    runLongMigrateTable
} = feedActions
const {
    validateQwiketCache,
    validatePostsCache,
    validateCatsCache
} = qwiketActions;
import { l, chalk, allowLog, sleep, js } from "./lib/common.js"
//import { loadCDN } from "./cdn.mjs"
//import { init as apiServerInit, end as apiServerEnd } from "./api-server.mjs"
//import { redis } from "./redis.mjs"
import { exit } from "process"
import dbCdn from "./lib/db/dbCdn.js"
const  { migrateCatImages }=dbCdn;

const dev = process.env.NODE_ENV != "production"
//const redisServer = process.env.REDIS_HOST_PRIMARY
//const redisPort = process.env.REDIS_PORT_PRIMARY

//var sessionStore = new MySQLStore(options);
let threadid1 = Math.floor(Math.random() * 100000000)
process.on("unhandledRejection", (error, promise) => {
    console.log(
        " Oh Lord! We forgot to handle a promise rejection here: ",
        promise
    )
    console.log(" The error was: ", error)
})
if (process.env.CATIMAGES) {
    await migrateCatImages({
        sessionid: "server.js",
        threadid: `server.js-${threadid1}`,
        username: "server.js",
        dbServerName: "",
    })
    exit();
}
if (process.env.FEED) {
    allowLog()
    console.log("FEED")
    await runFeedsAction({
        silo: 5, //process.env.PRE_MIGRATE ? 5 : 3,
        feedName: process.env.FEED,
        sessionid: "server.js",
        threadid: `server.js-${threadid1}`,
        username: "server.js",
    })

    await runOutputQueue({
        sessionid: "server.js",
        threadid: "server.js1",
        username: "server.js",
    })
    dbEnd(`server.js-${threadid1}`)
    exit();

}
if (process.env.FEED2022) {
    allowLog()
    console.log("FEED2022")
    await runFeedsAction({
        silo: 5, //process.env.PRE_MIGRATE ? 5 : 3,
        feedName: process.env.FEED2022,
        sessionid: "server.js",
        threadid: `server.js-${threadid1}`,
        username: "server.js",
    })

    /* await runOutputQueue2022({
         sessionid: "server.js",
         threadid: "server.js1",
         username: "server.js",
     })*/
    dbEnd(`server.js-${threadid1}`);
    exit();

}
if (process.env.OUT2022) {
    allowLog()
    console.log("OUT2022")
    await runOutputQueue({
        sessionid: "server.js",
        threadid: dbEnd(`server.js1-${threadid1}`),
        username: "server.js",
    })
    dbEnd(`server.js1-${threadid1}`)
    exit();
}
if (process.env.AUTO_FEED) {
    allowLog()
    console.log("AUTO_FEED")
    runFeedsAction({
        silo: 5, //process.env.PRE_MIGRATE ? 5 : 3,
        sessionid: "server.js",
        threadid: `server.js-${threadid1}`,
        username: "server.js",
    })
    dbEnd(`server.js-${threadid1}`)
    runOutputQueue({
        sessionid: "server.js",
        threadid: `server.js2-${threadid1}`,
        username: "server.js",
    })
    dbEnd(`server.js2-${threadid1}`)
}
if (process.env.AUTO_FEED2022) {
    allowLog()
    console.log("AUTO_FEED2022");
    setTimeout(() => {
        exit();
    }, process.env.TIMEOUT);
    await runFeedsAction({
        silo: 5, //process.env.PRE_MIGRATE ? 5 : 3,
        sessionid: "server.js",
        threadid: `server.js-${threadid1}`,
        username: "server.js",
    })
    dbEnd(`server.js1-${threadid1}`);
    console.log("END AUTO_FEED2022")
    await sleep(2000)
    exit();

    /* runOutputQueue2022({
         sessionid: "server.js",
         threadid: "server.js1",
         username: "server.js",
     })*/
}
if (process.env.PRE_MIGRATE == 1) {
    allowLog()
    await runPreMigrate({
        //db only, two days
        sessionid: "server.js",
        threadid: "server.js11",
        username: "server.js",
    })
    await runIndexQwikets({
        //db+redisearch but for the last hour only.
        sessionid: "server.js",
        threadid: "server.js2",
        username: "server.js",
    })
    console.log("runDisqus ")
    runDisqus({
        sessionid: "server.js",
        threadid: "server.js3",
        username: "server.js",
    })
}
if (process.env.LONG_TABLE_POSTS == 1) {
    allowLog()
    await runLongMigrateTable({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        table: 'qwp_posts'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(1000)
    exit();
}
if (process.env.LONG_TABLE_POSTS_ARCHIVE == 1) {
    allowLog()
    await runLongMigrateTable({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        table: 'qwp_posts_archive'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(1000)
    exit();
}
if (process.env.LONG_TABLE_THREADS == 1) {
    allowLog()
    await runLongMigrateTable({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        table: 'qwp_threads'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(1000)
    exit();
}
if (process.env.LONG_TABLE_TOPICS == 1) {
    allowLog()
    await runLongMigrateTable({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        table: 'pov_topics'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(1000)
    exit();
}
if (process.env.LONG_TABLE_THREADS_MAP2 == 1) {
    allowLog()
    await runLongMigrateTable({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        table: 'pov_threads_map2'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(1000)
    exit();
}
if (process.env.LONG_TABLE_USERS == 1) {
    allowLog()
    await runLongMigrateTable({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        table: 'pov_users'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(1000)
    exit();
}
if (process.env.LONG_MIGRATE2022_51 == 1) {
    allowLog()
    await runLongMigrate({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        slugPrefix: '51'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(10000)
    exit();
}
if (process.env.LONG_MIGRATE2022_5 == 1) {
    allowLog()
    await runLongMigrate({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        slugPrefix: '5'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(12000)
    exit();
}
if (process.env.LONG_MIGRATE2022_3 == 1) {
    allowLog()
    await runLongMigrate({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        slugPrefix: '3'
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(30000)
    exit();
}
if (process.env.LONG_MIGRATE2022_ == 1) {
    allowLog()
    await runLongMigrate({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
        slugPrefix: ''
    })
    dbEnd(`server.js11-${threadid1}`)
    sleep(41000)
    exit();
}
if (process.env.PRE_MIGRATE2022 == 1) {
    allowLog()
    await runPreMigrate({
        //db only, two days
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
    })
    dbEnd(`server.js11-${threadid1}`)
    l("call runIndexQwikets")
    await runIndexQwikets({
        //db+redisearch but for the last hour only.
        sessionid: "server.js",
        threadid: `server.js12-${threadid1}`,
        username: "server.js",
    })
  
    
   console.log("runDisqus ")
   await runDisqus({
       sessionid: "server.js",
       threadid: "server.js3",
       username: "server.js",
   })
   dbEnd(`server.js12-${threadid1}`)
   exit(); 
}
if (process.env.CACHE_QWIKET == 1) {
    allowLog()
    await validateQwiketCache({
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
    })
    dbEnd(`server.js11-${threadid1}`)
    exit();
}

if (process.env.CACHE_POST) {
    allowLog()
    const forum=process.env.CACHE_POST;
    await validatePostsCache({
        forum,
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
    })
    dbEnd(`server.js11-${threadid1}`)
    exit();
}
if (process.env.CACHE_CATS) {
    allowLog()
    await validateCatsCache({
  
        sessionid: "server.js",
        threadid: `server.js11-${threadid1}`,
        username: "server.js",
    })
    dbEnd(`server.js11-${threadid1}`)
    exit();
}
