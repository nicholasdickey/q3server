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
        //log("inside ITEM :"+item)
        item.site_name = "NY Post";
        if (
            search(".entry-content", [
                "aseball",
                "ugout",
                "itcher",
                "homer",
                "infield",
                "outfield",
                "Mets",
                "Yankees",
                "Citi Field",
            ])
        ) {
            resolve(item);
            // log('accept:'+item.description)
            return;
        }
        //log('reject:'+item.description);
        reject(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
