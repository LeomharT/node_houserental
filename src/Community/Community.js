import mysql from 'mysql';
import querystring from 'querystring';
import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';
import multer from 'multer';
import { AliDNS } from '../../index.js';

export default class Community
{
    constructor(app)
    {
        this.app = app;
    }
    UploadArticleImg = () =>
    {
        //因为最终是在index.js里运行,所以得相对index.js路径哦
        const uploader = multer({ dest: './img/ArticleImg' });
        //前端的字段名必须一致uploader.array('aimgs')
        this.app.post('/UploadArticleImg', uploader.array('aimgs'), (req, res) =>
        {
            const { files } = req;
            const resultObj = new Object();
            const fileArr = new Array();
            Object.defineProperty(resultObj, 'errno', {
                enumerable: true,
                value: 0
            });
            for (let f of files)
            {
                const extName = path.extname(f.originalname);
                const filePath = f.path;
                const fileName = f.filename + extName;
                fs.rename(filePath, path.join(path.dirname(filePath), fileName), (err) =>
                {
                    if (err) throw new Error(err);
                });
                fileArr.push({ url: `http://localhost:3065/img/ArticleImg/${fileName}` });
            }
            Object.defineProperty(resultObj, 'data', {
                enumerable: true,
                value: fileArr
            });
            res.send(resultObj);
            res.end();
        });
    };
    DeleteUploadeImgs = () =>
    {
        this.app.post("/DeleteUploadeImgs", (req, res) =>
        {
            const formData = new multiparty.Form();
            formData.parse(req, (err, fields, files) =>
            {
                if (err) throw new Error(err);
                const { imgResult } = fields;
                for (let i of JSON.parse(imgResult[0]))
                {
                    const path = i.url.replace("http://localhost:3065/", "./");
                    try
                    {
                        if (fs.existsSync(path))
                        {
                            console.log(path);
                            fs.rm(path, { recursive: true }, (err) =>
                            {
                                if (err) throw new Error(err);
                            });
                        }
                    } catch (err)
                    {
                        throw new Error(err);
                    }
                }
            });
        });
    };
    PostArticle = () =>
    {
        this.app.post('/PostArticle', (req, res) =>
        {
            const formData = new multiparty.Form();
            formData.parse(req, (err, fields, files) =>
            {
                if (err) throw new Error(err);
                const { avatar, postdate, uId, user, title, adverting, content, lilked, comment } = fields;
                const sql = `insert into you_community(avatar, postdate, uId, user, title, advertimg, content, liked, comment)
                values ('${avatar[0]}','${postdate[0]}','${uId[0]}','${user[0]}',
                '${title[0]}','${adverting[0]}','${content[0]}','${lilked[0]}',${comment[0]})`;
                const conn = mysql.createConnection(AliDNS);
                new Promise((resolve, reject) =>
                {
                    conn.query(sql, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(
                            result
                        );
                    });
                }).then((data) =>
                {
                    res.send(data);
                }).catch((err) =>
                {
                    throw new Error(err);
                }).finally(() =>
                {
                    conn.end();
                    res.end();
                });
            });
        });
    };
    GetArticles = () =>
    {
        this.app.get("/GetArticles", (req, res) =>
        {
            const sql = 'select * from you_community;';
            const conn = mysql.createConnection(AliDNS);
            new Promise((resolve, reject) =>
            {
                conn.query(sql, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(
                        result
                    );
                });
            }).then((data) =>
            {
                res.send(data);
            }).catch((err) =>
            {
                throw new Error(err);
            }).finally(() =>
            {
                conn.end();
                res.end();
            });
        });
    };
}
