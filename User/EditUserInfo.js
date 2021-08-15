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
        this.app.get("/getProvince", (req, res) =>
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
        });
    };
    InitCity = () =>
    {
        this.app.get("/initCity", (req, res) =>
        {
            const reqobj = querystring.parse(req.url.split('?')[1]);
            if (reqobj.T_region_NAME)
            {
                console.log(reqobj);
                let sql = `select * from t_region where PARENT_ID=(select T_region_ID from t_region where T_region_NAME='${reqobj.T_region_NAME}')`;
                const conn = mysql.createConnection(DNS);
                conn.connect();
                conn.query(sql, (err, row) =>
                {
                    if (err) throw new Error(err);
                    res.send(row);
                });
            }
        });
    };

}




export default EditUserInfo;
