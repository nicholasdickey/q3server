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
        // v 003
        item.locale = "CDN";
        item.author = $(".ArticlePage-authorName .Link").text();
        //log('author=',item.author);
        let b = $(".RichTextArticleBody-body");
        b.find(".connatix").remove();
        if (b.html())
            item.body = b
                .html()
                .replace(/data-image-size\=\"(.*)\"/g, `width=100%`);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
