import express from "express";
import cors from 'cors';
import path from "path";

export default class App
{
    constructor()
    {
        this.app = express();
        this.SetUpAppConfig();
        this.AllowAccessImagesResource();
    }

    SetUpAppConfig = () =>
    {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    };

    AllowAccessImagesResource = () =>
    {
        this.app.get('/img/*', (req, res) =>
        {
            res.sendFile(path.resolve() + req.url);
        });
    };

    static SingleInstance;
    static GetInstance()
    {
        if (this.SingleInstance) return this.SingleInstance;
        this.SingleInstance = new App();
        return this.SingleInstance;
    }
}
