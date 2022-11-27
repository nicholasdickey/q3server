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
        if (isEmpty(item.site_name)) {
            reject(item);
            return;
        }
        fetch(item.url)
            .then(response => {
                // log("response!!!")
                return response.text();
            })
            .then(body => {
                //log("body")
                let v = $("<div/>").html(body).contents();
                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                // let published_time=$('header time').attr('datetime')
                let published_time = $('meta[itemprop="datePublished"]').attr(
                    "content"
                );

                log("pt=" + published_time);
                item.published_time = (Date.parse(published_time) / 1000) | 0;

                log(item.published_time);
                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
