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
        fetch(item.url)
            .then(response => {
                // log("response!!!")
                return response.text();
            })
            .then(body => {
                let v = $("<div/>").html(body).contents();
                log("inside!!!");
                //log("description"+v.find('meta[property="og:description"]').attr("content"))
                /*let image=v.find('.b-article img').first().attr("src");      
	//log('image:'+image)
	if(image)		
      item.image="http://www.novayagazeta.ru/"+image   
    if(isEmpty(item.author))
      item.author=v.find('.b-person-side-title-link').text()
    if(isEmpty(item.author))
      item.author="Новая Газета"*/
                let defaultDescription = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                log("default description:" + defaultDescription);
                let description = v.find(".body p");
                //.first().text()
                let eq = 0;
                item.description = "<p><em>" + defaultDescription + "</em></p>";
                while (item.description.length < 256) {
                    item.description += "\n" + description.eq(eq++).text();
                }
                log("item.description=" + item.description);
                log("published_time=" + item.published_time);
                item.published_time -= 7 * 3600;
                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
