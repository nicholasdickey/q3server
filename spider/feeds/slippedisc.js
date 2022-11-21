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
        var d = $(".posted").text();
        log("posted=" + d);
        var d0 = d.split("by")[0];
        log("d0=" + d0);
        var d1 = Date.parse(d0.trim());
        log("d1=" + d1);
        item.published_time = (d1 / 1000) | 0;
        log("pt=" + item.published_time);
        item.description = "";
        let description = $(".container p");
        // log("DESCRIPTION="+description);
        // log('div.top='+item.description)

        let eq = 0;
        let i = 0;
        while (item.description.length < 1024) {
            if (!description.eq(eq)) break;
            var t = description.eq(eq++).text();
            // log("t="+t);
            if (!t || i <= 1) {
                i++;
                if (i > 3) break;
                continue;
            }
            i++;
            if (i > 5) break;
            item.description += "<p>" + t + "</p>";
        }
        if (item.description.length >= 256) item.description += "...";

        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
