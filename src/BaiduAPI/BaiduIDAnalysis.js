import request from "request";
import multiparty from 'multiparty';
import fs from 'fs';
const config = {
    grant_type: "client_credentials",
    client_id: "YT9372i1uwblqLOVKbKkKHZ5",
    client_secret: "CzGF8c2lNFGf7X55ER09Q7hhRZtk6vMU",
};
export default class BaiduIDAnalysis
{
    constructor(app)
    {
        this.app = app;
    }
    FetchBaiduToken = () =>
    {
        this.app.get('/FetchBaiduToken', (req, res) =>
        {
            request({ method: "POST", url: "https://aip.baidubce.com/oauth/2.0/token", qs: config },
                (err, response, body) =>
                {
                    if (err) throw new Error(err);
                    res.send(body);
                }
            );
        });
    };
    FormatImageToBase64 = () =>
    {
        this.app.post("/FormatImageToBase64", (req, res) =>
        {
            const formData = new multiparty.Form();
            //fields是字段,文件在file里面
            formData.parse(req, (err, fields, file) =>
            {
                if (err) throw new Error;
                const uploadImg = file.file[0];
                fs.readFile(uploadImg.path, (err, data) =>
                {
                    if (err) throw new Error;
                });
            });
        });
    };
}
