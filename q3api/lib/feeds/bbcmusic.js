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
        var d = $(".date").text();
        log("d=" + d);
        var w = d.split("-");
        var w1 = w[0].split(" ");
        var v0 = w[1].split(":");
        var p = false;
        var v2 = v0[0];
        var v3 = v0[1];
        var v = "";
        if (v3.indexOf("pm") > -1) {
            p = true;
            v3 = v3.replace("pm", "").trim();
            v3 = +v3 + 12;
            v = v2 + ":" + v3 + ":00 GMT";
        } else if (v3.indexOf("am") > -1) {
            v3 = v3.replace("am", "").trim();
            v3 = +v3;
            b;
            v = v2 + ":" + v3 + ":00 GMT";
        }

        var s = w1[1] + " " + w1[0] + "," + w1[2] + " " + v; //+w[1];
        log("s=" + s);

        var i = Date.parse(s);
        item.published_time = (i / 1000) | 0;
        log("i=" + item.published_time);

        item.image = $("img").attr("src");
        log("item.image=" + item.image);
        item.author = $(".author-info a").text();
        item.site_name = "BBC Music Magazine";
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
