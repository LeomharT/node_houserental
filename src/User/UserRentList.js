import multiparty from 'multiparty';
import mysql from 'mysql';
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
                    uId, orderId, buyer_user_id, totalAmount,
                    sendPayDate, trade_no, checkInDate, checkOutDate,
                } = fields;
                const conn = mysql.createConnection(AliDNS);
                const sql = `
                insert into user_house_list(uId, orderId, buyer_user_id,
                totalAmount, sendPayDate, trade_no, checkInDate, checkOutDate)
                values ('${uId}','${orderId}','${buyer_user_id}','${totalAmount}','${sendPayDate}',
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
}
