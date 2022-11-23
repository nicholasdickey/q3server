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
    chalk,
}) {
    try {
        //========================"
        //v 001
        /*if(!item.image){
  reject(item)
  return;
}*/
        // log("pt=", item.published_time);
        let d = $(`meta[property="article:modified_time"]`).attr(`content`); //v.find("time").attr("datetime");
        item.published_time = (Date.parse(d) / 1000) | 0;
        item.author = $(".writer_box .aut-link").text().trim();
        //log(chalk.yellow("AUTHOR=", item.author));
        //item.author.find('img').remove();
        //item.author = item.author.text();
        // log("author=", item.author);
        item.title = item.title.split("|")[0];
        item.title = item.title.split("- The Spectator -")[0].trim();
        const title = item.title;
        item.site_name = "Spectator USA";
        // log("AUTHOR:", item.author)- The Spectator
        if (
            !item.author ||
            title.indexOf("Author:") === 0 ||
            title.indexOf("Spectator USA") === 0 ||
            title.indexOf("Category:") === 0
        )
            return reject(item);
        //  log("accepted:", { title, author: item.author });
        item.body = $(".ev-meter-content-class").html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
