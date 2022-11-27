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
        fetch(item.url)
            .then(response => {
                log("response!!!");
                return response.text();
            })
            .then(body => {
                //log("body")
                let v = $("<div/>").html(body).contents();
                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                item.published_time = v
                    .find(".mini-info-list__item .date")
                    .attr("data-seconds");
                log(item.published_time);
                return resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
