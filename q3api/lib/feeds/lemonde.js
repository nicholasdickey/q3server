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
        item.site_name = "Le Monde";
        item.author = $(".auteur").first().text();
        let s = $('script[type="application/ld+json"]').text();

        log("script:" + s);
        let j = JSON.parse(s);
        log("j:" + JSON.stringify(j));
        let date = j.datePublished;
        log("date=" + date);
        let jsDate = (Date.parse(date) / 1000) | 0;
        item.published_time = jsDate;
        log("pubdate=" + item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
