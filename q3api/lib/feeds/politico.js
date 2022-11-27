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
        //log($('.magazine-story-intro .vcard').text())
        item.author = $(".vcard").text();
        if (isEmpty(item.image))
            item.image =
                "http://static.politico.com/dims4/default/9b941a9/2147483647/resize/960x/quality/90/?url=http%3A%2F%2Fstatic.politico.com%2Fe4%2F3b%2F883a5ddc49daab6e5de0e59b082d%2Fpowerful-journalism-powerful-audience.jpg";

        let published_time = $(".story-meta__timestamp time")
            .last()
            .attr("datetime");

        log("pt=" + published_time);
        item.published_time = (Date.parse(published_time) / 1000) | 0;
        log(item.published_time);
        /* let description=$('.story-main-content p').not('figcaption p'); 
  if(description.length==0){
    log("alt format") 
    description=$('.story-text p').not('shifty-wrapper p'); 
  }
  log('description='+description.text())
  if(!isEmpty(description.text())){
    let eq=0;
  	item.description='';
  	while(item.description.length<512){
        let d=description.eq(eq++);
        if(!d)
          break;
    	item.description+=''+ d.text()+'<br/>';
  	}
  }
  else {
    log('description3='+item.description)
  }*/
        item.description = $('meta[property="og:description"]').attr("content");

        let b = $(`.story-text `);
        let c = $("<div/>").append(b);
        c.find("aside").remove();
        c.find(".story-continued").remove();
        c.find(".story-share").remove();
        c.find("footer").remove();
        c.find("figure").first().remove();
        item.body = c.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
