// ./redis.js
import { l, chalk, js } from "./common.js";
import Redis from 'ioredis';
//import redisearch from "redis-redisearch";
//setTimeout(()=>redisearch(redis),100);
import { dbLog } from "./db.js";
//const client = redisearch.createClient();

const redisServer = process.env.REDIS_HOST_PRIMARY;
const redisPort = process.env.REDIS_PORT_PRIMARY;
const redisNodes = process.env.REDIS_NODES;
/*const rn2 = {
    rootNodes: [
        {
            name: 'qwiket',
           url:'redis://192.168.1.16'
        }
    ]
}*/
/*const rn2 = {
    rootNodes: [
        {
            name: 'qwiket',
            url: 'redis://192.168.1.16'
        }
    ]
}*/
const ioredisClusterNodes = [
    'redis://192.168.1.16:6379',
    'redis://192.168.1.22:6379',
    'redis://192.168.1.30:6379',
    'redis://192.168.1.31:6379'
]

l(chalk.green({ redisServer }));

/**
 * 
 * server, port - single redis server
 * nodes - cluster, comma separated list of host:port
 * 
 * if missing, overriden by env defaults, cluster has priority
 * Each client is cached based on connection string
 * 
 *  
 */
const getRedisClient = async ({ server, port, nodes, x }) => {
 //   l('getRedisClient', port, server)
    // setTimeout(()=>redisearch(redis),100);
    //redisearch(redis);
    if (!x)
        x = false;
    nodes = nodes || redisNodes;
    let clusterConnectionStrings = nodes ? nodes.split(',') : [];
    // l(chalk.green.bold("CLUSTER CONNECT", js(clusterConnectionStrings)));
    /*let rootNodes = [];
    for (let i = 0; i < clusterConnectionStrings.length; i++) {
        rootNodes.push({ url: `redis://${clusterConnectionStrings[i]}` });
    }*/
    //  l(chalk.green.bold("rootNodes:", js(rootNodes)))
    server = server || redisServer;
    port = port || redisPort;
  //  l('port,server', port, server)
    // let index = nodes?nodes:`${server}-${port}`;
    let client;
    /* if (clients.has(index)) {
         // l("found existin client", index, Array.from(clients.keys()));
         let c = clients.get(index);
         if (remove) {
            //  l("before remove redis client", index, Array.from(clients.keys()));
             clients.delete(index);
             // l("after remove redis client", index, Array.from(clients.keys()));
         }
        //  l("return existing connection");
         return c;
     }*/
    /* l(
         chalk.green(
             "creating redisClient:",
             JSON.stringify({ clients: clients.keys(), index, port, server })
         )
     );*/
    function retryStrategy(times) {
        const delay = Math.max(
            times * 100,
            10
        );

        l(chalk.red(`retry strategy: try to reconnect ${delay} ms from now`));

        return delay;
    }

    if (nodes && !x) {
        //  l(chalk.green.bold("createCluster", js({ rootNodes })))
        // l(chalk.yellow.bold("rn2:", js(rn2)))
        /*rootNodes.forEach(r => l(
            " node: ", r.url
        ))*/
        // client = redis.createCluster({rootNodes});
        //--client = redis.createCluster(rn2);
       // l("call new Cluster", ioredisClusterNodes)
        client = new Redis.Cluster(ioredisClusterNodes, {
            retryDelayOnFailover: 100,
            // clusterRetryStrategy:retryStrategy,
            enableAutoPipelining: true,
            slotsRefreshTimeout: 100000,
            //maxRedirections:64,
            /* clusterRetryStrategy:{
                 times:100
             }*/
        })
        //console.log(chalk.blue("typeof client", typeof client))
        // l("after createCluster")
        // clients.set(index,cluster);

    }
    else {
        l(chalk.yellow.bold("X REDIS, ", port, server))
        client = new Redis(port, server) //redis.createClient(port, server);
    }
    client.on("error", function (error) {
        console.error("REDIS ERROR", error);
    });
    client.on("connect", function () {
        // console.error("REDIS CONNECTED",);
    });
    client.on('reconnecting', () =>
        l('client connection lost, attempting to reconnect')
    );
    //l("connecting")
    try {
        //await client.connect();
    }
    catch (x) {
        console.log(chalk.red.bold(x))
    }
   // l("after connect")
    return client;
};
const resultToObject = result => {
    if (!result) return [];
    let numObjects = result[0];
    let results = [];
    // l(111, numObjects)
    for (var i = 0; i < numObjects; i++) {
        //  l(112, i)
        let slug = result[1 + 2 * i];
        if (!slug) break;
        let fields = result[2 + 2 * i];
        // l(113, fields)
        let object = {};
        for (var j = 0; j < fields.length; j++) {
            let name = fields[j];
            let value = fields[++j];
            object[name] = value;
        }
        results.push(object);
    }
    return results;
};
const resultInfoToObject = result => {
    if (!result) return [];
    let numObjects = result.length;
    let results = {};
    // l(111, numObjects)
    for (var i = 0; i < numObjects; i++) {
        //  l(112, i)
        let name = result[i];

        let value = result[++i];

        results[name] = value;
    }
    return results;
};

export { getRedisClient, resultToObject, resultInfoToObject };
