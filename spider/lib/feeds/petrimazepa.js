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
        item.author = $(".authorCol").text();
        let description = $(".mainContent p");
        //.first().text()
        let eq = 0;
        item.description = ""; //<p><em>'+defaultDescription+'</em></p>';
        while (item.description.length < 1024) {
            item.description += "\n" + description.eq(eq++).text();
        }
        item.printURL = "nc";
        if (!item.author) {
            item.author = $(".authorCol a").text();
        }
        if (!item.description.trim()) reject(item);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
