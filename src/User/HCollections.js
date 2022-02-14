import { randomUUID } from 'crypto';
import mysql, { createConnection } from 'mysql';
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
    const { id, folderId } = querystring.parse(req.url.split("?")[1]);
    console.log(folderId);
    const sql = `select hb.*,hd.hLatitude,hd.hLongitude from user_collections uc
            join house_baseinfo hb on uc.hId = hb.hId join house_detailinfo hd on hb.hId = hd.hId
            where user='${id}' and folderID = ${folderId}`;
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

app.post('/CreateNewUserCollectionFolder', async (req, res) =>
{
    const { folderName, uId } = req.body;

    const conn = createConnection(AliDNS);

    const sql = `insert into user_collection_folder(folderID, folderName, userID, createDate) VALUES
    (
        '${randomUUID()}','${folderName}','${uId}',now()
    );`;
    let response = new Promise((resolve, reject) =>
    {
        conn.query(sql, (err, result) =>
        {
            if (err) reject(err);
            resolve(result);
        });
    });
    res.send(await response);
    res.end();
    conn.end();
});

app.get('/GetUserAllFolders', async (req, res) =>
{
    const { uId } = querystring.parse(req.url.split('?')[1]);
    const conn = mysql.createConnection(AliDNS);
    const sql = `select * from user_collection_folder where userID='${uId}';`;
    let response = new Promise((resolve, reject) =>
    {
        conn.query(sql, (err, result) =>
        {
            if (err) reject(err);
            resolve(result);
        });
    });
    res.send(await response);
    res.end();
    conn.end();
});

app.post("/DeleteUserCollectFolder", async (req, res) =>
{
    const { id, folderId, uId } = req.body;

    const conn = createConnection(AliDNS);

    const sql = `delete  from user_collection_folder where id='${id}' and  folderID='${folderId}' and userID='${uId}';`;

    let response = new Promise((resolve, reject) =>
    {
        conn.query(sql, (err, result) =>
        {
            if (err) reject(err);
            resolve(result);
        });
    });
    res.send(await response);
    res.end();
    conn.end();
});
