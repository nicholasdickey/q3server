import { l, chalk, microtime, allowLog } from "../common.js";
import runFeedActions from "../actions/runFeedActions.js";
const { postUrl } = runFeedActions;
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
        //newyorker
        //let published_time=$('meta[property="article:published_time"]').attr('content')
        //log("published_time picked:",published_time);
        //item.published_time=(Date.parse(published_time)/1000)|0
        let s = $('script[type="application/ld+json"]').text();

        log("script:" + s);
        let j = JSON.parse(s);
        log("j:" + JSON.stringify(j));
        let date = j.datePublished;
        log("date=" + date);
        let jsDate = (Date.parse(date) / 1000) | 0;
        item.published_time = jsDate;
        log("pubdate=" + item.published_time);
        if (!item.published_time) return reject(item);
        let l1 = item.url.indexOf("?mbid=rss");
        if (l1 >= 0) item.url = item.url.substring(0, l1);
        item.author = $(".author").first().text();
        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
