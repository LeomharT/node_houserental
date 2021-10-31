import multiparty from 'multiparty';
import mysql from 'mysql';
import { AliDNS } from '../../index.js';

export default class UserRepair
{
    constructor(app)
    {
        this.app = app;
    }
    AddRepairOrder = () =>
    {
        this.app.post('/AddRepairOrder', (req, res) =>
        {
            const { body: form } = req;
            console.log(form);
            const conn = mysql.createConnection(AliDNS);
            const sql = `insert into repair_orders(repair_houseId,
            repair_userId, repair_phone, repair_time, repair_item, repair_detail, repair_state,repair_name)
            values('${form.repair_hId}','${form.repair_userId}','${form.repair_phone}',
            '${form.repair_time}','${JSON.parse(form.repair_item).join(',')}','${form.repair_detail}',
            '${form.repair_state}','${form.repair_name}'
            );`;
            new Promise((reslove, reject) =>
            {
                conn.query(sql, (err, result) =>
                {
                    if (err) reject(err);
                    reslove(result);
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
    };
}
