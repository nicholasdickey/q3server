import { l, chalk, microtime, allowLog } from "../lib/common.js";

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
        //v 0.25
        //var title=''//$('h3').text();

        const ignores = [
            "#Top",
            "http://www.realclearpolitics.com",
            "http://www.rasmussenreports.com",
            "http://www.gallup.com",
            "http://www.zogby.com/",
            "http://www.foxnews.com/polls/",
            "#Bot",
            "http://www.movabletype.org",
            " http://www.centerforpolitics.org/crystalball",
            "http://www.anncoulter.org",
            "http://www.nationalreview.com",
            "http://www.theperfectworld.us",
            "http://www.freerepublic.com",
            "http://www.lucianne.com",
            "http://www.abcnews.go.com/sections/politics/TheNote/TheNote.html",
            "http://home.comcast.net/~gerrydal/",
            "http://cutjibnewsletter.com",
            "http://www.electionprojection.com/",
            "http://www.federalreview.com/compositepoll.htm",
            "http://www.centerforpolitics.org/crystalball",
            "http://mindfulwebworks.com/invulnerable",
            "http://fromdirtlevel.com",
            "http://markandrewedwards.com/markblog",
            "http://www.knitnkitten.org",
            "http://heresolong-voices.blogspot.com",
            "http://blog.orangejewelweed.com",
            "www.comm2a.org",
            "http://kissmemyfool.com",
            "http://restinthevine.blogspot.com/",
            "https://gab.ai/docj",
            "http://insureblog.net/",
            "http://backwardsboy.blogspot.com/",
            "http://oeis.org",
            "https://cutjibnewsletter.com"
        ];

        const partials = [
            "imdb",
            "ace",
            "mindful",
            "etsy.com",
            "gofund",
            "mailto",
            "amazon.com",
            "gofund",
            "google.com",
            "instagram.com",
            "tinyurl",
            "intermarkets.net",
            "@",
            "alphawolf10",
            "http://markandrewedwards.com",
            "pdf",
            ".gov",
            "barbtheevilgenius",
            "t.co",
            "twitter.com",
            "bookhorde",
            "docweasel.com",
        ];
       // l("checking url", JSON.stringify(item));
        if (
            item.url &&
            (item.url.indexOf("ace") != -1 || item.url.indexOf("minx.cc") != -1)
        ) {
            l("url=", item.url);
            // item.url = "http://acecomments.mu.nu/?" + item.url.split("?")[1];
            /* fetch(item.url)
                .then(response => {
                    return response.text();
                })
                .then(body => {*/
            //   let v = $("<div/>").html(body).contents();
            //  console.log(chalk.yellow("BODY:", body));
            if (item.rss) {
              //  l("RSS", item.rss);
                item.title = item.rss.title;
                //  log("title:", item.title);
                if (
                    item.title.indexOf("Thread") > -1 ||
                    item.title.indexOf("EMT") > -1 ||
                    item.title.indexOf("ONT") > -1 ||
                    item.title.indexOf("Tittie") > -1 ||
                    item.title.indexOf("Rant") > -1
                ) {
                    l("return rejecting title");
                    return reject(item);
                }
                if (item.rss && item.rss.pubDate) {
                    //item.rss.pubDate='';
                    var d = Date.parse(item.rss.pubDate);
                    var tt = (d / 1000) | 0;
                    item.published_time = tt;
                    l("item.published_time=", tt);
                }
                if (item.rss && item.rss.description)
                    item.description = item.rss.description;
                if (!item.description) {
                    l("NO DESCRIPTION");
                    let description = $(".blog p");
                    let eq = 0;
                    let i = 0;
                    while (item.description.length < 256) {
                        if (i++ > 5) break;
                        var t = description.eq(eq++).text();
                        if (!t) {
                            continue;
                        }
                        if (t.indexOf("Posted") > -1) break;
                        item.description += "<p>" + t + "</p>";
                    }
                    if (item.description.length >= 256)
                        item.description += "...";
                }
                l("DESCRIPTION:", item.description);
                item.site_name = "Ace Of Spades HQ";
                if (!item.title) return reject(item);
                item.title = item.title
                    .replace(/&#8212/g, "—")
                    .replace(/&#8217;/g, "’")
                    .replace(/&#8211;/g, "–")
                    .replace(/\\u00a0/g, "	 ")
                    .replace(/\\u201c/g, "“")
                    .replace(/&#039;/g, "'");

                if (item.rss && item.rss.image) item.image = item.rss.image;
            }
            if (!item.image) {
                item.image = $(`center img`).first().attr("src");
                if (!item.image)
                    item.image =
                        "https://pbs.twimg.com/profile_images/106355905/AoSHQmini.jpg";
            }
            let b = $(".blog");
            if (b) {
                b.find("#ace_comments").remove();
                b.find(`div[style="display:block"]`).remove(); //new comments
                b.find("script").remove();
                b.find(`link[rel="stylesheet"]`).remove();
                b.find("#duck.tape").remove();
                b.find("form").remove();
                b.find(".posted").remove();
                b.find(".pageinfo").remove();
                b.find(`img[src="${item.image}"]`).remove();
                item.body = b.html().replace("�", "");
              //  l(chalk.green.bold(item.body))
              //  l(chalk.red.bold(item.image))
            }
             var qlinks = $("a"); //.split('<a');
                    item.links = [];
                    if (qlinks)
                        qlinks.each((i, p) => {
                            // log('l11=',$( p ).attr('href')))
                            var href = $(p).attr("href");
                            if (!href) return;
                            if (item.links.indexOf(href) != -1) return;
                            if (ignores.indexOf(href) != -1) return;
                            var leave = false;
                            partials.forEach(p => {
                                leave = href.indexOf(p) != -1 ? true : leave;
                            });
                            if (leave) return;
                            item.links.push(href);
                            l(chalk.yellow(href))
                        });

            return resolve(item);

            // });
        } else {
            //not ace
            return resolve(item);
        }

        //==================================================================================
    } catch (x) {
        console.log("aoshq", chalk.red(x));
    }
    reject(item);
}
export default func;
