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
        // 011
        l("entry foreignpolicy");
        let description = $(".below-content p");

        let b = $(".post-content-main");
        b.find(`.content-ungated`).remove();
        b.find(`.see_also`).remove();
        b.find(".tagbox").remove();
        b.find("script").remove();
        b.find(".button-span").remove();
        b.find(".comments").remove();
        b.find("#discussion").remove();
        l("before body");
        item.body = b.html();
        l("body:",item.body)
        let image = $(`meta[property="og:image"]`).attr("content");
        item.image = image;
        let eq = 0;
        /* item.description = "";
        while (item.description.length < 256) {
            l("inside while");
            if (isEmpty(description.eq(eq))) continue;
            //log("description.eq="+description.eq(eq))
            let t = description.eq(eq++).text();
            if (t) t = t.trim();
            if (t) item.description += "<p>" + t + "</p>";
        }*/
        item.author = $(`.entry-author-name`).first().text().trim();
        l("image:::" + item.image);
        if (isEmpty(item.image) || item.image.indexOf("blank.jpg") > 0) {
            item.image =
                "http://media.hotair.com/wp/wp-content/themes/hotair/images/hotair.gif";
        }
        l("DESCRIPTION=" + item.description);
        l("author=",item.author)
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
