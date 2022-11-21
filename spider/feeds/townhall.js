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
        //v 0017
        if (item.title.indexOf("Townhall") >= 0) return reject(item);
        if (
            item.url &&
            (item.url.indexOf(`/tags/`) >= 0 ||
                /*item.url.indexOf(`vip`) >= 0 ||*/
                item.url.indexOf(`political-cartoons`) >= 0 ||
                item.url.indexOf(`liveblog`) >= 0)
        )
            return reject(item);
        if (isEmpty(item.image) || item.image.indexOf("http") === -1)
            item.image =
                "http://media.townhall.com/_townhall/resources/images/homepage/th_20years2.gif";
        item.url = $(`meta[property="og:url"]`).attr("content");
        if (
            item.url &&
            (item.url.indexOf(`/tags/`) ||
                item.url.indexOf(`vip`) ||
                item.url.indexOf(`political-cartoons`)) >= 0
        )
            return reject(item);
        var date = new Date();
        var minutes = date.getTimezoneOffset();
        //item.published_time+=minutes*60
        let d = $(`#article-meta`).text();
        // log(`d` + d);
        let meta = JSON.parse(d);
        let dateStr = meta.PublishedDate;
        // log(`dateStr:` + dateStr);
        let jsDate = (Date.parse(dateStr) / 1000) | 0;
        // log(jsDate);
        item.published_time = jsDate;
        if (isEmpty(item.author)) item.author = meta.Author;
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, `g`), replacement);
        };
        let b = $(`#article-body`);
        b.find(`.mpw-inline`).remove();
        b.find(`aside`).remove();
        b.find(`.mpw-inline-col`).remove();
        b.find(`.aside-wrapper`).remove();
        b.find(`iframe[src*="triggered"]`).remove();
        b.find(`iframe[src*="banners"]`).remove();
        b.find(`.article-aside-ad`).remove();
        b.find(`.aside-wrapper`).remove();
        b.find(`.mpw-inline-col`).remove();
        b.find(`#article-footer`).remove();
        b.find(`#article-HEADER`).remove();
        b.find(`#article-comments`).remove();
        item.body = b.html();
        item.description = $(`#article-body p`).text().substring(0, 256);
        //log("description=",item.description);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
