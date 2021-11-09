import multiparty from 'multiparty';
import mysql from 'mysql';
import querystring from 'querystring';
import { AliDNS } from '../../index.js';
export default class UserRentList
{
    constructor(app)
    {
        this.app = app;
    }
    AddHouseToUser = () =>
    {
        this.app.post("/AddHouseToUser", (req, res) =>
        {
            new multiparty.Form().parse(req, (err, fields, files) =>
            {
                if (err) throw new Error(err);
                const {
                    uId, hId, orderId, buyer_user_id, totalAmount, originAmount,
                    sendPayDate, trade_no, checkInDate, checkOutDate,
                } = fields;
                const conn = mysql.createConnection(AliDNS);
                const sql = `
                insert into user_house_list(uId, hId, orderId, buyer_user_id,
                totalAmount, sendPayDate, trade_no, checkInDate, checkOutDate,originAmount,isEnd)
                values ('${uId}','${hId}','${orderId}','${buyer_user_id}','${totalAmount}','${sendPayDate}',
                '${trade_no}','${checkInDate}','${checkOutDate}','${originAmount}','${0}')`;

                const sqlUpdate = `update house_baseinfo set isRented = 1 where hId = '${hId}'`;

                const pInsert = new Promise((resolve, reject) =>
                {
                    conn.query(sql, (err, res) =>
                    {
                        if (err) reject(err);
                        resolve(
                            res
                        );
                    });
                });
                const pUpdate = new Promise((resolve, reject) =>
                {
                    conn.query(sqlUpdate, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(
                            result
                        );
                    });
                });
                Promise.all([pInsert, pUpdate]).then((data) =>
                {
                    if (data[0].affectedRows >= 1 && data[1].affectedRows >= 1)
                    {
                        res.send(data[0]);
                    }
                }).catch((err) =>
                {
                    throw new Error(err);
                }).finally(() =>
                {
                    res.end();
                    conn.end();
                });
            });
        });
    };
    GetCurrentUserHouseRentList = () =>
    {
        this.app.get("/GetCurrentUserHouseRentList", (req, res) =>
        {
            const { uId, isEnd } = querystring.parse(req.url.split("?")[1]);
            const sql = `select * from user_house_list where uId='${uId}' and isEnd=${isEnd};`;
            const conn = mysql.createConnection(AliDNS);
            new Promise((resolve, reject) =>
            {
                conn.query(sql, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(
                        result
                    );
                });
            }).then((data) =>
            {
                res.send(data);
            }).catch((err) =>
            {
                throw new Error(err);
            }).finally(() =>
            {
                res.end();
                conn.end();
            });
        });
    };
    RenewalOrder = () =>
    {
        this.app.post('/RenewalOrder', (req, res) =>
        {
            new multiparty.Form().parse(req, (err, fields, files) =>
            {
                if (err) throw new Error(err);
                const { id, hId, oldOrderId, newCheckOutDate, newTotalAmount,
                    orderId, totalAmount, trade_no, checkInDate, checkOutDate,
                } = fields;
                const conn = mysql.createConnection(AliDNS);

                const sql = `update user_house_list
                set checkOutDate = '${newCheckOutDate}',
                totalAmount='${newTotalAmount}'
                where orderId='${oldOrderId}'`;

                const sqlInsert = `insert into renewal_order_list(belongOrder, hId, orderId,
                    totalAmount, trade_no, checkInDate, checkOutDate)
                    VALUES('${id}','${hId}','${orderId}','${totalAmount}','${trade_no}','${checkInDate}','${checkOutDate}')`;
                let pAlter = new Promise((resolve, reject) =>
                {
                    conn.query(sql, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
                let pInsert = new Promise((resolve, reject) =>
                {
                    conn.query(sqlInsert, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(
                            result
                        );
                    });
                });
                Promise.all([pAlter, pInsert]).then((data) =>
                {
                    res.send(data[1]);
                }).catch((err) =>
                {
                    throw new Error(err);
                }).finally(() =>
                {
                    res.end();
                    conn.end();
                });
            });
        });
    };
    GetUserRenewalOrderList = () =>
    {
        this.app.get('/GetUserRenewalOrderList', (req, res) =>
        {
            const reqObj = querystring.parse(req.url.split('?')[1]);
            const conn = mysql.createConnection(AliDNS);
            let sql = '';
            if (reqObj.checkInDate)
            {
                sql = `select id as 'key', belongOrder, hb.hTitle,ro.hId, orderId, totalAmount, trade_no, checkInDate, checkOutDate
                from renewal_order_list ro
                join house_baseinfo hb on hb.hId = ro.hId
                where belongOrder='${reqObj.id}' and checkInDate > '${reqObj.checkInDate}' and checkOutDate <= '${reqObj.checkOutDate}';`;
            } else
            {
                sql = `select id as 'key', belongOrder, hb.hTitle,ro.hId, orderId, totalAmount, trade_no, checkInDate, checkOutDate
                from renewal_order_list ro
                join house_baseinfo hb on hb.hId = ro.hId
                where belongOrder='${reqObj.id}';`;
            }


            new Promise((resolve, reject) =>
            {
                conn.query(sql, (err, result) =>
                {
                    if (err) reject(err);
                    resolve(
                        result
                    );
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
    UserCheckOut = () =>
    {
        this.app.post('/UserCheckOut', (req, res) =>
        {
            new multiparty.Form().parse(req, (err, fields, files) =>
            {
                if (err) throw new Error(err);
                const conn = mysql.createConnection(AliDNS);
                const { id, hId, uId, trade_no, orderId } = fields;
                const sql = `
                update user_house_list set isEnd = true where hId='${hId}' and uId='${uId}' and trade_no='${trade_no}' and orderId = '${orderId}';
                `;
                const sqlRenewalList = `
                delete from renewal_order_list where belongOrder='${id}';
                `;
                const sqlUpdateHouse = `
                update house_baseinfo set isRented = 0 where hid = '${hId}'
                `;

                const p1 = new Promise((resolve, reject) =>
                {
                    conn.query(sqlRenewalList, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
                const p2 = new Promise((resolve, reject) =>
                {
                    conn.query(sql, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
                const p3 = new Promise((resolve, reject) =>
                {
                    conn.query(sqlUpdateHouse, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
                Promise.all([p1, p2, p3]).then((data) =>
                {
                    if (data[1].affectedRows >= 1)
                    {
                        res.send(data[1]);
                    }
                }).catch((err) =>
                {
                    throw new Error(err);
                }).finally(() =>
                {
                    res.end();
                    conn.end();
                });
            });
        });
    };
}
