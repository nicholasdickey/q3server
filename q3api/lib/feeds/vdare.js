import { l, chalk, microtime, allowLog } from "../common.js";

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
        //item.image=$('meta[itemprop="image"]').attr('content');
        item.url = `https://vdare.com${item.url}`;
        item.image = $('meta[property="og:image"]').attr("content");
        if (item.image && item.image.indexOf("thumb_100_") >= 0) {
            // log("THUMB:");
            item.image = item.image.replace("thumb_100_", "");
        }
        // log("IMAGE:" + item.image);
        if (isEmpty(item.image))
            item.image =
                "https://pbs.twimg.com/profile_images/950753446629535744/K8pMAZJb_400x400.jpg";
        item.author = $(".author-name").text();
        // log("rss=", item.rss);
        //if(isEmpty(item.description))
        item.description = $(".content-block").text().substring(0, 512); //item.rss.description
        // log(item.description);
        item.title = $(".social-share-button").attr("data-title");
        //item.description=$('<div/>').html(item.description).text().substring(0,256);
        if (item.description.length == 512) item.description += "...";
        if (isEmpty(item.author))
            item.author = $('a [title="View user profile."]').text();
        if (isEmpty(item.author)) item.author = $(".pf-author a").text();
        item.title = item.title.split("|")[0];
        if (isEmpty(item.site_name)) item.site_name = "VDARE";
        // log("title=", item.title);
        let b = $("div.raw.content-block");
        if (!b || !b.text()) {
           // log("retry");
            b = $(`.publication-content__content-block`);
          //  log("retry text", b.text());
        }
        b.find(`p`).last().remove();
        item.body = b.html();
        // log("body=", item.body);
        if (!item.description) item.description = b.find("p").first().text();
        return resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item)
}
export default func;
