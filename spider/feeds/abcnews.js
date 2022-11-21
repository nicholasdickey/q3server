import { l, chalk, microtime, allowLog,js } from "../lib/common.js";

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
        if (isEmpty(item.image))
            item.image =
                "https://upload.wikimedia.org/wikipedia/commons/4/48/Abc-news-logo.png";
        //var date =  new Date();
        //var minutes = date.getTimezoneOffset();
        //item.published_time+=minutes*60
        l(chalk.yellow(js(item)))
        let script=$('script').text();
        l(chalk.green(script));
        l(`${script.split('dateModified":"')[1].split('"')[0]}`)
        let dateModified=`${script.split('dateModified":"')[1].split('"')[0]}`;
     
        l(chalk.magenta(dateModified))
        //let jsDate = $('meta[name="Last-Modified"]').attr("content");
        //log("jsDate" + jsDate);
        item.published_time = (Date.parse(dateModified) / 1000) | 0;
        log("published_time=" + item.published_time);
        let b = $("article");
       
        b.find('section').remove();
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
        reject(item);
    }
}
export default func;
