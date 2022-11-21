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
        if (isEmpty(item.author))
            item.author = $('meta[name="authors"]').attr("content");
        //log('author:'+item.author)
        //log('site_name:'+item.site_name)
        let published_time = $('meta[property="article:published_time"]').attr(
            "content"
        );
        let d = Date.now();
        let p = Date.parse(published_time);
        if (p > d) p = d;
        item.published_time = (p / 1000) | 0;

        // log(item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
