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
    /*    //========================"
        log("inside url=", item.url);
        //log ('url=',eitem.url))

        fetch(item.url)
            .then(response => {
                return response.text();
            })
            .then(body => {
                // log('b=',body);
                let v = $("<div/>").html(body).contents();
                let d = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                log("iinner descr=", d);
                item.description = d;
                item.locale = v
                    .find('meta[name="dcterms.language"]')
                    .attr("content");
                log("locale=", item.locale);
                if (item.locale != "en") {
                    reject(item);
                    return;
                }

                item.image = v
                    .find('meta[property="og:image"]')
                    .attr("content");
                log("image=", item.image);
                item.author = v.find('a[rel="author"]').text();
                log("author=", item.author);
                // item.description=v.find('meta[property="og:description"]').attr('content');
                //log('item.description=',item.description);
                item.url = v.find('meta[property="og:url"]').attr("content");
                item.title = v
                    .find('meta[property="og:title"]')
                    .attr("content");
                // const dd=v.find('meta[name="dcterms.date"]').attr('content');
                // log('dd=',dd)
                // const da=Date.parse(dd)/1000;
                // log('date=',da);
                item.published_time =
                    (Date.parse(
                        v.find('meta[name="dcterms.date"]').attr("content")
                    ) /
                        1000) |
                    0;
                log("time " + item.published_time);
                item.site_name = v
                    .find('meta[property="og:site_name"]')
                    .attr("content");
                log("site_name=", item.site_name);
                item.locale = "nocdn";
                let b = v.find(".body-content");
                item.body = b.html();
                if (!item.image || !item.title || !item.author) reject(item);
                else resolve(item);
            });

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    */
    item.locale = $('meta[name="dcterms.language"]').attr("content");
    log("locale=", item.locale);
    if (item.locale != "en") {
        return reject(item);
    }
    let date = $('meta[name="dcterms.date"]').attr("content");
    item.published_date = (Date.parse(date) / 1000) | 0;
    log("published_date:", date, item.published_date);
    item.title = item.title.split("|")[0];
    item.author = $('a[rel="author"]').text();
    let b = $(".body-content");
    item.body = b.html();
    if (
        item.image ==
        "https://cdn.mises.org/styles/social_media_1200_x_1200/s3/AudioMisesWire_FB_1200x630_20180223_1.jpg?itok=03AiJpG9"
    )
        item.image =
            "https://qwiket.com/static/cdn/cat/rothbarddotcom.files.wordpress.com201310mises.png";
    resolve(item);
}
export default func;
