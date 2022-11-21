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
        //log("description"+$('meta[property="og:description"]').attr("content"))
        //log("url="+item.url)
        fetch(item.url)
            .then(response => {
                // log("response!!!")
                return response.text();
            })
            .then(body => {
                let v = $("<div/>").html(body).contents();
                //log("description"+v.find('meta[property="og:description"]').attr("content"))
                let image = v.find("img").first().attr("src");
                log("image:" + image);
                if (image && image.indexOf("mail.ru") < 0) item.image = image;
                if (isEmpty(item.author))
                    item.author = v.find('a[data-reactid="80"]').text();
                if (isEmpty(item.author)) item.author = "Новая Газета";
                let description = v.find("body p");
                //.first().text()
                let eq = 0;
                item.description = "";
                while (item.description.length < 512) {
                    item.description += "\n" + description.eq(eq++).text();
                }
                let published_time = $("time").attr("datetime");

                log("pt=" + published_time);
                item.published_time = (Date.parse(published_time) / 1000) | 0;
                item.title = v.find("h1").text();
                item.site_name = "Новая Газета";
                item.locale = "nocdn";
                log("published_date=" + item.published_time);
                if (
                    !item.image ||
                    item.image.indexOf("informer.yandex.ru") >= 0
                )
                    item.image =
                        "https://pbs.twimg.com/profile_images/979800474009460736/0et_eQ5F_400x400.jpg";
                resolve(item);
            });

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
