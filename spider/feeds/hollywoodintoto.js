import { l, chalk, microtime, allowLog } from "../lib/common.js";

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
        let publishedTime = $("meta[property='article:published_time']").attr(
            "content"
        );
        item.published_time = (Date.parse(publishedTime) / 1000) | 0;
        //log("pt=" + item.published_time);
        item.author = $('.byline a[rel="author"]').text();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
