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
        //   log("image=" + item.image);
       // item.locale = "cdn";
        const author = $(`.column_center .byline`).first().text();
        // log("author=", author);
        item.author = author;
        if (isEmpty(item.image)) item.image = $(".img_article img").attr("src");
       
        if (!item.title) return reject(item);
        item.title = item.title.split("- Taki's Magazine")[0].trim();
       // log("item.title", item.title);
        if (item.title.indexOf("Archive") >= 0) return reject(item);
       // log(1)
        if (item.title.indexOf("Author at Taki's Magazine") >= 0)
            return reject(item);
       // log('===>',item.image)
        if (item.title.indexOf("Page not found") >= 0) return reject(item);
        if (!item.description) return reject(item);
        //  log("past title,", item.title);
        /*log("image2=" + item.image)
fetch(item.image)
    .then(function (response) {
        log("RESPONSE:" + response.status)
        if (response.status >= 400) {
            //throw new Error("Bad response from server");
            item.image = "https://upload.wikimedia.org/wikipedia/commons/5/57/Taki%27s_Magazine_Logo.jpg"
            log("image3=" + item.image)
        }
        resolve(item)
        //return response.json();
    })
*/
        if (!item.image) return reject(item);
        //log(5678)
        //  item.image =
        //      "https://upload.wikimedia.org/wikipedia/commons/5/57/Taki%27s_Magazine_Logo.jpg";
        let b = $(`#post`);
        b.find(`.img_article`).remove();
        b.find(`center`).remove();
        b.find(`a[href="https://takimag.com/subscriptions"]`).remove();
        item.body = b.html();
        log("feed done", item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
