import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import querystring from 'querystring';
import multiparty from 'multiparty';
import { AliDNS } from '../../index.js';


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
            const connection = mysql.createConnection(AliDNS);
            connection.connect();
            connection.query(sql, (err, row) =>
            {
                if (err) throw new Error(err);
                res.send(row);
                connection.end();
                res.end();
            });
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
                const conn = mysql.createConnection(AliDNS);
                conn.connect();
                conn.query(sql, (err, row) =>
                {
                    if (err) throw new Error(err);
                    res.send(row);
                    conn.end();
                    res.end();
                });
            }
        });
    };
    GetHouseParams = () =>
    {
        this.app.post("/HouseParams", async (req, res) =>
        {
            const conn = mysql.createConnection(AliDNS);
            let allPromise = new Array();
            for (let i of [1, 2, 3, 4, 5, 6, 7, 8])
            {
                let promise = new Promise((resolve, reject) =>
                {
                    conn.query(`select hp.params_id,hp.params_name,params_label,hpe.params_enums
                    from house_params hp
                    left join house_params_enums hpe on hp.params_id = hpe.params_id
                    where hp.params_id=${i} order by hpe.id`, (err, result) =>
                    {
                        if (err) reject(err);
                        let params_enums = new Array();
                        for (let r of result)
                        {
                            params_enums.push(r.params_enums);
                        }
                        resolve(
                            {
                                params_id: result[0].params_id,
                                params_name: result[0].params_name,
                                params_label: result[0].params_label,
                                params_enums
                            }
                        );
                    });
                });
                allPromise.push(promise);
            }
            conn.end();
            Promise.all(allPromise).then((resArr) =>
            {
                res.send(resArr);
                res.end();
            });
        });
    };
}




export default EditUserInfo;
