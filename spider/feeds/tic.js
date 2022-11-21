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
        item.url = $('meta[property="og:url"]').attr("content");
        item.author = $('meta[property="article:section"]').attr("content");
        let t = $('meta[property="article:published_time"]').attr("content");
        item.published_time = (Date.parse(t) / 1000) | 0;
        log(item.published_time);
        item.title = item.title.split(" - The Imaginative Conservative")[0];
        item.title = item.title.split(" ~ The Imaginative Conservative")[0];
        let b = $(`.pf-content`);
        b.find(".awac-wrapper").remove();
        b.find("noscript").remove();
        b.find(".printfriendly").remove();
        let c = b.find("img");
        c.each(function (i) {
            $(this).replaceWith(
                `<img src="${$(this).attr("src").split("?")[0]}"/>`
            );
        });
        item.body = b.html().replace(/style="text-align\: justify;"/g, "");
        log("body=", item.body);
        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
