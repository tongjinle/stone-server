import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import TokenMgr from '../tokenMgr';
import AdminMgr from '../adminMgr';
import Database from '../db';
import * as Chance from 'chance';


let chance = new Chance();
export default function handle(app: express.Express) {
    app.post('/admin/login', async (req, res) => {
        let resData: Protocol.IResAdminLogin;
        let code: number = undefined;
        let {userName,password,} = req.body as Protocol.IReqAdminLogin;
        console.log(userName,password);
        let db = await Database.getIns();
        let isAdmin = config.adminList.some(n=>{
            return n.userName == userName && n.password == password;
        });
        if(!isAdmin){
            res.json({code:0,});
            return;
        }

        let token:string = TokenMgr.getIns().bind(userName);
        resData = { code, token, };
        res.json(resData);

    });

    
}










