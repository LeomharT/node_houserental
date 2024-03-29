import mysql from 'mysql';
import querystring from 'querystring';
import { AliDNS } from '../../index.js';
import App from '../App/App.js';


const { app } = App.GetInstance();

app.post('/AddRepairOrder', (req, res) =>
{
    const { body: form } = req;
    const conn = mysql.createConnection(AliDNS);
    const sql = `insert into repair_orders(repair_houseId,
            repair_userId, repair_phone, repair_time, repair_item, repair_detail, repair_state,repair_name)
            values('${form.repair_hId}','${form.repair_userId}','${form.repair_phone}',
            '${form.repair_time}','${JSON.parse(form.repair_item).join(',')}','${form.repair_detail}',
            '${form.repair_state}','${form.repair_name}'
            );`;
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
        conn.end();
        res.end();
    });
});

app.post("/GetRepairOrders", (req, res) =>
{
    const { body } = req;
    const conn = mysql.createConnection(AliDNS);
    let sql = '';
    if (body.uId)
    {
        sql = `
                select ro.*,ro.id as 'key',hb.hTitle as repair_house
                from repair_orders ro join house_baseinfo hb on ro.repair_houseId = hb.hId
                where ro.repair_userId = '${body.uId}';
                `;
    } else
    {
        sql = `
                select ro.*,ro.id as 'key',hb.hTitle as repair_house
                from repair_orders ro join house_baseinfo hb on ro.repair_houseId = hb.hId;
                `;
    }
    let p_select = new Promise((resolve, reject) =>
    {
        conn.query(sql, (err, result) =>
        {
            if (err) reject(err);
            resolve(result);
        });
    });
    p_select.then(data =>
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

app.get("/CompleteRepairOrder", (req, res) =>
{
    const reqObj = querystring.parse(req.url.split("?")[1]);
    const conn = mysql.createConnection(AliDNS);
    const sql = `update repair_orders set repair_state = '关闭' where  id ='${reqObj.id}'`;
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

app.get('/DeleteRepairOrder', (req, res) =>
{
    const reqObj = querystring.parse(req.url.split("?")[1]);
    const conn = mysql.createConnection(AliDNS);
    const sql = `delete from repair_orders where id ='${reqObj.id}'`;
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

app.get('/UpdateRepairOrder', (req, res) =>
{
    const reqObj = querystring.parse(req.url.split("?")[1]);
    const conn = mysql.createConnection(AliDNS);
    const sql = `update repair_orders set repair_state='${reqObj.state}' where id  ='${reqObj.id}';`;
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
