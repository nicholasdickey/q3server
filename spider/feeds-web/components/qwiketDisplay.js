import React, { Component } from "react";
import styled from "styled-components";
import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import $ from "jquery";
//import Lightbox from "react-image-lightbox";
//import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import OldMarkdown from "react-markdown";
import Markdown from "markdown-to-jsx";
import { useTheme } from "@material-ui/core/styles";
//import { Image } from "react-bootstrap";
//import ReactHoverObserver from "react-hover-observer";
import yellow from "@material-ui/core/colors/yellow";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
import indigo from "@material-ui/core/colors/indigo";
import grey from "@material-ui/core/colors/grey";
import linkify from "linkifyjs";
/**
 * Process images, videos etc in markdown / html
 */
const allowedTypes = [
    "html",
    "heading",
    "text",
    "paragraph",
    "break",
    "blockquote",
    "list",
    "listItem",
    "code",
    "delete",
    "strong",
    "emphasis",
    "link",
    "image",
];
function split(str, separator, limit) {
    str = str.split(separator);

    if (str.length > limit) {
        var ret = str.splice(0, limit);
        ret.push(str.join(separator));

        return ret;
    }

    return str;
}
function innerX({ html, token, insert, order, level }) {
    //console.log("catedit innerX begin:",{html,token,insert,order,level});
    if (!level) level = 0;
    let w = split(html, token, 1);
    if (w.length == 1) {
        //console.log('catedit cc77 exit',{html,level,w,token,insert,order});
        return html;
    }
    const s = w[0];
    //console.log('catedit cc77 ',{level,s,w,html,token,insert,order})
    const pre = s + (order == "pre" ? insert : "");
    const post = order == "post" ? insert : "";
    const inner = innerX({
        html: w[1],
        token,
        insert,
        order,
        level: level + 1,
    });
    //console.log("catedit innerX end:",{s,html,token,insert,order,level,pre,post,inner});

    return pre + token + post + inner;
}
function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [],
        whitespace = /^\s*$/;

    function getTextNodes(node) {
        if (!node) return;
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                textNodes.push(node);
            }
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);
    return textNodes;
}
const x = (html, isZoom, image) => {
    if (true) {
        html = innerX({
            html,
            token: "<blockquote",
            insert: `<div class="${isZoom ? "zoom" : "normal"}-wrapper">`,
            order: "pre",
        });
        //console.log("catedit 11",html)
        html = innerX({
            html,
            token: "</blockquote>",
            insert: "</div>",
            order: "post",
        });
        //console.log("catedit 12",html)
        let v = $("<div/>").html(html).contents();
        v.find(`style`).remove();
        v.find(`img[src*="${image}"]`).remove();
        //v.find('.twitter-tweet').remove();
        v.find(`img:not([src])`).each(function () {
            const dataSrc = $(this).attr("data-src");
            if (dataSrc) $(this).attr("src", dataSrc);
        });
        v.find("img").each(function () {
            let img = $(this).attr("src")
                ? $(this).attr("src").split("?")[0]
                : "";
            let img2 = image ? image.split("?")[0] : "";
            const w = img2.split("//");
            if (w && w.length > 1) img2 = w[1];
            //console.log("catedit img:",{img,img2})
            if (img.indexOf(img2) >= 0) {
                //console.log("catedit img remove",img);
                $(this).remove();
            }
        });

        // v.find('blockquote').wrap(`<div class="${isZoom ? "zoom" : "normal"}-wrapper"></div>`);
        // v.find('img').wrap(`<div class="${isZoom ? "zoom" : "normal"}-wrapper"></div>`);
        // v.find('iframe').wrap(`<div class="${isZoom ? "zoom" : "normal"}-iframe-wrapper"></div>`);

        var textnodes = getTextNodesIn(v.find("#markdown-shell")[0]);
        //  console.log({ textnodes })
        for (var i = 0; i < textnodes.length; i++) {
            // console.log('textnode', $(textnodes[i]).text())
            if ($(textnodes[i]).parent().is("'#markdown-shell")) {
                $(textnodes[i]).wrap("<p>");
            }
        }

        html = $("<div/>").append(v.clone()).html();
        // html = html.replace(/<p><\/div><\/p>/g, '').replace(/<p><\/div><\/div><\/p>/g, '');
        return html;
    } else return html;
};
const renderArticle = ({
    topic,
    index,
    theme,
    globals,
    zoom,
    channel,
    approver,
}) => {
    let threadid = topic.get("threadid");
    let editor = false;
    zoom = "out";
    console.log("Render Article", { topic: topic ? topic.toJS() : "no topic" });
    return (
        <div
            globals={globals}
            approver={approver}
            zoom={zoom}
            editor={editor}
            topic={topic}
            threadid={threadid}
            channel={channel}
        />
    );
};
const renderArticleHtml = ({
    topic,
    index,
    theme,
    globals,
    zoom,
    channel,
    approver,
}) => {
    let threadid = topic.get("threadid");
    let editor = false;
    zoom = "out";
    console.log("Render Article", { topic: topic ? topic.toJS() : "no topic" });
    return "<div globals={globals} approver={approver}  zoom={zoom} editor={editor} topic={topic} threadid={threadid} channel={channel} />";
};
class ImageRenderer extends Component {
    state = {};
    render() {
        const props = this.props;
        const state = this.state;
        console.log("render Image", { props });
        let { src, alt, index, coreImage } = props;
        console.log("RENDER IMAGE", { src, coreImage });
        if (coreImage && coreImage.trim() && src.indexOf(coreImage) >= 0) {
            console.log("DUPLICATE IMAGE");
            return <div>{`II src:${src} cI:${coreImage}`}</div>;
        }

        const w = alt ? alt.split("x") : [];
        let width = 0;
        let height = 0;
        if (w) {
            width = +w[0] ? w[0] : width;
            height = +w[1] ? w[1] : height;

            const open = state.lightbox;
            // return <div>IMAGE src={src} coreImage={coreImage}</div>
            //   console.log("r2", { state, src })
            return (
                <div>
                    {open ? (
                        <div data-id={coreImage}>
                            <div
                                mainSrc={src}
                                onCloseRequest={() => {
                                    this.setState({ lightbox: false });
                                }}
                            />
                            <div
                                data-id="image-renderer"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}>
                                <img
                                    style={{ height: "100%", width: "100%" }}
                                    onClick={() => {
                                        this.setState({ lightbox: true });
                                    }}
                                    width={width ? width : null}
                                    height={height ? height : null}
                                    src={src}
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            data-id="image-renderer-2"
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}>
                            <img
                                style={{ height: "100%", width: "100%" }}
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.setState({ lightbox: true });
                                }}
                                width={width ? width : null}
                                height={height ? height : null}
                                src={src}
                            />
                        </div>
                    )}
                </div>
            );

            // setTimeout(() => $.getScript("/static/css/fslightbox.js"), 1000)
            // return <a data-fslightbox={alt} href={`/lightbox/${encodeURIComponent(src)}`}><img width={width} height={height} src={src} /></a>
        }
    }
}
class LinkRenderer extends Component {
    state = {};
    render() {
        const props = this.props;
        const state = this.state;
        //  console.log("render Link", { props });
        let { href, index, dataId, theme, ...pr } = props;
        let url = href;
        if (typeof url !== "string") return <div />;
        console.log({ url });
        if (url && url.indexOf("youtube.com") >= 0 && url.indexOf("url=") < 0) {
            //  console.log("youtu.be 21", { url });
            let w = url.split("v=");
            let r2 = w[1];
            let r3 = r2 ? r2.split(":")[0] : "";
            let l = w ? w.length : 0;
            let vlink = "https://www.youtube.com/embed/" + r3;
            //   console.log("youtu.be 3", { vlink, r2, r3, w });
            return (
                <iframe
                    data-d1={r2}
                    data-url={url}
                    key={dataId + "-utube2-" + index}
                    width="100%"
                    height={315}
                    src={vlink}
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    frameborder="0"
                    allow="autoplay;encrypted-media"
                    allowFullScreen={true}
                />
            );
        } else if (
            url.indexOf("youtu.be") >= 0 ||
            url.indexOf("youtube.com") >= 0
        ) {
            const htext = href;
            console.log("youtu.be 210", { htext });
            let w = htext.split("url=");
            let l = w ? w.length : 0;
            let url2 = decodeURIComponent(w[l - 1]);
            let vlink = url2;
            //   console.log("youtu.be 211", { w, l, url2 });
            // if (url.indexOf("youtu.be") >= 0) {

            if (url2.indexOf("youtu.be") >= 0) {
                // console.log("youtu 201", url2)
                w = url2.split("youtu.be/");
                let r2 = w && w.length ? w[1] : "";

                let r3 = r2 ? r2.split("?")[0] : r2;
                let r4 = r3 ? r3.split(":")[0] : r3;

                vlink = "https://www.youtube.com/embed/" + r4;
                // console.log('youtu', { r2, r3, r4, vlink })
            } else {
                w = url2.split(":");
                // console.log("202", w)
                if (url2.indexOf("http") >= 0) vlink = `${w[0]}:${w[1]}`;
                else vlink = `${w[0]}`;
                w = vlink.split("v=");
                // console.log("203", w)
                let r2 = w[1];
                let r3 = r2 ? r2.split(":")[0] : "";
                // console.log("204", r3)
                let l = w ? w.length : 0;
                vlink = "https://www.youtube.com/embed/" + r3;
            }
            // l = w ? w.length : 0;

            // }
            //  console.log("youtu.be 212", { vlink });

            return (
                <iframe
                    data-url={url}
                    key={dataId + "-utube-" + index}
                    width="100%"
                    height={315}
                    src={vlink}
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    frameborder="0"
                    allow="autoplay;encrypted-media"
                    allowFullScreen={true}
                />
            );
        } else if (url && url.indexOf("twitter.com") >= 0) {
            let href2 = href;
            if (href.indexOf("pic.twitter.com") >= 0) {
                console.log("pic.twitter.com", {
                    url,
                    props,
                    ah: href.split("—")[0],
                });
                href2 = href.split("—")[0];
            }
            let hurl = href2; // href.replace('pic.twitter.com', 'twitter.com');
            let w = hurl.split("url=");
            let l = w ? w.length : 0;
            let url2 = decodeURIComponent(w[l - 1]);
            // console.log("processBlock4 twitter.com", url2)
            let tc = (
                <div key={dataId + "-tw1-" + index} className="q-embed-twitter">
                    <blockquote
                        class="twitter-tweet"
                        data-lang="en"
                        data-theme={theme ? "light" : "dark"}>
                        <a
                            onclick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                            href={url2}>
                            <img
                                src="https://banner2.kisspng.com/20180802/czs/kisspng-malta-blockchain-summit-ad-fraud-advertising-indus-twitter-logo-png-5b6352722ae8d6.4341314915332358261758.jpg"
                                height="64"
                                width="64"
                            />
                        </a>
                    </blockquote>
                </div>
            );
            if (
                typeof window != "undefined" &&
                typeof window.twttr !== "undefined"
            )
                setTimeout(() => {
                    //  console.log("TWITTER1")
                    if (
                        typeof window !== "undefined" &&
                        typeof window.twttr !== "undefined"
                    ) {
                        window.twttr.widgets.load();
                        window.twttr.widgets.load();
                    }
                }, 500);

            return tc;
        } else {
            /* else if (url.indexOf("/t.co/") >= 0) {
             let hurl = href;
             let w = hurl.split('url=');
             let l = w ? w.length : 0;
             let url2 = decodeURIComponent(w[l - 1]);
             //console.log("processBlock4 t.co", url2)
             let tc = (<div key={dataId + "-r3-" + index} className="q-embed-twitter">
                 <blockquote class="twitter-tweet" data-lang="en"><a onclick={(e) => { e.stopPropagation(); e.preventDefault(); }} href={url2}>
                     <img src="https://banner2.kisspng.com/20180802/czs/kisspng-malta-blockchain-summit-ad-fraud-advertising-indus-twitter-logo-png-5b6352722ae8d6.4341314915332358261758.jpg" height="64" width="64" /></a></blockquote></div>);
             //el.replaceWith(htm);
             //console.log("processBlock5", htm);
             //  changed = true;
             if (Root.__CLIENT__)
                 setTimeout(() => {
                     window.twttr.widgets.load();
                     window.twttr.widgets.load();
                 }, 500);
             return tc;
         }*/
            /* ['uploads.disquscdn', 'jpg', 'png', 'gif', 'giphy'].forEach(function (token) {
                 console.log("inside1", { token, url, pr })
                 if (url.indexOf(token) >= 0) {
                     console.log("inside2", token)
                     const href = url;
                     if ((href.indexOf('disqus') >= 0 || href.indexOf('disq.us') >= 0) && href.indexOf('imgurl') < 0) {
                         console.log("inside3", token)
 
                         let src = href.split('url=');
                         if (src[1])
                             src = decodeURIComponent(src[1]);
                         else src = href;
                         const w = src ? src.split(token) : [];
                         if (w[1]) {
                             const w1 = w[1];
                             const s = w1.split(':')[0];
                             src = w[0] + token + s;
                         }
                         console.log("inside4", src)
                         return <div> <img src="${src}" class="q-react-embed-image" /></div >;
 
                     }
 
                 }
 
             })*/
            return <a href={href} {...pr} />;
        }
    }
}
const processBlock = ({
    coreImage,
    blockType,
    dataId,
    md,
    index,
    reshare,
    linkColor,
    state,
    setState,
    theme,
}) => {
    let html = null;
    let embeds = null;
    let changed = false;

    if (typeof window !== "undefined") {
        let v = $("<div/>")
            .html("<div>" + md + "</div>")
            .contents();
        if (md && md.indexOf("https") >= 0) {
            // console.log("processBlock", { md })
        }
        //has to use jquery as the link is scrambled and markdown uses the b
        ["uploads.disquscdn", "jpg", "png", "gif", "giphy"].forEach(function (
            token
        ) {
            // console.log("processBlock", { md, token })
            let disqusImages = v.find(`a[href *= "${token}"]`);
            disqusImages.each(function (index) {
                // console.log("processBlock IMAGE FOUNDs", { token })
                let el = $(this);
                const href = el.attr("href");
                if (
                    (href.indexOf("disqus") >= 0 ||
                        href.indexOf("disq.us") >= 0) &&
                    href.indexOf("imgurl") < 0
                ) {
                    let src = href.split("url=");
                    if (src[1]) src = decodeURIComponent(src[1]);
                    else src = href;
                    const w = src ? src.split(token) : [];
                    if (w[1]) {
                        const w1 = w[1];
                        const s = w1.split(":")[0];
                        src = w[0] + token + s;
                    }
                    const htm = `<div> <img src="${src}" class="q-react-embed-image" /></div > `;
                    // console.log("processBlock IMAGE CONFIRMED", { title: el.attr('title'), href: el.attr('href'), htm })
                    el.replaceWith(htm);
                    //  console.log("processBlock2", { htm, title: el.attr('title'), href: el.attr('href'), text: el.text() })
                    changed = true;
                }
            });
        });

        if (changed) {
            if (md.indexOf("That was no sweet") >= 0) console.log("changed");
            html = v.html();
            // if (md.indexOf("This is what") >= 0)
            //    console.log("IMAGE replace ", { md, html })
            if (html) md = html;
        }
    }
    // if (md.indexOf("That was no sweet") >= 0)
    //    console.log("render processBlock7", md);
    //let w = md.split(coreImage);
    // if (w > 1) {
    //if (md.indexOf("Jack Rail")) {
    // console.log("REPLACING IMAGE rail", { md, coreImage })
    if (coreImage) {
        let findCore = md.indexOf(coreImage);
        if (findCore >= 0) {
            let sw = md.split(coreImage);
            if (sw.length > 1) {
                let leftPart = sw[0];
                let rightPart = sw[1];

                console.log("SPLIT:", { leftPart, rightPart, coreImage, sw });
                let lastI = leftPart.lastIndexOf("<");
                leftPart = leftPart.substring(0, lastI);
                lastI = rightPart.indexOf(">");
                rightPart = rightPart.substring(lastI + 1);
                md = leftPart + rightPart;
            }
        }
    }
    // console.log("POST REPLACE", md);
    // }
    //}
    html = (
        <div
            data-id={
                blockType == "text"
                    ? "textblock-" + dataId
                    : "htmlblock-" + dataId
            }
            key={`pre-render-blocks-key-${index}`}
            className={
                reshare > 50 && reshare < 60
                    ? "q-qwiket-markdown-draft"
                    : "q-qwiket-markdown"
            }>
            {blockType == "text" ? (
                <Markdown
                    options={{
                        forceBlock: true,
                        overrides: {
                            img: {
                                component: ImageRenderer,
                                props: {
                                    setState,
                                    index: `lightbox-${index}`,
                                    state,
                                    coreImage,
                                },
                            },
                            a: {
                                component: LinkRenderer,
                                index: `link-${index}`,
                                theme,
                            },
                        },
                    }}>
                    {md.indexOf("<p") < 0
                        ? `<div data-id="inner-wrap">${md}</div>`
                        : md}
                </Markdown>
            ) : (
                <div data-id={`${dataId}-md`}>
                    <OldMarkdown
                        escapeHtml={false}
                        source={md}
                        renderers={{
                            link: props => {
                                // console.log("renderLink", { props })
                                /* const embedVideo = renderIFrame({ href });
                     if (embedVideo)
                         return embedVideo;
                     else 
                     */
                                const href = props.href;
                                if (href.indexOf("twitter.com") >= 0)
                                    return null;
                                return (
                                    <a
                                        data-id="link"
                                        href={href}
                                        className="q-qwiket-link">
                                        {children}
                                    </a>
                                );
                            },
                        }}
                    />
                </div>
            )}
            {false ? (
                <Markdown
                    data-id={`${dataId}-md`}
                    escapeHtml={false}
                    source={md}
                    renderers={{
                        link: props => {
                            // console.log("renderLink", { props })
                            /* const embedVideo = renderIFrame({ href });
                     if (embedVideo)
                         return embedVideo;
                     else 
                     */
                            const href = props.href;
                            if (href.indexOf("twitter.com") >= 0) return null;
                            return (
                                <a
                                    data-id="link"
                                    href={href}
                                    className="q-qwiket-link">
                                    {children}
                                </a>
                            );
                        },
                        image: imageRenderer,
                    }}
                />
            ) : null}
            <style global jsx>{`
                a{
                     text-decoration:none;
                }
                    .q-full.q-qwiket-main-image{
                    object-fit: cover;
                    margin-top: 20px;
                    position: relative;
                    max-width: 100% !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-column .q-qwiket-main-image{
                    position: relative;
                    max-width: 100% !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-qwiket-main-image-full{

                    max-width: 100% !important;
                    max-height: 100% !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-qwiket-title{
                    font-weight:500;
                    line-height: 1.2;
                    font-size: 1.2rem; 
                    font-family:roboto;
                    text-align: left; 
                    margin-top:10px;
                    cursor:pointer;
                }
                .q-qwiket-title-full{
                    font-weight:500;
                
                    line-height: 1.3; 
                    font-size: 2.0rem; 
                    font-family:roboto;
                    text-align: left; 
                    cursor:pointer;
                    user-select:text;
                }
                .q-qwiket-title-full-zoom{
                    font-weight:500;
                    
                    line-height: 3.2rem;
                    font-size: 2.6rem; 
                    font-family:roboto;
                    text-align: left; 
                    cursor:pointer;
                    user-select:text;
                }
                .q-qwiket-markdown{
                    max-width: 100%;
                    font-size: 1.0rem;
                    line-height: 1.4;
                    overflow: hidden;
                    font-weight: 400;
                    font-family: roboto;
                    text-transform: none !important;
                    user-select: text;
                }
                 .q-column .q-qwiket-markdown{
                    max-width: 100%;
                   // font - size: 1.3rem;
                    line-height: 1.3 !important;
                    overflow: hidden;
                    font-weight: 400;
                    font-family: roboto;
                    text-transform: none !important;
                    user-select: text;
                }
                .q-qwiket-markdown-reshare{
                    width: 100%;
                    //font - size: 1.3rem;
                    line - height: 1.4;
                    overflow: hidden;
                    font-weight: 400;
                    font-family: roboto;
                    background-color: #eee;
                    user-select: text;
                    text-transform: none !important;
                }
               
            
                .q- weak.q-qwiket-markdown{
                    width: 100%;
                    font-size: 1.2rem;
                    line-height: 1.5;
                    overflow: hidden;
                    font-weight: 300;
                    font-family: roboto;

                    user-select: text;
                }
                .q-qwiket-markdown p: last-of-type{
                    margin-block-end: 12px;

                }
                .q-qwiket-markdown p{
                    margin-block-end: 12px;
                    margin-block-start: 12px;
                    width: 100%;
                }
                .q-embed-twitter{
                    display:flex;
                    justify-content:center;
                    margin-block-end: 30px;
                    margin-block-start: 30px;
                    width: 100%;
                }
                .q-qwiket-rollup{
                    display:flex;
                    justify-content:flex-end;
                    font-size:0.7rem;
                    align-items:center;
                    font-weight:500;
                }

                .q-qwiket-a{
                    text-decoration: underline !important;
                    //font - size: 0.9rem;
                    color: ${linkColor} !important;
                    text-align: center;
                }
            
                .q-qwiket-markdown img{
                    margin-bottom: 10px !important;
                    margin-top: 12px !important;
                    max-width: 100%;
                }
                 .q-qwiket-markdown blockquote{
                    margin-left: 0px;
                    margin-right: 8px;
                    padding-left: 10px;
                    line-height: 1.3;
                }
                .q-full{
                    width: 100 %;
                }
                .q-full blockquote{
                    margin-left: 0px;
                    padding-left: 20px;
                    padding-right: 15px;
                    line-height: 1.3;
                    margin-right: 0px;
                }
                .q-column{
                    cursor: pointer;
                }
                .q-column-shaded{
                    opacity: 0.5;
                    cursor: pointer;
                }
                .q-column blockquote{
                    margin-left: 0px;
                    margin-right: 8px;
                    padding-left: 10px;
                    line-height: 1.3;
                }
                blockquote{
                    border-left: 5px solid ${linkColor};
                    margin-block-end: 12px;
                    margin-block-start: 12px;
                    padding-left: 10px;
                    line-height: 1.4;
                }
                .html-body.q-drop{
                    color: ${linkColor} !important;
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 80px;
                    line-height: 64px;
                    padding-right: 10px;
                    margin-bottom: 10px;
                }
                .html-zoom.q-drop{
                    color: ${linkColor} !important;
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 100px;
                    line-height: 78px;
                    padding-right: 10px;
                }
                .q-full strong{
                    font-weight: 500;

                }
                .html-body br{
                    margin - top: 0px;
                    margin - bottom: 0px;
                }
                .q-markdown-wrap{
                    width: 100 %;
                    overflow: hidden;

                }
                .normal-iframe-wrapper{
                    height: 350px;
                }
                .html-zoom.drop{
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 100px;
                    line-height: 78px;
                    padding-right: 10px;
                    color: ${linkColor} !important;
                }
                .html-body.drop{
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 80px;
                    line-height: 64px;
                    padding-right: 10px;
                    color: ${linkColor} !important;
                    margin-bottom: 10px;
                }
                .m_first-letter, .q-drop{
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 72px;
                    line-height: 58px;
                    padding-right: 10px;
                    color: ${linkColor} !important;
                    margin-bottom: 10px;
                }


                `}</style>
        </div>
    );
    return html;
};
export const renderMarkdown = ({
    coreImage,
    blockType,
    dataId,
    md,
    index,
    children,
    theme,
    reshare,
    linkColor,
    dropCap,

    setState,
}) => {
    let state = {};
    let html = null;
    let embeds = null;
    let changed = false;
    if (md.indexOf("undefined") >= 0)
        console.log("renderMArkdown", { blockType, md });
    md = md.replace(/undefined!/gi, "!");
    if (md.indexOf("undefined") >= 0)
        console.log("renderMArkdown2", { blockType, md });
    //console.log("renderMarkdown", blockType)
    try {
        //  md = md.replace(/(^|\s)(#[a-z\d-]+)/ig, `$1 < span class="hashtag" >\\$2</span > `);
        //  md = md.replace(/<a /ig, '<a target="article" ')
        //, className: "q-qwiket-a", target: { url: "_blank" }
        const md2 = md; //linkifyHtml(`<div> ${md}</div > `, { defaultPropocol: 'https' });
        if (md.indexOf("undefined") >= 0)
            console.log("after linkify", { blockType, md2 });
        md = md2;
        const lf = linkify.find(md);
        // console.log("linkify.find", lf);
    } catch (x) {
        console.log(x);
    }

    // md = md ? md.replace(/\n/g, '<br/>') : '';
    if (blockType == "text") {
        // console.log("renderMarkdown1 0", { md, blockType })
    }
    //  if (blockType == 'reacts')
    if (blockType == "text" && dropCap) {
        let c = md.trim().charAt(0);

        if (c != "<" && c != "&") {
            let crest = md.trim().slice(1);

            md = `< p > <span class="q-drop" >${c}</span>${crest}</p > `;
            if (md.indexOf("That was no sweet") >= 0)
                console.log(" rendering dropCap", { md });
        }
    }
    let ret = "";
    if (
        typeof window != "undefined" &&
        (md.indexOf("youtu") >= 0 ||
            md.indexOf("/t.co") >= 0 ||
            md.indexOf("twitter.com"))
    ) {
        // console.log("!!!!!  childo renderMarkdown2", { blockType, md });
        let r = [];
        let bl = processBlock({
            coreImage,
            blockType,
            dataId,
            md,
            index,
            children,
            state,
            setState,
            theme,
        });
        //  console.log("childo processBlock", bl);
        r.push(bl);

        if (r && r.length) {
            // console.log("childo3", r)
            ret = <div key={dataId + "render-block-" + index}>{r}</div>;
        } else
            ret = processBlock({
                coreImage,
                blockType,
                dataId,
                md,
                index,
                children,
                reshare,
                linkColor,
                theme,
            });
    } else {
        ret = processBlock({
            coreImage,
            blockType,
            dataId,
            md,
            index,
            children,
            reshare,
            linkColor,
            theme,
        });
    }

    if (md.indexOf("That was no sweet") >= 0)
        console.log("renderMArkdown AFTER", { ret });
    return ret;
};
const QwiketWrap = styled.div`
    width: 800px;
    margin-top: 60px;
`;
const Image = styled.img`
    width: 500px;
`;
const Label = styled.div`
    width: 120px;
    margin-top: 20px;
`;
const OpenedBodyWrap = styled.div`
    width: 800px;
    margin-top: 60px;
`;
const ClosedBodyWrap = styled.div`
    width: 800px;
    margin-top: 60px;
`;
const ClosedBody = styled.div`
    width: 800px;
    height: 80px;
    overflow: hidden;
`;

