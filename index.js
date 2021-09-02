import express from 'express';
import path from 'path';
import mysql from 'mysql';
import cors from 'cors';
import querystring from 'querystring';
import multiparty from 'multiparty';
import EditUserInfo from './User/EditUserInfo.js';
import HouseLists from './HouseList/HouseLists.js';
export const DNS = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "react_house",
    port: 3306
};
export const AliDNS = {
    host: "47.107.42.46",
    user: "root",
    password: "123456",
    database: "react_house",
    port: 3306
};


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/img/*", (req, res) =>
{
    res.sendFile(path.resolve() + req.url);
});

const editUserInfo = new EditUserInfo(app);
editUserInfo.GetProvince();
editUserInfo.InitCity();
editUserInfo.GetHouseParams();

const houseLists = new HouseLists(app);
houseLists.GetHouseExhibitList();
houseLists.GetHouseDetailInfo();
houseLists.GetHouseVrScene();

app.listen(3065, () =>
{
    console.log("server runing at localhost:3065");
});
