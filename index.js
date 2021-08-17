import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import querystring from 'querystring';
import multiparty from 'multiparty';
import EditUserInfo from './User/EditUserInfo.js';
export const DNS = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "react_house",
    port: 3306
};
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


let editUserInfo = new EditUserInfo(app);
editUserInfo.GetProvince();
editUserInfo.InitCity();
editUserInfo.GetHouseParams();


app.listen(3065, () =>
{
    console.log("server runing at localhost:3065");
});
