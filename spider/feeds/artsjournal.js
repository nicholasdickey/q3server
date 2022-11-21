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
        //log(`item`+JSON.stringify(item.rss))
        /*if(item.rss){
  
 var pd=item.rss.xml.pubDate; 
  //log("pd="+pd);
     item.published_time=Date.parse(pd)/1000|0 
  //log("d="+d)
  
}*/
        let pt = $(`meta[property="article:published_time"]`).attr(`content`);
        item.published_time = (Date.parse(pt) / 1000) | 0;
        log("pubdate=" + item.published_time);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
