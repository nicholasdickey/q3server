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
}) {
    try {
        //========================
        if (isEmpty(item.image) || item.image.indexOf("blank.jpg") !== -1)
            item.image =
                "https://pbs.twimg.com/profile_images/436578862030270464/Vth441YH_400x400.jpeg";
        log("item.image", item.image);
        item.site_name = "Victor Davis Hanson";
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
