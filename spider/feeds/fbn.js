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
        if (!item.image || item.image.indexOf("og-fox-business") >= 0) {
            reject(item);
        } else {
            log("IMG " + item.image);

            const url = $('meta[property="og:url"]').attr("content");
            if (url) item.url = url;
            item.author = $('span[itemprop="name"]').text().trim();

            let published_time = $('meta[name="dcterms.created"]').attr(
                "content"
            );

            log("pt=" + published_time);
            item.published_time = (Date.parse(published_time) / 1000) | 0;
            log("published_time=" + item.published_time);
            if (item.image == "http://www.foxbusiness.com")
                item.image =
                    "http://join.luxury/wp-content/uploads/2015/08/foxbusiness-logo.jpg";

            let b = $(`.article-body`);
            b.find(`strong`).remove();
            b.find(`.featured-video`).remove();
            b.find(`.ad-container`).remove();
            item.body = b.html().replace(`<p>.</p>`, "").replace(`<!---->`, "");
            resolve(item);
        }

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
