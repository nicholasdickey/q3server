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
        log(
            "*****************    STEYN    *********************************************"
        );
        log(item.url);

        fetch(item.url)
            .then(response => {
                return response.text();
            })
            .then(body => {
                let v = $("<div/>").html(body).contents();
                let description = v.find("div.article_body p");
                let eq = 0;
                item.description = "";
                while (item.description.length < 512) {
                    if (!description.eq(eq)) break;
                    item.description +=
                        "<p>" + description.eq(eq++).text() + "</p>";
                }
                log("DESCRIPTION:" + item.description);
                let image = v.find(".media img").first().attr("src");
                log(image);
                item.image = image;
                if (isEmpty(item.image))
                    item.image =
                        "http://images.onset.freedom.com/ocregister/reporters/1249_2779.jpg";

                log("substr", item.image.substring(0, 6));
                let d = v.find("time").attr("datetime");
                item.published_time = (Date.parse(d) / 1000) | 0;
                log("published_time=" + item.published_time);
                item.site_name = "Steynonline";
                item.author = "Mark Steyn";
                item.title = v
                    .find('meta[property="og:title"]')
                    .attr("content");
                item.locale = v
                    .find('meta[property="og:locale"]')
                    .attr("content");
                let b = v.find(".article_body");
                item.body = b.html();

                resolve(item);
            });

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
