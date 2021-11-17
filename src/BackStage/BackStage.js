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
            const sql = "select hb.hId as 'key',hb.*,hd.* from house_baseinfo hb join house_detailinfo hd on hb.hId = hd.hId;";
            new Promise((resolve, reject) =>
            {
                conn.query(sql, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(result);
                });
            }).then(data =>
            {
                res.send(data);
            }).catch(err =>
            {
                throw new Error(err);
            }).finally(() =>
            {
                res.end();
                conn.end();
            });
        });
    };
    UpdateHouseDetail = () =>
    {
        this.app.post('/UpdateHouseDetail', async (req, res) =>
        {
            const { hId, hTitle, hMethod, hRent, isAirCondition, isBed,
                isCloset, isGas, isHeating, isLaundryMachine, isRefrigerator,
                isTelevision, isWaterHeater, isWIFI, hFeature, hLatitude, hLongitude,
            } = req.body;
            const conn = mysql.createConnection(AliDNS);
            const sql = `update house_baseinfo set hTitle ='${hTitle}',hMethod= '${hMethod}',hRent = '${hRent}',hFeature = '${hFeature}' where  hId='${hId}';`;
            const sql2 = `update house_detailinfo set isAirCondition ='${isAirCondition}',isBed='${isBed}',isCloset='${isCloset}',
            isGas='${isGas}',isHeating='${isHeating}',isLaundryMachine='${isLaundryMachine}',
            isRefrigerator='${isRefrigerator}',isTelevision='${isTelevision}',isWaterHeater='${isWaterHeater}',isWIFI='${isWIFI}',
            hLatitude='${hLatitude}',hLongitude='${hLongitude}',Maintain=now() where hId='${hId}';`;
            let p1 = new Promise((resolve, reject) =>
            {
                conn.query(sql, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(result);
                });
            });
            let p2 = new Promise((resolve, reject) =>
            {
                conn.query(sql2, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(result);
                });
            });
            Promise.all([p1, p2]).then((data) =>
            {
                res.send(data[0]);
            }).catch((e) =>
            {
                throw new Error(e);
            }).finally(() =>
            {
                res.end();
                conn.end();
            });
        });
    };
}
