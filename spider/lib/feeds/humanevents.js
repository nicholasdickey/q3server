import { l, chalk, microtime, allowLog, js } from "../common.js";

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
       /* if (!item.description) return reject(item);
        item.author = $(`a[rel="author"]`).first().text();
        if (item.author && item.author.indexOf("Home") >= 0)
            return reject(item);
        if (!item.author) {
            item.author = $(`.article-meta a`).first().text();
            if (!item.author) return reject(item);
        }*/
        const script=$(`script`).text();
        const w=script.split(`'GTM-PL8RKTZ');`)[1].split('window.tude')[0];
        //const json=JSON.parse(w);
        const s=w.split( `"datePublished": "`)[1].split(`",`)[0]
        item.published_time = (Date.parse(s) / 1000) | 0;
        l("pt=:",s,item.published_time)
        item.author = $(`span[itemprop="author"]`).first().text().trim();
        l("author=",item.author)
        let b=$(".content-body");
        b.find(".advertisment").remove();
        /*
        let b = $(".article-content");
        b.find(".simplesocialbuttons ").remove();
        b.find(".sharelinks").remove();
        b.find(".pad-bottom").remove();
        b.find(".next").remove();
        b.find(".t-contain").remove();
        b.find(".taboola-below-article").remove();
        b.find(".taboola-below-article-second").remove();
        //log("description",item.description);
        //log("author",item.author);
        //log("body",b.html());
        */
       l("body:",b.html());
        item.body = b.html();
        
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
