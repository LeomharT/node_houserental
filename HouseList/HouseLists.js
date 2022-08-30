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
                        enumerable: true,   //只有设置该对象的属性是可枚举的,才能被迭代器循环和被查看(就是能够看到这个属性在对象上.🐂)
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
    GetHouseVrSceneInfo = () =>
    {
        this.app.get("/GetHouseVrSceneInfo", (req, res) =>
        {
            let reqObj = querystring.parse(req.url.split("?")[1]);
            const { HouseId, SceneId } = reqObj;
            const conn = mysql.createConnection(AliDNS);
            let sqlGetVrImg = `select hvr.hId,hvrs.sceneId,hvrs.sceneName,hvri.id as imgId, hvri.url
            from house_vr hvr join house_vrscene hvrs on hvr.sceneId=hvrs.sceneId join house_vrimg hvri on hvrs.sceneId=hvri.sceneId
            where hvr.hId='${HouseId}' and hvrs.sceneId='${SceneId} order by hvri.id'`;
            let sqlGetPositions = `select hs.sceneId,hs.sceneName,hp.x,hp.y,hp.z,hp.toSceneId,hp.toSceneName from house_vrscene hs
            join house_vrpositions hp on hs.sceneId = hp.sceneId where hs.sceneId='${SceneId}';`;
            let resultObj = new Object();
            let promiseVRImg = new Promise((resolve, reject) =>
            {
                conn.query(sqlGetVrImg, (err, result) =>
                {
                    if (err) reject(err);
                    let imgUrlArr = new Array();
                    // console.log(result);
                    for (let r of result)
                    {
                        imgUrlArr.push({ imgId: r.imgId, url: r.url });
                    }
                    Object.defineProperty(resultObj, 'hId', {
                        value: result[0].hId,
                        enumerable: true
                    });
                    Object.defineProperty(resultObj, "sceneId", {
                        value: result[0].sceneId,
                        enumerable: true
                    });
                    Object.defineProperty(resultObj, "sceneName", {
                        value: result[0].sceneName,
                        enumerable: true
                    });
                    Object.defineProperty(resultObj, 'urls', {
                        value: imgUrlArr,
                        enumerable: true
                    });
                    resolve(resultObj);
                });
            });
            let promiseVrPosition = new Promise((resolve, reject) =>
            {
                conn.query(sqlGetPositions, (err, result) =>
                {
                    if (err) reject(err);
                    let positingArr = new Array();
                    for (let r of result)
                    {
                        positingArr.push({
                            x: r.x,
                            y: r.y,
                            z: r.z,
                            toSceneId: r.toSceneId,
                            toSceneName: r.toSceneName
                        });
                    }
                    Object.defineProperty(resultObj, 'positions', {
                        value: positingArr,
                        enumerable: true
                    });
                    resolve(
                        resultObj
                    );
                });
            });
            Promise.all([promiseVRImg, promiseVrPosition])
                .then(result =>
                {
                    res.send(result[0]);
                })
                .catch(err =>
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
    GetHouseVrSceneArray = () =>
    {
        this.app.get("/GetHouseVrSceneArray", (req, res) =>
        {
            let reqObj = querystring.parse(req.url.split('?')[1]);
            const { HouseId } = reqObj;
            const conn = mysql.createConnection(AliDNS);
            let sql = `select hv.hId,hs.sceneId,hs.sceneName from house_vr hv
            join house_vrscene hs on hv.sceneId = hs.sceneId where hv.hId='${HouseId} order by hs.sceneId'`;
            let promise = new Promise((resolve, reject) =>
            {
                conn.query(sql, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(
                        Array().concat(result)
                    );
                });
            });
            promise
                .then(result =>
                {
                    res.send(result);
                }).catch(err =>
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
