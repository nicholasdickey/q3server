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
        /* var u =
            "https://www.weaselzippers.us" +
            item.url.split("weaselzippers.us")[1];
        if (u.indexOf("undefined") > -1) u = item.url;
        item.url = u;
        log(item.url);

        fetch(item.url)
            .then(response => {
                return response.text();
            })
            .then(body => {
                let v = $("<div/>").html(body).contents();
                item.description = v
                    .find('meta[name="twitter:description"]')
                    .attr("content");
                item.site_name = "Weasel Zippers";
                item.image = v
                    .find('meta[name="twitter:image"]')
                    .attr("content");
                if (!item.image)
                    item.image = v
                        .find('meta[property="og:image"]')
                        .attr("content");
                if (!item.description)
                    item.description = v
                        .find('meta[property="og:description"]')
                        .attr("content");
                if (!item.description) {
                    item.description = "";
                    let description = v.find(".post-content p");
                    if (description) {
                        let eq = 0;
                        let i = 0;
                        while (item.description.length < 256) {
                            if (!description.eq(eq)) {
                                log("break");
                                break;
                            }
                            let ss = description.eq(eq).text();
                            eq++;
                            if (ss && ss.length > 0) {
                                item.description += "<p>" + ss + "</p>";
                            }
                            if (i++ > 10) break;
                        }
                        if (item.description.length >= 256)
                            item.description += "...";
                    }
                }

                log("img=" + item.image);
                if (item.image)
                    item.image = item.image.replace("https", "http");
                item.locale = "cdn";
                item.title = v
                    .find('meta[name="twitter:title"]')
                    .attr("content");
                if (item.title == "Weasel Zippers") {
                    reject(item);
                    return;
                }
                item.url = v.find('meta[name="twitter:url"]').attr("content");
                log(item.url);
                //item.author="Weasel Zippers";
                var postmeta = v.find(".postmetadata").text();
                log("postmetadata" + postmeta);
                item.author = postmeta.split("|")[0];
                if (item.author) item.author = item.author.trim();
                var d = postmeta.split("|")[1] + "EDT";
                log("d=" + d);
                var dd = new Date(d);
                log("dd=" + dd.toString());
                item.published_time = (dd.getTime() / 1000) | 0;
                log("published_time=" + item.published_time);

                if (isEmpty(item.description)) {
                    reject(item);
                    return;
                }
                log("description:" + item.description);
                item.locale = "cdn";
                //item.image='https://videos.files.wordpress.com/OgW90jME/officer-involved-shooting-falcon-heights-mn-us-7-6-2016_dvd.original.jpg'

                let b = v.find(".post-content");
                b.find(`img[src*="${item.image}"]`).remove();
                b.find(`.swp_social_panel`).remove();
                let fullHtml = "";
                b.each(function () {
                    const html = $(this).html().trim();
                    if (html) fullHtml += html;
                });
                item.body = fullHtml.trim();
                log("fullHtml=", fullHtml);

                resolve(item);
            })
            .catch(error => {
                log("error " + error);
                reject(item);
            });
*/
        item.image=$('meta[name="twitter:image"]').attr("content");    
        l(chalk.green.bold("image:",item.image))
        item.title = item.title.split("|")[0].trim();
        item.site_name = "Weasel Zippers";
        item.locale = "cdn";
        item.url = $(`link[rel="canonical"]`).attr("href");
        let b = $(".post-content");
        b.find(`img[src*="${item.image}"]`).remove();
        b.find(`.swp_social_panel`).remove();
        let fullHtml = "";
        b.each(function () {
            const html = $(this).html().trim();
            if (html) fullHtml += html;
        });
        item.body = fullHtml.trim();
        var postmeta = $(".postmetadata").text();
        log("postmetadata" + postmeta);
        item.author = postmeta.split("|")[0];
        if (item.author) item.author = item.author.trim();
        var d = postmeta.split("|")[1] + "EDT";
        log("d=" + d);
        var dd = new Date(d);
        log("dd=" + dd.toString());
        item.published_time = (dd.getTime() / 1000) | 0;
        log("published_time=" + item.published_time);
        item.locale = "cdn";
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
