import multiparty from 'multiparty';
import mysql from 'mysql';
import { AliDNS } from '../../index.js';
export default class UserHouseList
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
                12
                `;
            });
        });
    };
}
