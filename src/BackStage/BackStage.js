import mysql from 'mysql';
import querystring from 'querystring';
import { AliDNS } from '../../index.js';
export default class BackStage
{
    constructor(app)
    {
        this.app = app;
    }
    SelectHouseDetailList = () =>
    {

        this.app.get('/SelectHouseDetailList', async (req, res) =>
        {
            const conn = mysql.createConnection(AliDNS);
            const reqobj = querystring.parse(req.url.split("?")[1]);
            let sqlGetBaseInfo = `select * from house_baseinfo`;
            let sqlGetCarousel = `select * from house_carousel`;
            let sqlGetDetailInfo = `select * from house_detailinfo`;
            let dataObj = new Object();
            let promiseBaseInfo = new Promise((resolve, reject) =>
            {
                conn.query(sqlGetBaseInfo, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(
                        Object.defineProperty(dataObj, "baseInfo", {
                            value: result[0],
                            enumerable: true,
                        })
                    );
                });
            });
            let promiseCarousel = new Promise((resolve, reject) =>
            {
                conn.query(sqlGetCarousel, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(Object.defineProperty(dataObj, "carousel", {
                        value: result,
                        enumerable: true,
                    }));
                });
            });
            let promiseDetailInfo = new Promise((resolve, reject) =>
            {
                conn.query(sqlGetDetailInfo, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(
                        Object.defineProperty(dataObj, "detailInfo", {
                            value: result[0],
                            enumerable: true
                        })
                    );
                });
            });
            Promise.all([promiseBaseInfo, promiseCarousel, promiseDetailInfo])
                .then((resolve) =>
                {
                    res.send(JSON.stringify(dataObj));
                })
                .catch((err) =>
                {
                    throw new Error(err);
                })
                .finally(() =>
                {
                    conn.end();
                    res.end();
                });

        });
    };
}
