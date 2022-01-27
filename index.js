import AliPay from './src/AliPay/AliPay.cjs';
import App from './src/App/App.js';
import './src/BackStage/BackStage.js';
import './src/BaiduAPI/BaiduIDAnalysis.js';
import './src/Chat_Websocket/HConsult.cjs';
import Community from './src/Community/Community.js';
import './src/HouseList/HouseLists.js';
import './src/User/EditUserInfo.js';
import './src/User/HCollections.js';
import './src/User/UserRentList.js';
import './src/User/UserRepair.js';

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
const { app } = App.GetInstance();

void function main()
{
    const community = new Community(app);
    for (let fn of Object.entries(community))
    {
        if (fn[1] instanceof Function && fn[0] !== 'app')
        {
            fn[1]();
        }
    }

    const aliPay = new AliPay(app);
    for (let fn of Object.entries(aliPay))
    {
        if (fn[1] instanceof Function && fn[0] !== 'app')
        {
            fn[1]();
        }
    }

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
