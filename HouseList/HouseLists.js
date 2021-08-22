import mysql from 'mysql';
import { DNS } from '../index.js';


export default class HouseLists
{
    constructor(app)
    {
        this.app = app;
    }

    GetHouseExhibitList = () =>
    {
        this.app.post("/GetHouseExhibitList", (req, res) =>
        {
            const conn = mysql.createConnection(DNS);
            let sql = "select * from house_baseinfo;";
            conn.query(sql, (err, result) =>
            {
                if (err) throw new Error(err);
                res.send(result);
                conn.end();
                res.end();
            });
        });
    };
}
