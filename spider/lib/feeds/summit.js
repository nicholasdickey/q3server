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

        item.author = $(`.mvp-author-info-name[itemprop="author"] p`).text();
        item.site_name = `Summit News`;
        if (item.title.indexOf(`News From The Summit`) >= 0)
            return reject(item);
        if (item.description.indexOf(`News From The Summit`) >= 0)
            return reject(item);
        let publishedTime = $(`meta[itemprop="dateModified"]`).attr(`content`);
        let pt = publishedTime + ` 08:00:01 GMT`;
        let pt2 = (Date.parse(pt) / 1000) | 0;
        log("publishedTime", pt2);
        //log("pt=",item.published_time);
        item.published_time = pt2;
        let b = $(`#mvp-content-body`);
        b.find(`#mvp-related-posts`).remove();
        b.find(`.mvp-org-logo`).remove();
        b.find(`#mvp-content-bot`).remove();
        b.find(`.mvp-cont-read-wrap`).remove();
        b.find(`script`).remove();
        b.find(`#___ytsubscribe_0`).remove();

        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
