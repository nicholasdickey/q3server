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
        //v 001
        const type = $('meta[property="og:type"]').attr("content");
        //log("type",type);
        if (!type || type.indexOf("article") < 0) return reject(item);
        //item.author=author;
        //log("published_time",item.published_time)
        let b = $("article");
        b.find("header").remove();
        b.find("aside").remove();
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l("theatlantic", chalk.red(x));
    }
    reject(item);
}
export default func;
