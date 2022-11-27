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
        let published_time = $('meta[property="article:published_time"]').attr(
            "content"
        );
        if (!published_time && item.rss) published_time = item.rss.pubDate;
        log("pt=" + published_time);
        item.published_time = (Date.parse(published_time) / 1000) | 0;
        log("title before split=", item.title);
        item.title = item.title.split("|")[0];
        log("title after split=", item.title);
        item.site_name = "One America Network";
        log("item.published_time:" + item.published_time);
        item.image = $('meta[property="og:image"]').attr("content");
        //log("IMAGE1="+item.image);
        if (!item.image) {
            item.image = $("#main-content img").attr("src");
        }
        log("IMAGE1=" + item.image);
        var i = 0;
        for (i = 0; i < 4; i++) {
            if (
                item.image.indexOf("ogLogo") >= 0 ||
                (item.image.indexOf(".jpg") < 0 &&
                    item.image.indexOf(".png") < 0)
            ) {
                log("try #" + i);
                item.image = $(".entry-content img").attr("src");
            } else {
                break;
            }
        }
        if (
            item.image.indexOf("ogLogo") >= 0 ||
            (item.image.indexOf(".jpg") < 0 && item.image.indexOf(".png") < 0)
        ) {
            item.image =
                "https://pbs.twimg.com/profile_images/579744264751448064/DH0xDrdO_400x400.jpg";
        }
        var d = "";
        //if(item.description.length<512){
        let description = $(".entry-content p");

        // log('div.top='+item.description)

        let eq = 0;
        let c = 0;
        while (item.description.length < 512) {
            if (!description.eq(eq)) break;
            let t = description.eq(eq++).text();
            if (t) t = t.trim();
            if (t && t.indexOf("OANN.com") < 0) d += "<p>" + t + " &nbsp;</p>";
            // }
            // log("DESCRIPTION=" + d);
            item.description = d;
            if (item.description.length >= 500) item.description += "...";
            if (c++ > 5) break;
        }
        if (!item.description) return reject(item);
        let b = $(".entry-content");
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
