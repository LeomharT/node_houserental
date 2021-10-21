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
                    uId, hId, orderId, buyer_user_id, totalAmount,
                    sendPayDate, trade_no, checkInDate, checkOutDate,
                } = fields;
                const conn = mysql.createConnection(AliDNS);
                const sql = `
                insert into user_house_list(uId, hId, orderId, buyer_user_id,
                totalAmount, sendPayDate, trade_no, checkInDate, checkOutDate)
                values ('${uId}','${hId}','${orderId}','${buyer_user_id}','${totalAmount}','${sendPayDate}',
                '${trade_no}','${checkInDate}','${checkOutDate}')`;
                new Promise((resolve, reject) =>
                {
                    conn.query(sql, (err, res) =>
                    {
                        if (err) reject(err);
                        resolve(
                            res
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
        });
    };
    GetCurrentUserHouseRentList = () =>
    {
        this.app.get("/GetCurrentUserHouseRentList", (req, res) =>
        {
            const { uId } = querystring.parse(req.url.split("?")[1]);
            const sql = `select * from user_house_list where uId='${uId}';`;
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
                const { oldOrderId, newCheckOutDate } = fields;
                const conn = mysql.createConnection(AliDNS);
                const sql = `update user_house_list
                set checkOutDate = '${newCheckOutDate}'
                where orderId='${oldOrderId}'`;
                new Promise((resolve, reject) =>
                {
                    conn.query(sql, (err, result) =>
                    {
                        if (err) reject(err);
                        resolve(result);
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
        });
    };
}
