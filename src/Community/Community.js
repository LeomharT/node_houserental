import cheerio from 'cheerio';
import fs from 'fs';
import multer from 'multer';
import multiparty from 'multiparty';
import mysql from 'mysql';
import path from 'path';
import querystring from 'querystring';
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
            formData.parse(req, async (err, fields, files) =>
            {
                if (err) throw new Error(err);
                const { postdate, uId, title, adverting, content, lilked, comment } = fields;
                const sql = `insert into you_community(postdate, uId, title, advertimg, content, liked, comment)
                values ('${postdate[0]}','${uId[0]}','${title[0]}','${adverting[0]}','${content[0]}','${lilked[0]}',${comment[0]})`;
                const conn = mysql.createConnection(AliDNS);
                let pInsert = new Promise((resolve, reject) =>
                {
                    conn.query(sql, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(
                            result
                        );
                    });
                });
                res.send(await pInsert);

                const { insertId } = await pInsert;
                const absPath = path.resolve('./') + '/img/ArticleImg/';
                const $ = cheerio.load(content[0].toString());


                if (!fs.existsSync(absPath + insertId))
                {
                    fs.mkdirSync(absPath + insertId);
                }
                for (let i = 0; i < $('img').length; i++)
                {
                    let { src } = $("img")[i.toString()].attribs;
                    let fileName = src.substr(src.lastIndexOf('/') + 1);
                    let newPath = path.join(absPath + insertId, fileName);
                    fs.renameSync(absPath + fileName, newPath);
                }
                for (let f of fs.readdirSync('./img/ArticleImg'))
                {
                    if (fs.statSync(path.join(absPath, f)).isFile())
                    {
                        fs.rmSync(path.join(absPath, f), { force: true });
                    }
                }

                let sqlSelContent = `select * from you_community where id = '${insertId}';`;
                let dataRes = new Promise((resolve, reject) =>
                {
                    conn.query(sqlSelContent, (err, content) =>
                    {
                        if (err) reject(err);
                        resolve(
                            content[0]
                        );
                    });
                });

                let { content: c } = await dataRes;
                const $Alter = cheerio.load(c.toString());
                let regex = /<\/?!?(html|head|body)[^>]*>/g;
                let regey = /img\/ArticleImg/g;
                let newContent = $Alter.html().replace(regey, `img/ArticleImg/${insertId}`).replace(regex, '');
                let sqlUpdate = `update you_community set content = '${newContent}' where id='${insertId}'`;
                let pUpdate = new Promise((resolve, reject) =>
                {
                    conn.query(sqlUpdate, (err, update) =>
                    {
                        if (err) reject(err);
                        resolve(
                            update
                        );
                    });
                });
                res.end();
                conn.end();
            });
        });
    };
    GetArticles = () =>
    {
        this.app.get("/GetArticles", (req, res) =>
        {
            const { id, uId } = querystring.parse(req.url.split("?")[1]);
            let sql = '';
            if (id)
            {
                sql = `select id, postdate, uId, title,  content, liked, comment from you_community where id = ${id};`;
            } else if (uId)
            {
                sql = `select id, postdate, uId, title, advertimg, liked, comment from you_community where uId = '${uId}';`;
            } else
            {
                sql = 'select id, postdate, uId, title, advertimg, liked, comment from you_community;';
            }
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
    PostArticleComment = () =>
    {
        this.app.post('/PostArticleComment', (req, res) =>
        {
            const formData = new multiparty.Form();
            formData.parse(req, (err, fields, files) =>
            {
                if (err) throw new Error(err);
                const { hId, content, images, parentId, commentDate, uId } = fields;
                let imgStr = '';
                if (images)
                {
                    imgStr = images.join("-lzy-");
                }
                const conn = mysql.createConnection(AliDNS);
                const sql = `insert into you_comment(hId, content, images, parentId, commentDate, uId)
                values ('${hId[0]}','${content[0]}','${imgStr === '' ? null : imgStr}','${parentId[0]}','${commentDate[0]}','${uId[0]}');`;
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
                    res.end();
                    conn.end();
                });
            });
        });
    };
    GetArticleComment = () =>
    {
        this.app.get("/GetArticleComment", (req, res) =>
        {
            const conn = mysql.createConnection(AliDNS);
            let { hId, parentId } = querystring.parse(req.url.split("?")[1]);
            let sql = `select * from you_comment where hId=${hId} and parentId=${parentId}`;
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
            }).catch((e) =>
            {
                throw new Error(e);
            }).finally(() =>
            {
                conn.end();
                res.end();
            });
        });
    };
    DeleteArticle = () =>
    {
        this.app.get('/DeleteArticle', (req, res) =>
        {
            const { id } = querystring.parse(req.url.split("?")[1]);
            const sqlcomment = `delete from you_comment where hid = ${id}`;
            const sql = `delete  from you_community where id =${id}`;
            const conn = mysql.createConnection(AliDNS);
            let p1 = new Promise((resolve, reject) =>
            {
                conn.query(sql, (err, values) =>
                {
                    if (err) reject(err);
                    resolve(
                        values
                    );
                });
            });
            let p2 = new Promise((resolve, reject) =>
            {
                conn.query(sqlcomment, (err, values) =>
                {
                    if (err) reject(err);
                    resolve(
                        values
                    );
                });
            });
            if (fs.existsSync(`./img/ArticleImg/${id}`))
            {
                fs.rmSync(`./img/ArticleImg/${id}`, { recursive: true });
            }
            Promise.all([p1, p2]).then((data) =>
            {
                res.send(data[0]);
            }).catch((err) =>
            {
                throw new Error(err);
            }).finally(() =>
            {
                res.end();
                conn.end();
            });
        });
    };
}
