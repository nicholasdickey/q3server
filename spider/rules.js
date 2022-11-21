import cheerio from "whacko"
//import dynamic from "next/dynamic.js"
import fetch from "fetch-everywhere"
import UserAgent from "user-agents"

import pkg from "socks-proxy-agent"
const { SocksProxyAgent } = pkg

import { l, chalk, microtime, allowLog, js } from "./common.js"
import { promises as fs } from "fs"
import jsStringEscape from "js-string-escape"
//import iconv from "iconv-lite"
import { dbLog } from "./db.js"
//import { promises } from "dns"
l("starting TOR", `socks5h://tor:9050`)
import { setCDN } from "./cdn.js"
import cloudscraper from "cloudscraper"
let agent = null // = new SocksProxyAgent(`socks5h://${process.env.HOST}:9050`)
//const notorAgent = new SocksProxyAgent(`socks5h://51.81.31.66:58371`);

//import iconv from 'iconv-lite'
//var Minilog=require('minilog');
//var entities=require("entities");
//var windows1251 = require('windows-1251');
//var ConsoleBackend=require("./node/redis.js");
function getLocation(url) {
    var m = url.match(/^http:\/\/[^/]+/)
    return m ? m[0] : null
}

let processRule = async ({
    redis,
    pageUrl,
    rule,
    silo,
    threadid,
    sessionid,
    username,
    rss,
    tags,
    notor,
}) => {
    if (!agent) {
        agent = new SocksProxyAgent(`socks5h://tor:9050`)

    }
    if(!rule||rule=="undefined")
     rule="ld"
    let log = async function () {
        var args = [...arguments]
        args = args.map((p) => {
            if (typeof p === "object" && p !== null) return JSON.stringify(p)
            else return p
        })
        var s = args.join(" ")
        let now = new Date()
        // status.push(now.toUTCString() + ":" + s);
        // redis.lpush(statusQ, now.toUTCString() + ":" + s);
        if (process.env.OUTPUTFILE) l("log:", s)
        await dbLog({
            show: false,
            type: "RULE",
            body: s,
            threadid,
            sessionid,
            username,
        })
    }

    if (!tags) tags = [rule]
    else tags.push(rule)
    let purl = new URL(pageUrl)
    let host = purl.host
    l("process", pageUrl, rule, host, threadid)
    //let response = await fetch(pageUrl);

    const userAgent = new UserAgent()
    const ua = userAgent.toString()
    l(chalk.green("ua:", ua))
    let response
    //if (pageUrl.indexOf("gateway") >= 0) notor = 1;
    //else tor = 1;
    /* if (!notor) {
         l("TOR")
         response = await fetch(pageUrl, {
             agent,
             headers: { "User-Agent": ua },
         })
         // l("AFTER FETCH");
     } else {
         l("NO TOR")
         response = await fetch(pageUrl, {
             // agent: notorAgent,
             headers: { "User-Agent": ua },
         })
     }*/
    function doRequest(url) {
        return new Promise(function (resolve, reject) {
            cloudscraper.get(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }
    let body;
    if (!notor) {
        l("TORR")
        response = await fetch(pageUrl, {
            agent,
            headers: { "User-Agent": ua },
        })
        body = await response.text();
       // l("AFTER FETCH",body);
    } else {
        l("NO TORRR")
        response = await doRequest(pageUrl, {
            // agent: notorAgent,
            headers: { "User-Agent": ua },
        })
        l(chalk.blue.bold("cloudscraper response"))
        body = response;
    }


    // let body = await response.text()
    let $ = cheerio.load(body, {
        decodeEntities: true,
    })
    //l(chalk.yellow(js({ body })));
    /* await page.goto(pageUrl);
    await page.waitForSelector("body");
    await page.addScriptTag({
        url: "https://code.jquery.com/jquery-3.2.1.min.js",
    }); */
    l("rule:", rule)
    const mod = await import(`./feeds/${rule}.js`)
    const func = mod.default
    //let func = require(`./feeds/${rule}`);
    // l("func:", func);
    // let func = await import(`./feeds/${rule}`));
    console.log("imported func", func)
    let result
    try {
        // result = await page.evaluate(
        //   async ({ l, chalk, func, fs, ttt }) => {
        let returnData = {}
        // returnData.l1 = `CHALK: ${ttt}, ${chalk}`;
        let item = {}
        let childRefs = new Set()
        $("a").each(function (i) {
            let href = $(this).attr("href")

          //  l(chalk.magenta(href));
            if (!href || href.indexOf('#') || href.indexOf('javascript') >= 0|| href.indexOf('facebook') >= 0)
                return;
          //  l(chalk.cyan(href));
            try {
                let url = new URL(href, `http://${host}`)
                let ihost = url.host
                if (ihost == host) {
                    if (url.href) {
                        // l("adding", url.href);
                        childRefs.add(url.href)
                    }
                }
            }
            catch (x) {
                l(chalk.red("handled", x))
            }
            /*  l(
                chalk.yellow(
                    JSON.stringify({ href: url.href, ihost, host }, null, 4)
                )
            );*/
        })
        childRefs = [...childRefs]
        // l(chalk.cyan(JSON.stringify(childRefs)));
        returnData.childRefs = childRefs
        //-------------------------------------------------------------
        let title = $("meta[property='og:title']").attr("content")
        //console.log(title);
        if (!title) title = $("meta[name='og:title']").attr("content")
        if (!title) title = $("meta[name='title']").attr("content")
        if (!title) title = $("meta[property='twitter:title']").attr("content")
        if (!title) title = $("meta[name='sailthru.title']").attr("content")
        if (!title) title = $("title").text()

        if (!title) title = ""
        l("title:", title)
        if (title.includes("Access Denied") || title.includes("Cloudflare") || title.includes("Bad gateway") || title.includes("403 Forbidden") || title.includes("Page not found"))
            return;

        //---
        let description = $("meta[property='og:description']").attr("content")
        if (!description)
            description = $("meta[name='og:description']").attr("content")
        //  console.log(description);
        if (!description)
            description = $("meta[name='description']").attr("content")
        if (!description)
            description = $("meta[property='twitter:description']").attr(
                "content"
            )
        if (!description)
            description = $("meta[name='twitter:description']").attr("content")
        if (!description) description = ""

        //---
        let image = $("meta[property='og:image']").attr("content")
        if (!image) image = $("meta[name='og:image']").attr("content")
        if (!image) image = $("meta[property='og:image:url']").attr("content")

        if (!image) image = $("meta[name='twitter:image:src']").attr("content")

        if (!image) image = $("meta[name='twitter:image']").attr("content")
        if (!image) image = ""
        if (!item.image && image) item.image = image
        //if(image)
        //image=this.normalizeUrl(image);
        //---
        let locale = $("meta[property='og:locale']").attr("content")
        if (!locale) locale = $("meta[name='og:locale']").attr("content")
        if (!locale) locale = ""

        //---
        let site_name = $("meta[property='og:site_name']").attr("content")
        if (!site_name)
            site_name = $("meta[name='og:site_name']").attr("content")
        if (!site_name) site_name = host
        //---
        let author = $("meta[name='author']").attr("content")

        if (!author) author = $("meta[name='sailthru.author']").attr("content")
        if (!author) author = ""

        //---
        let url = $("meta[property='og:url']").attr("content")
        if (!url) url = $("meta[name='og:url']").attr("content")
        if (!url) url = $(`link[rel="canonical"]`).attr("href")

        if (!url) url = item.url

        if (!url) url = pageUrl
        console.log("rule processing ", url)
        // ---
        let lang = ""
        if (!locale) {
            lang = $("meta[name='language']").attr("content")
            if (!lang)
                lang = $("meta[http-equiv='Content-Language']").attr("content")
            if (lang) locale = lang + "_" + lang
            else locale = "en_US"
        }
        //---

        let date = $("meta[property='og:date']").attr("content")
        if (!date) {
            date = $("meta[property='article:published_time']").attr("content")
        }
        if (!date) {
            date = $("meta[property='og:pubdate']").attr("content")
        }
        if (!date) {
            date = $("meta[name='og:date']").attr("content")
        }
        if (!date) {
            date = $("meta[itemprop='datePublished']").attr("content")
        }
        //  l(chalk.yellow("datePublished"), date);
        if (!date) {
            date = $("meta[name='sailthru.date']").attr("content") + " EDT"
        }
        if (!date) {
            date = $("meta[name='dcterms.date']").attr("content")
        }
        if (!date) {
            date = $("meta[name='dcterms.created']").attr("content")
        }
        if (!date) {
            date = $("meta[name='date']").attr("content")
        }

        if (!date) {
            date = $("meta[name='og:pubdate']").attr("content")
        }
        if (!date) {
            date = $("meta[name='publish_date']").attr("content")
        }
        //article:published_time

        if (!date) {
            date = $("meta[itemprop='datePublished']").attr("content")
        }
        if (!date) {
            date = $("time").attr("datetime")
        }

        let published_time = 0
        if (date) {
            published_time = (Date.parse(date) / 1000) | 0
        }

        // l(chalk.yellow("converted pt=", published_time));
        //-----------------------------------------------------------------------

        let p = {
            title,
            description,
            site_name,
            url: url,
            locale,
            image,
            author,
            rss,
            identity: item.identity,
            published_time,
        }
        // log(`INSIDE RULE, rule=${rule}. pageUrl=${pageUrl} p=, ${js(p)}`);
        // l("INSIDE RULE");
        var isEmpty = function (str) {
            return !str || 0 === str.length
        }
        var search = function (spec, ar) {
            if (!Array.isArray(ar)) ar = [ar]
            let ret = false
            ar.forEach((i) => {
                let s = spec + ":contains('" + i + "')"
                //console.log(s){}
                if ($(s).length) {
                    l("search hit:" + s)
                    ret = true
                }
            })
            l("search returning ret=" + ret)
            return ret
        }

        /* let frule = '"use strict";\ntry{' + rule + '\n}catch(x_x_x){\nlog(stackError(x_x_x.stack));console.error(stackError(x_x_x.stack));\nreject(item)\n}'
             let map = null;
             try {
                 map = new Function('resolve', 'reject', '$', 'item', 'log', 'console', 'stackError', 'fetch', 'isEmpty', 'whacko', 'iconv', 'jsStringEscape', 'search', frule);
             }
             catch (x) {
                 console.log("caught map x=", x);
                 // outReject({});
                 return;
         
             }
             */
        l(chalk.yellow("calling rule", rule))

        let pr = new Promise((resolve, reject) => {
            //  l("inside Promise", rule, js(p));
            try {
                func({
                    resolve,
                    reject,
                    $,
                    item: p,
                    log,
                    chalk,
                    fetch,
                    isEmpty,
                    jsStringEscape,
                    pageUrl,
                    args: { silo, threadid, sessionid, username, tags },
                })
                l("after func")
            } catch (x) {
                l(chalk.red.bold("EXCEPTION WITHIN FUNC(x)", x))
                reject(p)
            } finally {
                l("finally", rule)
            }
        })
        let outputItem
        try {
            console.log("CALLING EVAL", rule)
            const promise1 = new Promise((resolve, reject) => {
                setTimeout(resolve, 15000, {})
            })
            try {
                outputItem = await pr //Promise.race(pr, promise1);
            } catch (cc) {
                l(chalk.magenta.bold("Promise CATCHL", js(cc)))
            }
            // console.log("outputItem", outputItem);
            //l("body", outputItem.body);

            l("after eval", rule)
            if (outputItem) {
                if (outputItem.locale == 'cdn') {
                    l(chalk.yellow.bold("CDN:", outputItem.image))
                    let result = await setCDN({
                        image: outputItem.image,
                        logContext: {
                            sessionid,
                            threadid,
                            username,
                        },
                    })
                    l(chalk.yellow("image:", result.image))
                    if (result.image) {
                        outputItem.image = result.image;
                        outputItem.image_src = result.image_src;
                    }
                }
                let html = `<h1>${outputItem.title}</h1><h4>${outputItem.site_name
                    }</h4><h4>By: ${outputItem.author}</h4><h5>${outputItem.description
                    }</h5>
    <img style="max-width:300px" src="${outputItem.image}"/>
    <h5>${new Date(outputItem.published_time * 1000)}</h5>
    <div>${outputItem.body}</div>`
            }
            if (process.env.OUTPUTFILE && outputItem && outputItem.body)
                await fs.writeFile("./rule.html", outputItem.body)
            // let's close the browser
            //  await browser.close();
            if (outputItem && !outputItem.updated_time)
                outputItem.updated_time = outputItem.published_time
            //  await log(js(outputItem));

            if (
                outputItem &&
                outputItem.title &&
                outputItem.title.trim().indexOf("503 Service") == 0
            ) {
                await log("REJECT1 " + title)
                return returnData
            }
            if (
                outputItem &&
                outputItem.url &&
                outputItem.url.trim().indexOf("qwiket.com") >= 0
            ) {
                await log("REJECT2 " + outputItem.url)
                return returnData
            }
            l("rules end")
            returnData.item = outputItem
            return returnData
        } catch (x) {
            l(chalk.grey.bold("!!!REJECT", x))
            l(chalk.red.bold(JSON.stringify(x)))
            l(chalk.red.bold(js(outputItem)))

            await log("REJECT " + JSON.stringify(x))
            return returnData
        }
        /* },
            {
                ttt: 444,
                l,
                chalk,
                func,
                fs,
            }*/
        // );
    } catch (x) {
        l(chalk.red.bold("CATCH 13", x))
    }
    l(chalk.green("result:", JSON.stringify(result)))
}

export default processRule
