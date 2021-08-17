import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import querystring from 'querystring';
import multiparty from 'multiparty';
import { DNS } from '../index.js';


class EditUserInfo
{
    constructor(app)
    {
        this.app = app;
    }
    GetProvince = () =>
    {
        this.app.get("/Province", (req, res) =>
        {
            const reqobj = querystring.parse(req.url.split('?')[1]);
            let sql = "select * from t_region where PARENT_ID=1";
            if (reqobj.PARENT_ID)
            {
                sql = `select * from t_region where PARENT_ID=${reqobj.PARENT_ID}`;
            }
            const connection = mysql.createConnection(DNS);
            connection.connect();
            connection.query(sql, (err, row) =>
            {
                if (err) throw new Error(err);
                res.send(row);
            });
            connection.end();
            res.end();
        });
    };
    InitCity = () =>
    {
        this.app.get("/InitCity", (req, res) =>
        {
            const reqobj = querystring.parse(req.url.split('?')[1]);
            if (reqobj.T_region_NAME)
            {
                let sql = `select * from t_region where PARENT_ID=(select T_region_ID from t_region where T_region_NAME='${reqobj.T_region_NAME}')`;
                const conn = mysql.createConnection(DNS);
                conn.connect();
                conn.query(sql, (err, row) =>
                {
                    if (err) throw new Error(err);
                    res.send(row);
                });
            }
            conn.end();
            res.end();
        });
    };
    GetHouseParams = () =>
    {
        this.app.get("/HouseParams", async (req, res) =>
        {
            let sqlRegion = "select hpe.params_enums from house_params hp left join house_params_enums hpe on hp.params_id = hpe.params_id";
            const conn = mysql.createConnection(DNS);
            let promiseRegion = new Promise((resolve, reject) =>
            {
                conn.query(sqlRegion, (err, result) =>
                {
                    if (err) reject(err);
                    let region = [];
                    for (let r of result)
                    {
                        region.push(r.params_enums);
                    }
                    resolve(region);
                    conn.end();
                });
            });
            let obj = { "1": await promiseRegion };
            res.send(obj);
            res.end();
        });
    };
}




export default EditUserInfo;
