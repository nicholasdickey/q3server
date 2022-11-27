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
        if (!item.image) return reject(item);
        let b = $(`.article-text`);
        b.find(`.bottom-share-buttons`).remove();
        b.find(`.tagbox`).remove();
        b.find(`.piano_article_bottom_container`).remove();
        b.find(`.piano_article_bottom_recommended_container`).remove();
        b.find(`#recent-stories`).remove();
        b.find(`.below-content`).remove();
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
