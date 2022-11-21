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
}) {
    try {
        //========================
        item.author = $(`.author`).text();
        //log("AUTHOR:", item.author);
        log("INSIDE A CLEARER PICTURE");
        log(item);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
        reject(item);
    }
}
export default func;
