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
        log(item.image);
        if (
            item.image == "http://ua.censor.net.ua" ||
            item.image == "http://censor.net.ua"
        )
            item.image =
                "http://static.censor.net.ua/images/logo/en/520x520.png";
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
