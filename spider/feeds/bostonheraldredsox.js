import { l, chalk, microtime, allowLog } from "../lib/common.js";

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
        //log("inside ITEM :"+item)
        item.site_name = "Boston Herald-Red Sox";
        if (item.url.indexOf("red_sox") >= 0) {
            return resolve(item);
            // log('accept:'+item.description)
        }
        //log('reject:'+item.description);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
