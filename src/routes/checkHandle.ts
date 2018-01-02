import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';


export default function handle(app: express.Express) {
    app.get('/check/canCheck', async (req, res) => {
        let flag: boolean = true;
        let data: Protocol.IResCanCheck = {
            flag,
        };
        res.json(data);
    });


    app.post('/check/dayCheck', async (req, res) => {
        let flag: boolean = true;
        let reward: number = config.dayReward;
        let data: Protocol.IResCheck = {
            flag,
            reward,
        };
        res.json(data);
    });
};