import { l, chalk, microtime, allowLog } from "../common.js"

function func({
    $,
    item,
    resolve,
    reject,
    log,
    fetch,
    isEmpty,
    jsStringEscape,
}) {
    try {
        //========================
        // v 002
        item.url = $(`meta[property="og:url"]`).attr(`content`)
        item.image = $(`meta[property="og:image"]`).attr(`content`)
        item.author = $(`a[rel="author"]`).text() //$(`.author-names`).first().text()
 //       log(`author=` + item.author)
//
        if (item.image.indexOf("gravatar") >= 0) return reject(item)
        let published_time = $(`meta[property="article:published_time"]`).attr(
            `content`
        )

  //      log(`pt1=` + published_time)
        item.published_time = (Date.parse(published_time) / 1000) | 0

  //      log(item.published_time)
        item.locale=`cdn`;
   //     log(`item:`, JSON.stringify(item))
        item.title = item.title.split(`- American Greatness`)[0]
        item.title = item.title.split(`›`)[0]
   //    log(`item2:`, JSON.stringify(item))
        if (item.title.indexOf("American Greatness") >= 0) {
          //  log(1, item.title, { sp: item.title.split(`›`) })
            return reject(item)
        }
        if (item.author.indexOf("American Greatness") >= 0) {
          //  log(2)
            return reject(item)
        }
      //  log("AUTHOR", item.author)
        if (!item.author) {
            return reject(item)
        }
        if (!item.description) {
            return reject(item)
        }
        if (item.title.indexOf("Required Reading") >= 0) {
            $(`a[data-wpel-link="external"]`).each(function (i) {
                // log("INSIDE");
                const te = $(this).text()
                //log("TE:",te);
                if (te && te.indexOf("Read more at") >= 0) {
                    // log("FETCHING");
                    let l = $(this).attr(`href`)
                    //log("l="+l);
                    let url =
                        "http://qwiket.com/api?task=submit_link&link=" +
                        encodeURIComponent(l) +
                        "&shortname=amgreat"
                    // log("url="+url);
                    fetch(url).then(function (response) {
                        //log("returned submit_link");
                    })
                }
            })
            return reject(item)
        }

        let b = $(`.entry-content`) // $(`.pf-content`);
        b.find(`.fusion-meta-info`).remove()
        b.find(`.printfriendly`).remove()
        b.find(`script`).remove()
        b.find(`.at-above-post`).remove()
        b.find(`.about-author`).remove()
        b.find(`.about-author-container`).remove()
        b.find(`.code-block`).remove()
        b.find(`img[src="${item.image}"]`).remove()
        //const im=;
        let ifo = 0
        log("b length", b.length)
        log("body1=", b.html())
        const p = b.find(`p`)
        let c = p.map(function (i) {
            let ni = $(this).find(`img`).attr("src")
            let replacement = $(`<div/>`)
            //log("el=",$(this).html());
            // log("NI i="," ni=",ni);
            if (ni && i == 0) {
                item.image = ni
                ifo = 1
            } else {
                if (ifo == 1 && i == 1) {
                    item.description = $(this).text()
                }
                // log("this.html=",$(this).html());
                let a = $(`<p/>`).append($(this).html())
                replacement = a
                //let rh=$(`<p/>`).append($(this).clone(););
                //log("rh=",rh);
                //replacement=rh;//.append(this);
                //  log("replacement",replacement.html());
            }
            return `<p>` + replacement.html() + `</p>`
        })
        const cs = `<div>` + c.get().join(``) + `</div>`

        //log(`cs->`,cs);
        c = $(`<div/>`).append(cs)
        //c=$(`<div/>`).append(c.clone());

        //log ("new image:",item.image);
        //log("body=",b.html());
        //log("new body=",c.length,c.html());
        //log("description",item.description);
        item.body = c.html().replace(/float ([A-Za-z0-9 _]*)\;/g, ``)
        if (
            item.body &&
            item.body.indexOf(`fusion_builder_container hundred_percent`) >= 0
        )
            return reject(item)
     //   log("item.body", item.body)
        return resolve(item)
        //==================================================================================
    } catch (x) {
        l(chalk.red(x))
    }
    reject(item)
}
export default func
