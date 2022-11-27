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
        // v001
        if (isEmpty(item.author))
            item.author = $('meta[property="author"]').attr("content");
        if (isEmpty(item.description)) {
            item.description = $(".field-type-text-with-summary").text();
        }
        //if(!item.rss){
        //var date =  new Date();
        //var minutes = date.getTimezoneOffset();
        //item.published_time+=minutes*60
        //if(isEmpty(item.published_time)){
        //let publishedTime="";

        //if(!item.rss){
        let publishedTime = $("meta[property='article:published_time']").attr(
            "content"
        );

        /*}
  else{
    	publishedTime=item.rss.date
  	}*/
        //log("v2")
        log("publishedTime=" + publishedTime);
        // 	log("publishedTime="+publishedTime.split(",")[1]+':00 EDT')
        let jsDate = (Date.parse(publishedTime) / 1000) | 0;
        log(jsDate);
        //var date =  new Date();
        //log("fixing time")
        item.published_time = jsDate; //+date.getTimezoneOffset()*60
        // }
        //}
        //else
        //  item.published_time=item.rss.date
        item.image = item.image ? item.image.replace("http:", "https:") : "";
        let b = $(".article__text");
        b.find(".dfp-tag-wrapper").remove();
        b.find("script").remove();
        b.find(".article-tags").remove();
        b.find(".people-article").remove();
        b.find(".rollover-people").remove();

        let fullHtml = "";
        b.each(function () {
            fullHtml += $(this)
                .html()
                .replace(/width\=\"([A-Za-z0-9 _]*)\"/g, 'width="100%"')
                .replace(/height\=\"([A-Za-z0-9 _]*)\"/g, "");
        });
        item.body = fullHtml;
        l("the hill", item.body)
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