const QwiketDisplay = ({ qwiket }) => {
    const [opened, setOpened] = React.useState(false);
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            "aria-controls": `full-width-tabpanel-${index}`,
        };
    }
    const theme = useTheme();
    const [tab, setTab] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };
    let {
        title,
        description,
        sitename,
        author,
        image,
        image_src,
        body,
        type,
        reshare,
        published_time,
        tags,
    } = qwiket;
    let stringBody = body;
    if (typeof body === "string") {
        body = { blocks: [{ blockType: "html", html: body }] };
    } else {
        stringBody = body ? body.blocks.map(p => p.html).join(",") : "";
    }
    let blocks = body ? body.blocks : [];
    console.log("blocks", blocks);
    let qwiketType = "full";
    let html = "";
    let isZoom = false;
    let coreImage = "";
    const linkColor = red[900];
    blocks = blocks.map((p, i) => {
        switch (p.blockType) {
            case "html": // scraped from external page or description block
                // console.log("first letter block:html", type)
                if (!p.html) return;
                // if (type == 'full')
                //    console.log("original htmll", p.html)
                html = p.html
                    .replace(/<p >/g, "<p>")
                    .replace(/<\/p >/g, "</p>");
                html = html
                    .replace(/<p><\/p>/g, "")
                    .replace(/<br>/g, "<br /><br />")
                    .replace(/<p><\/div><\/p>/g, "");

                // html = html.replace(/<\/div>/g, '')

                // if (type == 'full')
                //    console.log("BLOCK2 replace p", html);
                if (qwiketType == "full") {
                    let lw = html.split("<p>");
                    //  console.log("first letter split", { html, lw })
                    if (lw.length > 1) {
                        console.log("first letter ppp");
                        let c = lw[1].trim().charAt(0);

                        if (c != "<" && c != "&") {
                            let crest = lw[1].trim().slice(1);
                            console.log("first letter", { crest, c });
                            lw[1] = `<span class="q-drop"> ${c}</span > ${crest} `;
                            html = lw.join("<p>");
                        } else if (html.indexOf('class="drop"') >= 0) {
                            // console.log("CLASS=DROP");
                            html = html.replace(
                                /class="drop"/g,
                                `class="q-drop" `
                            );
                        }
                    }
                } else {
                    html = html.replace(
                        /class="drop"/g,
                        `class="disabled-drop" `
                    );
                }
                html = `<div id="markdown-shell" class="q-qwiket-md-shell">${html}</div>`;
                // if (type == 'full')
                //    console.log("block2 html:", html);

                html = x(html, isZoom, image);
                //console.log("catedit shtml-pos-x:", shtml);
                if (isZoom) {
                    html = `<div data-id="aaaa" style = "display:flex;flex-direction:column;width:100%" class="${
                        isZoom ? "html-zoom" : "html-body"
                    }" > ${html
                        .replace(/\t/g, ``)
                        .replace(/\n/g, ``)
                        .trim()
                        .replace(
                            /float( *?):( *?)left;/g,
                            `margin-left:auto;margin-right:auto;`
                        )
                        .replace(
                            /float( *?):( *?)right;/g,
                            `margin-left:auto;margin-right:auto;`
                        )}</div> `;
                } else {
                    let replHtml = html
                        .replace(/\t/g, ``)
                        .replace(/\n/g, ``)
                        .trim()
                        .replace(
                            /width( *?):( *?)([A-Za-z0-9]*);?/g,
                            `width:${isZoom ? "500px" : "100%"};`
                        )
                        .replace(
                            /height( *?):( *?)([A-Za-z0-9]*);/g,
                            `height:100%;`
                        )
                        .replace(/width='([A-Za-z0-9 _%]*)'/g, `width='100%'`)
                        .replace(/width="([A-Za-z0-9 _%]*)"/g, `width='100%'`)
                        .replace(
                            /width( *?)=( *)"([A-Za-z0-9 _]*)"/g,
                            `width="100%"`
                        )
                        .replace(
                            /alt="width=([A-Za-z0-9 _]*)"/g,
                            `width="100%"`
                        ) //pjmedia
                        .replace(
                            /height=[",']([A-Za-z0-9 _]*)[",']/g,
                            `height="${isZoom ? "500px" : "100%"}"`
                        )
                        .replace(
                            /height:[",']([A-Za-z0-9 _]*)[",']/g,
                            `minHeight:350px;height:${
                                isZoom ? "500px" : "100%"
                            }`
                        );

                    html = `<div  style="position:relative;display:flex;flex-direction:column;width:100%;height:100%;" class="${
                        isZoom ? "html-zoom" : "html-body"
                    }">${replHtml}</div>`;
                }

                //  if (full)
                // console.log("BLOCK2:", { html, coreImage })
                html = html.replace("&rsquo;", "'");
                return renderMarkdown({
                    coreImage,
                    blockType: p.blockType,
                    md: html,
                    dataId: "markdown-block11",
                    index: i,
                    theme,
                    linkColor,

                    setState: update => {},
                });
        }
        return null;
    });
    let publishedTime = new Date(qwiket.published_time * 1000).toLocaleString();
    let sharedTime = new Date(qwiket.shared_time * 1000).toLocaleString();
    let opts = {
        href: qwiket.url,
    };
    return (
        <div>
            <QwiketWrap>
                <div>
                    <Label>
                        <b>Title:</b>{" "}
                    </Label>
                    {qwiket.title}
                </div>
                <div>
                    <Label>
                        <b>Author:</b>{" "}
                    </Label>
                    {qwiket.author}
                </div>
                <div>
                    <Label>
                        <b>Sitename:</b>
                    </Label>
                    {qwiket.site_name}
                </div>
                <div>
                    <Label>
                        <b>Image:</b>
                    </Label>
                    {qwiket.image}
                </div>
                <div>
                    <Label>
                        <b>Image Source:</b>
                    </Label>
                    {qwiket.image_src}
                </div>
                <Image src={qwiket.image} />
                <br />
                <div>
                    <Label>
                        <b>Description:</b>{" "}
                    </Label>
                    {qwiket.description}
                </div>
                <br />
                <div>
                    <Label>
                        <b>URL:</b>{" "}
                    </Label>
                    <a {...opts} target="_blank">
                        {qwiket.url}
                    </a>
                </div>
                <br />
                <div>
                    <Label>
                        <b>TAGS:</b>{" "}
                    </Label>
                    <a {...opts} target="_blank">
                        {qwiket.tags}
                    </a>
                </div>
                <br />
                <div>
                    <Label>
                        <b>Published Time:</b>
                    </Label>
                    {qwiket.published_time}
                    <br />
                    {publishedTime}
                    <br />
                </div>
                <div>
                    <Label>
                        <b>Shared Time:</b>
                    </Label>
                    {qwiket.shared_time}
                    <br />
                    {sharedTime}
                    <br />
                </div>
                {tags ? (
                    <div>
                        <Label>
                            <b>Tags:</b>
                        </Label>
                        {tags}

                        <br />
                        <br />
                    </div>
                ) : null}
                <Label>
                    <b>Body:</b>
                </Label>
                <Tabs
                    value={tab}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Body with source tabs">
                    <Tab label="Render" {...a11yProps(0)} />
                    <Tab label="Source" {...a11yProps(1)} />
                </Tabs>
                <div>
                    <TabPanel value={tab} index={0}>
                        {opened ? (
                            <OpenedBodyWrap>
                                {blocks}
                                <br />
                                <br />
                                <Button
                                    onClick={() => {
                                        setOpened(false);
                                    }}
                                    variant="contained">
                                    Close
                                </Button>
                            </OpenedBodyWrap>
                        ) : (
                            <ClosedBodyWrap>
                                <ClosedBody>{blocks}</ClosedBody>
                                ...
                                <br />
                                <br />
                                <Button
                                    onClick={() => {
                                        setOpened(true);
                                    }}
                                    variant="contained">
                                    Open
                                </Button>
                            </ClosedBodyWrap>
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        {stringBody}
                    </TabPanel>
                </div>
            </QwiketWrap>
        </div>
    );
};
export default QwiketDisplay;
