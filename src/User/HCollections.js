import mysql from 'mysql';
import querystring from 'querystring';
import { AliDNS } from '../../index.js';
import App from '../App/App.js';

const { app } = App.GetInstance();

app.get('/CollectHouse', (req, res) =>
{
    const conn = mysql.createConnection(AliDNS);
    const { id, hId } = querystring.parse(req.url.split("?")[1]);
    const sql = `insert into user_collections(user, hId) values ('${id}','${hId}')`;
    let promise = new Promise((resolve, reject) =>
    {
        conn.query(sql, (err, result) =>
        {
            if (err) reject(err);
            resolve(result);
        });
    });
    promise
        .then(data =>
        {
            res.send(JSON.stringify(data));
        })
        .catch((err) =>
        {
            throw new Error(err);
        })
        .finally(() =>
        {
            res.end();
            conn.end();
        });
});

app.get('/DeleteHouseFromCollections', (req, res) =>
{
    const conn = mysql.createConnection(AliDNS);
    const { id, hId } = querystring.parse(req.url.split("?")[1]);
    const sql = `delete from user_collections where user = '${id}' and hId = '${hId}'`;
    let promise = new Promise((resolve, reject) =>
    {
        conn.query(sql, (err, result, fileds) => //第三个参数是查询结果的字段信息
        {
            if (err) reject(err);
            resolve(result);
        });
    });
    promise
        .then(data =>
        {
            res.send(data);
        })
        .catch(err =>
        {
            throw new Error(err);
        })
        .finally(() =>
        {
            res.end();
            conn.end();
        });
});

app.get('/GetAllUserCollections', (req, res) =>
{
    const conn = mysql.createConnection(AliDNS);
    const { id } = querystring.parse(req.url.split("?")[1]);
    const sql = `select hb.*,hd.hLatitude,hd.hLongitude from user_collections uc
            join house_baseinfo hb on uc.hId = hb.hId join house_detailinfo hd on hb.hId = hd.hId
            where user='${id}'`;
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
    }).catch((err) =>
    {
        throw new Error(err);
    }).finally(() =>
    {
        conn.end();
        res.end();
    });

});
