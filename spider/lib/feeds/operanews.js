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
        item.description = $('meta[name="description"]').attr("content");
        if (!item.description) item.description = "";
        let description = $(" p");
        log("DESCRIPTION=" + description);
        // log('div.top='+item.description)

        let eq = 0;
        let i = 0;
        while (item.description.length < 1024) {
            if (!description.eq(eq)) break;
            if (i++ > 10) break;
            var t = description.eq(eq++).text();
            if (!t) continue;

            item.description += "<p>" + t + "</p>";
        }
        if (item.description.length >= 256) item.description += "...";
        log("DESCRIPTION=" + item.description);

        item.image = "http://operanews.com" + $("td img").first().attr("src");
        var d = $("ReviewDate").text();
        console.log("d=" + d);
        item.published_time = (Date.parse(d) / 1000) | 0;
        log("published_time===" + item.published_time);
        log("image=" + item.image);
        item.site_name = "Opera News";
        if (
            !item.description ||
            item.image == "http://operanews.comundefined"
        ) {
            reject(item);
        }
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
