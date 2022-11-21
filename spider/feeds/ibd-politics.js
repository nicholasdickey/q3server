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
        log(item.url);
        fetch(item.url)
            .then(response => {
                return response.text();
            })
            .then(body => {
                let v = $("<div/>").html(body).contents();
                item.title = v
                    .find('meta[property="og:title"]')
                    .attr("content");
                item.image = v
                    .find('meta[property="og:image"]')
                    .attr("content");
                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                item.title = v
                    .find('meta[property="og:title"]')
                    .attr("content");
                item.url = v.find('meta[property="og:url"]').attr("content");
                item.site_name = v
                    .find('meta[property="og:site_name"]')
                    .attr("content");
                item.author = v.find('meta[name="author"]').attr("content");
                let pTime = v
                    .find('meta[property="article:published_time"]')
                    .attr("content");
                item.published_time = (Date.parse(pTime) / 1000) | 0;
                log("published_time=" + item.published_time);
                let description = v.find("article p");
                let eq = 0;
                log("Return description:" + description);
                if (description.length > 1) {
                    item.description = "";
                    while (item.description.length < 512) {
                        if (!description.eq(eq)) break;
                        item.description +=
                            "<p>" + description.eq(eq++).text() + "</p>";
                    }
                }
                log("DESCRIPTION:" + item.description);

                item.author = v.find(".author").text();

                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
