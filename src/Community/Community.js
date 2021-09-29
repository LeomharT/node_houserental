import mysql from 'mysql';
import querystring from 'querystring';
import multiparty from 'multiparty';
import multer from 'multer';
import { AliDNS } from '../../index.js';

export default class Community
{
    constructor(app)
    {
        this.app = app;
    }
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
