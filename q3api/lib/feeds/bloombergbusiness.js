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

        if (item.url.indexOf("/politics") >= 0) {
            reject(item);
            return;
        }
        item.url = item.url.replace("http:///", "http://bloomberg.com/");
        log("fetching " + item.url);
        fetch(item.url)
            .then(response => {
                return response.text();
            })
            .then(body => {
                log("body");
                let v = $("<div/>").html(body).contents();
                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                item.title = v
                    .find('meta[property="og:title"]')
                    .attr("content");
                item.image = v
                    .find('meta[property="og:image"]')
                    .attr("content");
                item.url = v.find('meta[property="og:url"]').attr("content");
                let pt = v
                    .find('meta[name="parsely-pub-date"]')
                    .attr("content");
                log("pt=" + pt);
                item.published_time = (Date.parse(pt) / 1000) | 0;
                item.author = v
                    .find('meta[name="parsely-author"]')
                    .attr("content");
                item.site_name = "Bloomberg";
                log("image " + item.image);
                log("description " + item.description);
                log("pubDate " + item.published_time);
                if (!item.description) return reject(item);
                else return resolve(item);
            });

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
