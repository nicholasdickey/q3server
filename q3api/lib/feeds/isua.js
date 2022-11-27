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
        if (item.title.indexOf("Attention") !== -1) item.title = item.rss.title;
        item.site_name = "Sprotiv.Info";
        item.locale = "cdn";
        log("TESTING");
        if (isEmpty(item.image)) {
            item.image = $(".region-content img").attr("src");
            log("image=" + item.image);
            if (isEmpty(item.image))
                item.image =
                    "http://sprotyv.info/sites/sprotyv/themes/v1/images/logo_ru.png";
        }
        item.description = $('meta[property="og:description"]').attr("content");
        log("description=" + item.description);
        //item.description=$('<div/>').html(item.rss.description).text()
        log("IMAGE:" + item.image);

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
                item.description = defaultDescription;
                /*
     let description=v.find('.body p'); 
   //.first().text()
     let eq=0;
     item.description='<p><em>'+defaultDescription+'</em></p>';
   	while(item.description.length<256){
     	item.description+='\n'+ description.eq(eq++).text();
     }
     */
                item.image = v
                    .find('meta[property="og:image"]')
                    .attr("content");
                log("****IMAGE***" + item.image);
                if (isEmpty(item.image))
                    item.image =
                        "http://sprotyv.info/sites/sprotyv/themes/v1/images/logo_ru.png";

                let published_time = v
                    .find('meta[property="article:published_time"]')
                    .attr("content");
                let d = Date.now();
                let p = Date.parse(published_time);
                if (p > d) p = d;
                item.published_time = (p / 1000) | 0;

                log("item.description=" + item.description);
                log("published_time=" + item.published_time);
                // item.published_time-=7*3600
                if (item.image.indexOf("http") < 0)
                    item.image = "http://sprotyv.info" + item.image;
                resolve(item);
            });

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
