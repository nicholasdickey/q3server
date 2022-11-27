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
        if (item.url.indexOf("?p=") >= 0) {
            reject(item);
            return;
        }
        var title = $('meta[property="og:title"]').attr("content");
        var t = title.split("|");
        //log('t='+t);
        title = t[0];
        //log('title='+title);
        item.title = title;
        item.description = "";
        item.site_name = "Movieguide";
        let published_time = $('meta[property="article:published_time"]').attr(
            "content"
        );
        item.published_time = (Date.parse(published_time) / 1000) | 0;
        log("pt=" + item.published_time);
        let description = $(".movieguide_review_summary p");
        // log("DESCRIPTION222="+description);
        // log('div.top='+item.description)

        let eq = 0;
        while (item.description.length < 1024) {
            let s = description
                .eq(eq++)
                .text()
                .trim();
            log("chunk=" + s);
            if (!s) break;
            log("INSIDE");

            // if(s)
            item.description += "<p>" + s + "</p>";
        }
        if (item.description.length >= 256) item.description += "...";
        //log("final description"+item.description)
        if (
            isEmpty(item.description) ||
            item.image ==
                "http://movieguide-8dda.kxcdn.com/wp-content/uploads/2015/01/10366268_10152063754327097_8935109610445173863_n-1.png"
        ) {
            reject(item);
            return;
        }
        //log("final description"+item.description)
        resolve(item);
        return;
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
