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
            const conn = mysql.createConnection(AliDNS);
            const sql = ``;
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
}
