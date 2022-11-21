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
        if (item.image) {
            item.image = "https:" + item.image.split("?")[0];
            item.image = item.image.replace("https:https", "https");
            item.image = item.image.replace("https:http", "https");
        }
        log(item.image);
        if (item.title.indexOf("403") >= 0 || item.title.indexOf("404") >= 0)
            return reject(item);
        let d = $('meta[name="dcterms.created"]').attr("content");
        log("d=", d);

        item.published_time = (Date.parse(d) / 1000) | 0;
        resolve(item);
        let b = $(`.article-body`);
        b.find(`.ad-container`).remove();
        b.find(`.video-container`).remove();
        b.find(`.featured`).remove();
        b.find(`.speakable`).remove();
        $('a:contains("CLICK HERE")').remove();
        item.body = b.html();

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
