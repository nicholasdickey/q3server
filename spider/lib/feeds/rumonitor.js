import { l, chalk, microtime, allowLog } from "../common.js";
import feedActions from "../actions/feedActions.js";
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

        log("url=" + item.url);
        fetch(item.url)
            .then(response => {
                log("response!!!");
                return response.text();
            })
            .then(body => {
                //log("body")
                let v = $("<div/>").html(body).contents();
                item.image = v
                    .find('meta[property="og:image"]')
                    .attr("content");
                log("image:" + item.image);
                /* item.description=v.find('meta[property="og:description"]').attr('content');  
  	log("item.description:"+item.description);
    if(item.description.indexOf("похожих материалов")>0){
    	log("@@@@@")
         item.description=v.find('meta[name="og:description"]').attr('content');  
      
    }*/
                item.description = "";
                let description = v.find("section.content p");
                log("DESCRIPTION=" + description);
                // log('div.top='+item.description)

                let eq = 0;
                while (item.description.length < 1024) {
                    if (!description.eq(eq)) break;
                    item.description +=
                        "<p>" + description.eq(eq++).text() + "</p>";
                }
                if (item.description.length >= 256) item.description += "...";
                log("descr2=" + item.description);

                if (isEmpty(item.image)) {
                    item.image = v.find('img[alt="snimok"]').attr("src");
                }
                item.title = v.find('meta[name="og:title"]').attr("content");
                item.site_name = "Русский Монитор";

                /* if(isEmpty(item.author))
  		item.author=v.find('[rel="author"]').text()
    
    if(isEmpty(item.author))
      item.author=v.find('.date a').text()*/
                item.published_time =
                    (Date.parse(
                        v
                            .find('meta[property="article:published_time"]')
                            .attr("content")
                    ) /
                        1000) |
                    0;
                log(
                    "date=" +
                        v
                            .find('meta[property="article:published_time"]')
                            .attr("content")
                );
                log(item.published_time);
                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
