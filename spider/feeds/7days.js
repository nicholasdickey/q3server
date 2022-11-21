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
        fetch(item.url)
            .then(response => {
                log("response!!!");
                return response.text();
            })
            .then(body => {
                //log("body")
                item.site_name = "7 дней";
                let v = $("<div/>").html(body).contents();
                item.image = v
                    .find('meta[property="og:image"]')
                    .attr("content");
                log("image:" + item.image);
                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                if (isEmpty(item.author))
                    item.author = v.find('[rel="author"]').text();

                if (isEmpty(item.author))
                    item.author = v.find(".date a").text();
                item.locale = "cdn";
                if (item.image && item.image.indexOf("http") < 0)
                    item.image = "http://7days.us" + item.image;
                if (!item.description) reject(item);
                item.published_time = item.published_time - 3600;
                log("pt=" + item.published_time);
                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
