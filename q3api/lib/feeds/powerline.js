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
        //v.004
        if (isEmpty(item.author)) item.author = $(".author").text();
        if (item.title.indexOf("403 Forbidden") >= 0) {
            reject(item);
            return;
        }
        item.image =
            "http://www.powerlineblog.com/wp-content/themes/powerline/images/powerline-logo4@2x.png";
        let published_time = $('meta[property="article:published_time"]').attr(
            "content"
        );
        item.locale = "cdn";
        log("pt=" + published_time);
        item.published_time = (Date.parse(published_time) / 1000) | 0;

        log(item.published_time);

        let b = $(".entry-content");
        b.find(".swp_social_panel").remove();
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
