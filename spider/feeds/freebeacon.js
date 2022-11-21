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
        // v 001
        item.author = $('article a[rel="author"]').first().text();
        let d = $("time").attr("datetime");
        item.published_time = (Date.parse(d) / 1000) | 0;
        log("published_time=" + item.published_time);
        if (!item.image)
            item.image =
                "https://pbs.twimg.com/profile_images/426457214228787200/fOuyjxjY_400x400.jpeg";
        let b = $(".article-content");
        b.find(".feature-image").remove();
        b.find('.tag-list').remove();
        let h = $("header .subheadline");
        b.find(".posts-content__category-widget").remove();
        //let htmlblock=(h?h.html():'')+'<br/>'+b.html();
        item.body = b.html();
        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
