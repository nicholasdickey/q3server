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
        //v 001
        if (item.url.indexOf("https") < 0) {
            item.url = item.url.replace("http", "https");
        }
        log("accept uri:", item.url);
        item.author = $("a[rel=author]").first().text();

        let published_time = $('meta[property="article:published_time"]').attr(
            "content"
        );

        //log('pt='+published_time)
        item.published_time = (Date.parse(published_time) / 1000) | 0;
        if (item.image.indexOf("https") < 0)
            item.image = item.image.replace("http", "https");
        //log(item.published_time)
        let b = $(".article-content");
        let img = b.find(
            `img[href="https://thefederalist.com/wp-content/themes/attitude-child/images/pixel.gif"]`
        );
        b.find('.article-tags').remove();
        let fullHtml = "";
        b.each(function () {
            let img = $(this).find(
                `img[src="https://thefederalist.com/wp-content/themes/attitude-child/images/pixel.gif"]`
            );
            //l(chalk.blue.bold("IMG2:"));
            img.each(function () {
                $(this).attr("src", $(this).attr("data-lazy-src"));
            });

            const html = $(this).html();
            if (html)
                fullHtml += html
                    .replace(/width\=\"([A-Za-z0-9 _]*)\"/g, 'width="100%"')
                    .replace(/height\=\"([A-Za-z0-9 _]*)\"/g, "");
        });
        item.body = fullHtml;
        l(fullHtml)
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
