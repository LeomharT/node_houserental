import express from 'express';
import path from 'path';
import mysql from 'mysql';
import cors from 'cors';
import querystring from 'querystring';
import multiparty from 'multiparty';
import EditUserInfo from './src/User/EditUserInfo.js';
import HouseLists from './src/HouseList/HouseLists.js';
import HCollections from './src/User/HCollections.js';
import './src/Chat_Websocket/HConsult.cjs';
import Community from './src/Community/Community.js';
import AliPay from './src/AliPay/AliPay.cjs';
import UserRentList from './src/User/UserRentList.js';
import UserRepair from './src/User/UserRepair.js';
import moment from 'moment';



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

void function main()
{
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
    houseLists.GetHouseVrSceneArray();
    houseLists.GetHouseVrSceneInfo();
    houseLists.GetHouseCollectInfo();
    houseLists.GetHouseComment();
    houseLists.PostHouseComment();
    houseLists.GetAllHouseLocation();

    const hCollections = new HCollections(app);
    hCollections.CollectHouse();
    hCollections.DeleteHouseFromCollections();
    hCollections.GetAllUserCollections();

    const community = new Community(app);
    community.UploadArticleImg();
    community.DeleteUploadeImgs();
    community.PostArticle();
    community.GetArticles();
    community.PostArticleComment();
    community.GetArticleComment();
    community.DeleteArticle();

    const aliPay = new AliPay(app);
    aliPay.OpenAliPayPage();
    aliPay.CheckOrderPaymentStatus();
    aliPay.OrderRefund();
    aliPay.QueryOrderRefund();

    const userRentList = new UserRentList(app);
    userRentList.AddHouseToUser();
    userRentList.GetCurrentUserHouseRentList();
    userRentList.RenewalOrder();
    userRentList.GetUserRenewalOrderList();
    userRentList.UserCheckOut();

    const userRepair = new UserRepair(app);
    userRepair.AddRepairOrder();
    userRepair.GetRepairOrders();
    userRepair.CompleteRepairOrder();
    userRepair.DeleteRepairOrder();

    app.listen(3065, () =>
    {
        console.log("server runing at localhost:3065");
    });
}();
// void function CheckHouseRentState()
// {
//     const si = setInterval(async () =>
//     {
//         const sql = 'select * from user_house_list where isEnd = 0;';
//         const conn = mysql.createConnection(AliDNS);
//         let getAllRentedHouseList = new Promise((resolve, reject) =>
//         {
//             conn.query(sql, (err, result) =>
//             {
//                 if (err) reject(err);
//                 resolve(result);
//             });
//         });
//         const data = await getAllRentedHouseList;
//         for (let d of data)
//         {
//             if (d.checkOutDate < Date.now())
//             {
//                 const updateUH = `update user_house_list set isEnd = 1 where id = '${d.id}'`;
//                 const updateHouse = `update house_baseinfo set isRented = 0 where hId  = '${d.hId}'`;
//                 console.log(updateHouse);
//                 const p1 = new Promise((resolve, reject) =>
//                 {
//                     conn.query(updateUH, (err, result) =>
//                     {
//                         if (err) reject(err);
//                         resolve(result);
//                     });
//                 });
//                 const p2 = new Promise((resolve, reject) =>
//                 {
//                     conn.query(updateHouse, (err, result) =>
//                     {
//                         if (err) reject(err);
//                         resolve(result);
//                     });
//                 });
//                 Promise.all([p1, p2]).then((data) =>
//                 {
//                     console.log(data);
//                 });
//             }
//         }
//     }, 3000);
// }();
