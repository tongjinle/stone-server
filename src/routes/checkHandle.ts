import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';


export default function handle(app: express.Express) {
    app.get('/auth/check/canCheck', async (req, res) => {
        let flag: boolean = true;
        let code: number = undefined;
        let data: Protocol.IResCanCheck = { flag, code, };
        res.json(data);
    });


    app.post('/auth/check/dayCheck', async (req, res) => {
        let code: number = undefined;
        let reward: number = config.dayReward;
        let data: Protocol.IResCheck = { code, reward, };
        res.json(data);
    });
};