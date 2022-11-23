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
        //v 001
        log("item description:", item);
        item.author = $(".single-author").text();
        log("AUTHOR before split:", item.author);
        const s = item.author.split("by");
        if (s[1]) item.author = s[1].trim();
        log("AUTHOR=", item.author);
        if (!item.author) return reject(item);
        item.body = $(".the-content").html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
