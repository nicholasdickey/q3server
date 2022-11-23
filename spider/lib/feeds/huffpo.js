import { l, chalk, microtime, allowLog,js } from "../common.js";
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
        l("HUFFPO",js(item))
        if (isEmpty(item.author))
            item.author = $(".author-card__details__name").first().text();
        if (item.image == "http://www.huffingtonpost.com") {
            item.image =
                "http://www.tricoastworldwide.com/wp-content/uploads/2014/02/huffington-post-logo.jpg";
        }
        let b = $(".entry__text");
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
