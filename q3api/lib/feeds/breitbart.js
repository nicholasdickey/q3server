import { l, chalk, microtime, allowLog } from "../common.js";
import runFeedActions from "../actions/runFeedActions.js";
const { postUrl } = runFeedActions;
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
        //v 004
        if (!item.author) item.author = $(".byauthor").text();
        if (isEmpty(item.image))
            item.image =
                "http://www.breitbart.com/t/assets/i/BB-logo-highres.jpg";
        let pTime = $('meta[property="article:published_time"]').attr(
            "content"
        );
        item.published_time = (Date.parse(pTime) / 1000) | 0;
        item.title = item.title.split("|")[0];
        //item.locale = "cdn";
        item.url = $(`meta[property="og:url"]`).attr("content");
        let b = $(".entry-content");
        //b.find('aside').remove();
        b.find("footer").remove();
        let sub = b.find(".subheading");
        // l(chalk.yellow("setting subheading style"));
        $(".subheading").css("font-size", "small");
        $(".subheading").css("font-style", "italic");
        item.body = b.html(); //.replace(/width\=\"([A-Za-z0-9 _]*)\"/,'width="100%"').replace(/height\=\"([A-Za-z0-9 _]*)\"/,'');
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
