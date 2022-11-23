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
        item.url = $('meta[property="og:url"]').attr("content");

        // let publishedTime = $("meta[name='sailthru.date']").attr("content");
        // log("publishedTime=" + publishedTime); //.split(",")[1]+':00 EDT')
        //  item.published_time = (Date.parse(publishedTime) / 1000) | 0;
        let b = $(`.layout-article-body`);
        b.find(`.article__aside`).remove();
        b.find(`#__next`).remove();
        b.find(`iframe`).remove();
        b.find(`.layout-article-links`).remove();
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
