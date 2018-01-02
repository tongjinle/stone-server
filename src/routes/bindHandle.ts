import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';


export default function handle(app: express.Express) {
    app.post('/bind', async (req, res) => {

        let {openId,dataId} = req.body as Protocol.IReqBind;
        let reward:number = config.bindReward;
        let data :Protocol.IResBind = {
            flag:true,
            reward,
        };
        res.json(data);
    });

    
}