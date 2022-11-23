import { l, chalk, microtime, allowLog } from "../common.js";
import feedActions from "../actions/feedActions.js";
const { postUrl } = feedActions;
function func({
    $,
    item,
    resolve,
    reject,
    log,
    fetch,
    isEmpty,
    jsStringEscape,
    pageUrl,
    args,
}) {
    try {
        //========================"
        l("===<>",item)
        if (item.title && item.title.indexOf("The Times and The Sunday Times")>=0)
            return reject(item);
        if (item.image.indexOf("dual-masthead-placeholder-16x9.png") >= 0)
            return reject(item);
        item.url = $('meta[property="og:url"]').attr("content");
        item.author = $(".Byline-name").text();
        item.site_name = "The Times";
        let t = $(".Dateline").text() + "BDT";
        l("raw time " + t);
        /*
        let w = t ? t.split(",") : ["", ""];
        let w1 = w[1].split("pm");
        let s = w[0] + " " + w1[0] + ":00 GMT";
        log(s);
        let p = (Date.parse(s) / 1000) | 0;
        log("published_time " + p);
        item.published_time = p;
        */

        let s = $('script[type="application/ld+json"]').first().text();
        l(chalk.green("script:" + s));
        if (s) {
            let j = JSON.parse(s);
            l(chalk.yellow("======>>j:" + JSON.stringify(j)));
            let date = j.datePublished;
            log("date=" + date);
            let jsDate = (Date.parse(date) / 1000) | 0;
            item.published_time = jsDate;
            log("pubdate=" + item.published_time);
        }
        l("$$$")
        let b = $("article");
        item.body = b.html();
        resolve(item);
       
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
