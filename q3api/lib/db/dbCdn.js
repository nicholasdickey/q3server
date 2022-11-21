//require("dotenv").config();
//const slugify = require("slugify");
import { l, chalk, microtime, ds } from "../common.js";
import { dbGetQuery, dbLog, slugify } from "../db.js";
import {UploadClient} from '@uploadcare/upload-client'
const publicKey = process.env.CDNKEY
const init = async ({ threadid, sessionid, username, dbServerName, input }) => {
    let sql, result, rows;
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    let { image } = input;
    if (!image)
        return {
            success: false,
            msg: "no image specified",
        };
    sql = `SELECT * from pov_v10_cdn where image_src='${image}'`;
    rows = await query(`SELECT * from pov_v10_cdn where image_src=?`, [image]);
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (rows && rows.length) {
        l("found cdn");
        return {
            success: true,
            exist: true,
            image_src: image,
            image: rows[0]["image"],
        };
    }
    const client = new UploadClient({ publicKey })
    const file=await client.uploadFile(image);
    const tgtImage=`https://ucarecdn.com/${file.uuid}/`;
    l(chalk.red.bold("NEW CDN:",file.uuid))
   /* let extw = image.split(".");
    console.log("!!!!!!!!!!!!!!!! extw", JSON.stringify(extw), image);
    let ext = extw[extw.length - 1];
    let name = extw
        .slice(0, extw.length - 1)
        .join("_")
        .replace(/ /g, "_")
        .replace(/https:/g, "")
        .replace(/http:/g, "")
        .replace(/\//g, "");
    ext = ext.split("?")[0];

    const tgtImage = `/cdn/x/${slugify(name, { lower: true })}.${ext}`;*/
    l("tgtImage", tgtImage);
    sql = `INSERT INTO pov_v10_cdn (image,image_src,status) VALUES ('${tgtImage}','${image}',0)`;
    result = await query(
        `INSERT INTO pov_v10_cdn (image,image_src,status) VALUES (?,?,0)`,
        [tgtImage, image]
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            result ? JSON.stringify(result, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (result && result.affectedRows) {
        return {
            success: true,
            image_src: image,
            image: tgtImage,
        };
    }
    return { success: false, result };
};
const getImageSrc = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
    input,
}) => {
    let sql, result, rows;
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    let { image } = input;
    sql = `SELECT * from pov_v10_cdn where image='${image}'`;
    rows = await query(`SELECT * from pov_v10_cdn where image=?`, [image]);
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (rows && rows.length) {
        return {
            success: true,
            image_src: rows[0]["image_src"],
        };
    }
    return { success: false };
};
const updateStatus = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
    input,
}) => {
    let sql, result, rows;
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    let { image, status } = input;
    sql = `SELECT * from pov_v10_cdn where image='${image}'`;
    rows = await query(`SELECT * from pov_v10_cdn where image=?`, [image]);
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (rows && rows.length) {
        sql = `UPDATE pov_v10_cdn set status=${status}, last_cdn=now() where image='${image}'`;
        l(chalk.green(sql));
        result = await query(
            `UPDATE pov_v10_cdn set status=?, last_cdn=now() where image=?`,
            [status, image]
        );
        await dbLog({
            show: false,
            type: "SQL",
            body: `{server:${dbServerName},sql:${sql}, res:${
                result ? JSON.stringify(result, null, 4) : "null"
            }}`,
            threadid,
            sessionid,
            username,
        });
        if (result && result.affectedRows) {
            return {
                success: true,
            };
        }
    }
    return { success: false, result };
};
const getOldLoaded = async ({
    threadid,
    sessionid,
    username,
    dbServerName,
    input,
}) => {
    let sql, result, rows;
    let query = await dbGetQuery("povdb", threadid, dbServerName);
    let { seconds } = input;
    sql = `SELECT * from pov_v10_cdn where UNIX_TIMESTAMP(last_cdn)<UNIX_TIMESTAMP(now())-${seconds} and status=1 limit 100`;
    rows = await query(
        `SELECT * from pov_v10_cdn where UNIX_TIMESTAMP(last_cdn)<UNIX_TIMESTAMP(now())-${seconds} and status=1 limit 100`
    );
    await dbLog({
        show: false,
        type: "SQL",
        body: `{server:${dbServerName},sql:${sql}, res:${
            rows ? JSON.stringify(rows, null, 4) : "null"
        }}`,
        threadid,
        sessionid,
        username,
    });
    if (rows && rows.length) {
        return {
            success: true,
            rows,
        };
    }
    return { success: false };
};
export default {
    init,
    getImageSrc,
    updateStatus,
    getOldLoaded,
};
