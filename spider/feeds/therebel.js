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
        if (item.image.indexOf("TheRebel_Logo.png") >= 0) return reject(item);

        item.url = $('meta[property="og:url"]').attr("content");
        log("url=" + item.url);
        let description = $("p");
        log("description=" + description);
        //.first().text()
        let eq = 0;
        // item.description='<p><em>'+defaultDescription+'</em></p>';
        item.description = "";
        while (item.description.length < 512) {
            item.description += "<p>" + description.eq(eq++).text() + "</p>";
        }
        if (!item.description) return reject(item);
        if (item.description.indexOf("Sign up here") >= 0) return reject(item);
        item.author = $("#subpage-header a").text();
        let d = $("#date").text();
        let s = (Date.parse(d) / 1000) | 0;
        log(s);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
