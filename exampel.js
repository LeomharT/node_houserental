const EXPRESS = require('express');
const CORS = require("cors");
const MYSQL = require("mysql");
const MULTIPARTY = require("multiparty");
const QUERYSTRING = require("querystring");
/*
---------------------------------------------------------------------------
---------------------------------------------------------------------------
 */
const DNS = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "react",
    port: 3306
};
const APP = EXPRESS();
APP.use(CORS());
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: false }));

APP.post("/login", (req, res) =>
{
    const CONNECTION = MYSQL.createConnection(DNS);
    let form = new MULTIPARTY.Form();
    let UserName, PassWord;
    form.parse(req, (err, fields, file) =>
    {
        if (err) throw err;
        UserName = fields.UserName[0];
        PassWord = fields.PassWord[0];
        CONNECTION.connect();
        CONNECTION.query(`select count(*) as num from user where user='${UserName}'`, (err, rows, fields) =>
        {
            if (err) throw err;
            if (rows[0]["num"] !== 1)
            {
                res.send(JSON.stringify('User Not Excise'));
                CONNECTION.end();
            }
            else
            {
                CONNECTION.query(`select pwd from user where user='${UserName}'`, (err, rows, fields) =>
                {
                    if (err) throw err;
                    if (rows[0]['pwd'] === PassWord)
                    {
                        res.send(JSON.stringify("PASS"));
                        CONNECTION.end();
                    }
                    else
                    {
                        res.send(JSON.stringify("Error PassWord"));
                        CONNECTION.end();
                    }
                });
            }
        });
    });
});

APP.post('/register', (req, res) =>
{
    const CONNECTION = MYSQL.createConnection(DNS);
    let form = new MULTIPARTY.Form();
    let UserName, PassWord;
    form.parse(req, (err, fields, file) =>
    {
        if (err) throw err;
        UserName = fields['UserName'][0];
        PassWord = fields['PassWord'][0];
        CONNECTION.connect();
        CONNECTION.query(`insert into user(user, pwd) values('${UserName}','${PassWord}')`, (err, row) =>
        {
            if (err) throw err;
            if (row.affectedRows > 0)
            {
                res.send(JSON.stringify('OK'));
            }
            else
            {
                res.send(JSON.stringify('FALL'));
            };
        });
    });
    CONNECTION.end();
});

APP.get('/getStudent', (req, res) =>
{
    const reqobj = QUERYSTRING.parse(req.url.split('?')[1]);
    let sql = 'select * from react_student';
    if (Object.keys(reqobj).length != 0)
    {
        sql += ' where';
        Object.keys(reqobj).forEach((key, index) =>
        {
            if (index === 0)
            {
                sql += ` ${key}='${reqobj[key]}'`;
                return;
            }
            sql += ` and ${key}='${reqobj[key]}'`;
        });
    }
    console.log(sql);
    const CONNECTION = MYSQL.createConnection(DNS);
    CONNECTION.connect();
    CONNECTION.query(sql, (err, row) =>
    {
        if (err) throw err;
        res.send(row);
    });
    CONNECTION.end();
});

APP.get('/deleteStudent', (req, res) =>
{
    let reqobj = QUERYSTRING.parse(req.url.split("?")[1]); //必须去这个数组的[1]
    let { id } = reqobj;
    const CONNECTION = MYSQL.createConnection(DNS);
    CONNECTION.connect();
    CONNECTION.query(`delete from react_student where id=${id}`, (err, row) =>
    {
        if (err) throw err;
        if (row.affectedRows > 0)
        {
            res.send(JSON.stringify("OK"));
        }
        else
        {
            res.send(JSON.stringify("FALL"));
        }
    });
    CONNECTION.end();
});

APP.post('/newStudent', (req, res) =>
{
    const CONNECTION = MYSQL.createConnection(DNS);
    let form = new MULTIPARTY.Form();
    form.parse(req, (err, fields, file) =>
    {
        if (err) throw err;
        CONNECTION.query(`insert into react_student(name, birthday, classroom, hobbit, gender)
        values('${fields.EmpName[0]}', '${fields.Birthday[0]}', '${fields.ClassRoom[0]}', '${fields.Hobbit[0]}', '${fields.Gender[0]}')`, (err, row) =>
        {
            if (err) throw err;
            if (row.affectedRows > 0)
            {
                res.send(JSON.stringify("OK"));
            }
            else
            {
                res.send(JSON.stringify("FALL"));
            }
            CONNECTION.end();
        });
    });
});

APP.post("/updateStudent", (req, res) =>
{
    const CONNECTION = MYSQL.createConnection(DNS);
    let form = new MULTIPARTY.Form();
    form.parse(req, (err, fields, file) =>
    {
        if (err) throw err;
        console.log(fields);
        CONNECTION.query(`update react_student set name='${fields.EmpName[0]}' , birthday='${fields.Birthday[0]}' ,  classroom='${fields.ClassRoom[0]}' , hobbit= '${fields.Hobbit[0]}' , gender='${fields.Gender[0]}' where id=${fields.EmpId[0]}`, (err, row) =>
        {
            if (err) throw err;
            if (row.affectedRows > 0)
            {
                res.send(JSON.stringify("OK"));
            }
            else
            {
                res.send(JSON.stringify("FALL"));
            }
            CONNECTION.end();
        });
    });
});

APP.listen(3065, () =>
{
    console.log(`http://localhost:3065`);
});
