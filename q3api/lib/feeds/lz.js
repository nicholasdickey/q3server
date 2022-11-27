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

        // v 0001
        item.locale = `cdn`;
        item.author = $(`a[rel="author"]`).first().text();
        let b = $(`.post .text`);
        b.find(`.advertisement`).remove();
        b.find(`.disclaimer`).remove();
        b.find(`.related-content`).remove();
        b.find(`#advertisement`).remove();
        b.find(`#totalpoll`).remove();
        b.find(`#subscribe`).remove();
        item.body = b.html();
        // log(`body:`, item.body);
        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
