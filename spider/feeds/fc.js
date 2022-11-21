import { l, chalk, microtime, allowLog } from "../lib/common.js";
import feedActions from "../lib/actions/feedActions.js";
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
        item.site_name = "Fast Company";
        item.url = $('meta[property="og:url"]').attr("content");
        item.author = $('meta[itemprop="author"]').attr("content");
        let pTime = $('meta[property="article:published_time"]').attr(
            "content"
        );
        item.published_time = (Date.parse(pTime) / 1000) | 0;
        log("published_time " + item.published_time);
        //log('url=',item.url)
        //log('metaurl=',metaurl);
        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
