import { l, chalk, microtime, allowLog,js } from "../common.js";
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
        item.url = $('meta[property="og:url"]').attr("content");
        //  let pt = $(`meta[itemprop="datePublished"]`).attr(`content`);
        // let publishedTime = $("meta[name='sailthru.date']").attr("content");
        // log("publishedTime=" + publishedTime); //.split(",")[1]+':00 EDT')
        //  item.published_time = (Date.parse(publishedTime) / 1000) | 0;
        let b = $(`article`);
        b.find(`style`).remove();
        b.find(`button`).remove();
        //b.find(`figure`).first().remove();
        b.find(`figure`).first().remove();
        b.find(`.article__aside`).remove();
        b.find(`svg`).remove();
        b.find(`iframe`).remove();
        b.find(`.layout-article-links`).remove();

        item.body = b.html();
       // l("end economist feed",item.body,js(item))
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
