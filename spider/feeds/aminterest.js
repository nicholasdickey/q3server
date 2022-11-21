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
        let published_time = $('meta[property="article:published_time"]').attr(
            "content"
        );
        item.published_time = (Date.parse(published_time) / 1000) | 0;
        item.author = $(".byline").text();
        //log("#pt=" + item.published_time);
        let b = $(`.post`); // $(`.pf-content`);
        item.body = b.html();
        // log("BODY:", item.body);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
