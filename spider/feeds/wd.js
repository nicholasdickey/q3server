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
        // v 001
        item.author = $(`.author a`).text();
        item.locale = `cdn`;

        let b = $(`.post  .text`);
        b.find(`.advertisement`).remove();
        b.find(`.related-content`).remove();
        b.find(`#totalpoll`).remove();
        b.find(`.search-form`).remove();
        item.body = b.html();
        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
