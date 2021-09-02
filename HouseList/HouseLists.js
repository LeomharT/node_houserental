import mysql from 'mysql';
import querystring from 'querystring';
import { AliDNS } from '../index.js';


export default class HouseLists
{
    constructor(app)
    {
        this.app = app;
    }

    GetHouseExhibitList = () =>
    {
        this.app.post("/GetHouseExhibitList", (req, res) =>
        {
            const conn = mysql.createConnection(AliDNS);
            let sql = "select * from house_baseinfo;";
            conn.query(sql, (err, result) =>
            {
                if (err) throw new Error(err);
                res.send(result);
                conn.end();
                res.end();
            });
        });
    };
    GetHouseDetailInfo = () =>
    {
        this.app.get('/GetHouseDetailInfo', async (req, res) =>
        {
            const conn = mysql.createConnection(AliDNS);
            const reqobj = querystring.parse(req.url.split("?")[1]);
            const { hId } = reqobj;
            let sqlGetBaseInfo = `select * from house_baseinfo where hId = ${hId}`;
            let sqlGetCarousel = `select * from house_carousel where hId = ${hId}`;
            let sqlGetDetailInfo = `select * from house_detailinfo where hId = ${hId}`;
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
                        enumerable: true,   //只有设置该对象的属性是可枚举的,才能被迭代器循环和被查看(就是能够看到这个属性在对象上🐂)
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
    GetHouseVrScene = () =>
    {
        this.app.get("/GetHouseVrScene", async (req, res) =>
        {
            let reqObj = querystring.parse(req.url.split("?")[1]);
            const { HouseId, SceneId } = reqObj;
            console.log(HouseId, SceneId);
            res.send(JSON.stringify("ok"));
            res.end();
        });
    };
}
