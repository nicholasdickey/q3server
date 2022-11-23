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
        let t = $("time").attr("datetime");
        log("datetime=" + t);
        if (t) {
            item.published_time = (Date.parse(t) / 1000) | 0;
        }
        log("published_time=" + item.published_time);
        let metaDescription = $('meta[property="og:description"]').attr(
            "content"
        );
        item.url = $('meta[property="og:url"]').attr("content");

        //log("descr")
        let description = $(".wysiwyg p");
        //.first().text()
        let eq = 0;
        item.description = "<p><em>" + metaDescription + "</em></p>";
        while (item.description.length < 512) {
            if (isEmpty(description.eq(eq))) break;
            else {
                //log(description.eq(eq))
            }
            item.description += "<p>" + description.eq(eq++).text() + "</p>";
        }
        if (isEmpty(item.description) || item.description == "undefined")
            item.description = "";
        //log('description3='+item.description)
        item.url = item.url.replace("https", "http");
        log("url=" + item.url);
        item.site_name = "Radio Free Europe  /  Liberty";
        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
