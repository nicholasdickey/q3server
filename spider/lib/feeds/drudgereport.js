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
        if (item.url.indexOf("drudgereport.com") >= 0) {
            /*let link=$('a').attr('href');
	log("LINK:"+link);
	let url="http://qwiket.com/api?task=submit_link&link="+encodeURIComponent(link)+"&shortname=drudgereport";
	fetch(url).then(function(response){
		log("returned submit_link");
	});//app_col1
	*/
            //var links=$('#app_col1 a');
            //log("LINKS:"+links);
            $("a").each(function (i) {
                // log("INSIDE");
                let l = $(this).attr("href");
                //log("l="+l);
                let url =
                    "http://dr.qwiket.com/api?task=submit_link&link=" +
                    encodeURIComponent(l) +
                    "&shortname=drudgereport";
                log("url=" + url);
                fetch(url).then(function (response) {
                    //log("returned submit_link");
                });
            });
            /*
  $('#app_col2 a').each(function(i){
       // log("INSIDE");
  		let l=$(this).attr('href');
      	//log("l="+l);
   	  	let url="http://dr.qwiket.com/api?task=submit_link&link="+encodeURIComponent(l)+"&shortname=drudgereport";
  	  	log("url="+url);
        fetch(url).then(function(response){
		//log("returned submit_link");
		});
    });
  $('#app_col3 a').each(function(i){
       // log("INSIDE");
  		let l=$(this).attr('href');
      	//log("l="+l);
   	  	let url="http://dr.qwiket.com/api?task=submit_link&link="+encodeURIComponent(l)+"&shortname=drudgereport";
  	  	log("url="+url);
        fetch(url).then(function(response){
		//log("returned submit_link");
		});
    });
    */
        } else {
            log("******  DRUDGE  **********");
            log("drudge url=" + item.url);
            if (!item.site_name) {
                item.site_name = $('meta[name="twitter:site"]').attr("content");
            }
            log("site_name=" + item.site_name);
            if (item.site_name == "@theweek") item.site_name = "The Week";
            if (item.site_name == "@presstelegram")
                item.site_name = "Press Telegram";
            if (item.site_name == "U.S.") item.site_name = "Reuters";
            if (!item.site_name) {
                if (item.url.indexOf("yahoo") >= 0) {
                    item.site_name = "Yahoo News";
                }
                if (item.url.indexOf("nytimes") >= 0) {
                    item.site_name = "New York Times";
                }
                if (item.url.indexOf("citizensvoice") >= 0) {
                    item.site_name = "Citizen Voice (W-B,PA)";
                }
            }
            if (!item.author)
                item.author = $('meta[property="og:article:author"]').attr(
                    "content"
                );
            if (!item.published_time) {
                let pTime = $(
                    'meta[property="og:article:published_time"]'
                ).attr("content");
                if (pTime) {
                    item.published_time = (pTime / 1000) | 0;
                }
            }
            if (!item.description || item.title.indexOf("The Monitor") > 0)
                reject(item);
            else resolve(item);
        }
        //reject(item)
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
