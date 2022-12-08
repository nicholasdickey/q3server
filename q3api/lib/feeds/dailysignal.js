import { l, chalk, microtime, allowLog,js } from "../common.js";

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
        //0.03
        //if(isEmpty(item.author))
        //  item.author=$('meta [data-name="marketo-author"]').attr('content')
        //if(isEmpty(item.author))
        if (!item.image) item.image = $(".lead-image img").attr("src");
        item.author = $(".header-wrapper .byline a").first().text();
        if (item.author)
            item.author = item.author.split("Leave a comment")[0].trim();
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, "g"), replacement);
        };
        let hbody = $(".tds-content");
        hbody.find("pre").remove();
        item.body = hbody.html().replaceAll('width="500"', 'width="100%"');
        item.description = $(".tds-content p").first().text();
        item.site_name = `Daily Signal`;
        log("site_name:", item.site_name);
        l("item",js(item))
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
