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
        // v 001
        l("nyt")
        let i = item.url.indexOf("?nytapp=true");
        if (i >= 0) item.url = item.url.substring(0, i);
        i = item.url.indexOf("?partner=rss");
        if (i >= 0) item.url = item.url.substring(0, i)
        l("item title:",item.title)
        l("description: ",item.description)
        if(item.title.indexOf("nytimes.com")>=0){
            l(chalk.red("reject nytimes.com"))
            return reject(item);
        }
        /*if(item.rss)
item.title=item.rss.title
if(item.rss&&isEmpty(item.description))
item.description=item.rss.description */
        item.site_name = "New York Times";
        //if(item.rss)
        let image = $('meta[property="og:image"]').attr("content");
        // log("image=" + image);
        //log("url=" + item.url);
        //item.image=item.rss.image
        //log("RSS"+JSON.stringify(item.rss))
        /*
fetch(item.url).then((response)=>{
      log("response!!!")
      return response.text()  
    }).then((body)=>{
    //log("body") 
    let v=$('<div/>').html(body).contents();
	let image=v.find('meta[property="og:image"]').attr("content")
	log('image:'+image)
    if(isEmpty(item.image))
   		item.image='http://static.cision.com/us/wp-content/uploads/2014/04/New-York-Times.png'
	resolve(item)
})
*/
        let pTime = $('meta[property="article:published"]').attr("content");
        // log("article.published " + pTime);
        item.published_time = (Date.parse(pTime) / 1000) | 0;
        // log("published_time" + item.published_time);

        let b = $("section[name='articleBody']");
        b.find("aside").remove();
        b.find("section.interactive-content").remove();
        //item.body = b.html();

        resolve(item);
        /*item.site_name="Barron's"
  let pTime=$('meta[name="article.published"]').attr('content');
  item.published_time=(Date.parse(pTime)/1000)|0
 log('published_time'+item.published_time)
 resolve(item)*/

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
