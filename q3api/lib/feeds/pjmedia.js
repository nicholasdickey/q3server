import { l, chalk, microtime, allowLog } from "../common.js";
import runFeedActions from "../actions/runFeedActions.js";
const { postUrl } = runFeedActions;
import { parse } from "date-fns";
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
        //v 002
        if (item.url.indexOf("pjmedia") < 0) return reject(item);
        item.site_name = "PJ Media";
        let date = $(`.date-formatted`).attr(`data-original-date`);
        log("date:", date);
        let parsedDate = parse(date, "M/d/y h:m:s a", new Date());
        log("parsedDate", parsedDate);
        let millis = Date.parse(parsedDate);
        let published_time = (millis / 1000) | 0;
        log("unix:", published_time);
        item.published_time = published_time;
        log("url=" + item.url);
        if (
            !item.description ||
            item.title.indexOf("HOT MIC") > 0 ||
            item.title.indexOf("Lice Blog") >= 0 ||
            item.url.indexOf("print=true") > 0
        ) {
            log("no description or hot mic, rejecting");
            reject(item);
            return;
        }

        var author = $(`.author a`).first().text();
        if (author.indexOf("By") >= 0) author = author.split("By ")[1];
        if (author.indexOf(",") >= 0) author = author.split(",")[0];
        log("author=" + author);
        item.author = author;
        item.published_time = published_time;
        if (
            item.title.indexOf("Live Blog") >= 0 ||
            item.title.indexOf("Live blog") >= 0
        ) {
            reject(item);
            return;
        }
        let b = $(".post-body");
        b.find(`img[src="${item.image}"]`).remove();
        b.find(`h4`).remove();
        b.find(`.social-bar`).remove();
        item.body = b.html();
        // .replace(/class\=\"(.*?)\"/g, "")
        // .replace(/\"/g, "")
        //  .replace(/<p >\&nbsp\;<\/p>/g, ``); //;//$('.pages').html().replace(/width\=\"([A-Za-z0-9 _]*)\"/g,'width="100%"').replace(/height\=\"([A-Za-z0-9 _]*)\"/g,'');
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
