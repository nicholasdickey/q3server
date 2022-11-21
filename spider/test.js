//import {checkSchema} from  "./db.js"
import dbFeed from "./db/dbFeed.js"
import {l,chalk,js} from "./common.js"
import { dbLog, dbEnd, dbFetchLogByThreadid } from "./db.js"
async function test(){
    const feed=await dbFeed.fetchFeed({
        input:{slug:"nro"},
        threadid:"test",
        sessionid:"test",
        username:"test",
        dbServerName:"167.99.225.235"
    })
    l(feed)

}
test();
