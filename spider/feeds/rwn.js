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
        item.site_name = "Right Wing News";
        item.author = $(".author a").first().text();
        var pt = $('meta[property="article:published_time"]').attr("content");
        var section = $('meta[property="article:section"]').attr("content");
        if (section != "Column") {
            item.title = "Rejected:" + item.title;
            return reject(item);
        }
        //log('pt='+pt);
        item.published_time = (Date.parse(pt) / 1000) | 0;

        log("published_time>>>=", item.published_time);
        var title = $('meta[property="og:title"]').attr("content");
        var t = title.split("|");
        //log('t='+t);
        title = t[0];
        //log('title='+title);
        item.title = title;
        let b = $("p");
        //let c=b.wrap('<p></p>');
        let bhtml = "";
        b.each(function () {
            const p = $(this).text();
            if (
                !p ||
                p == "Send this to a friend" ||
                p.indexOf("Proudly built") >= 0 ||
                p.indexOf("We have no tolerance for comments") >= 0 ||
                p.indexOf("John Hawkins's book") >= 0
            )
                return;
            bhtml += "<p>" + p + "</p>";
        });
        log("c=", bhtml);
        item.body = bhtml;
        //log('body=',item.body);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
