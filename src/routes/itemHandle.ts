import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';


export default function handle(app: express.Express) {
    // 虚拟物品兑换
    app.post('/auth/item/buy', async (req, res) => {
        let resData: Protocol.IResBuyItem;
        let { id } = req.body as Protocol.IReqBuyItem;
        let code: number = undefined;



        res.json(resData);
    });



    // 虚拟道具列表
    app.get('/auth/item/list', async (req, res) => {
        let resData: Protocol.IResItemList;
        let { pageIndex, pageSize, canBuy } = req.query as Protocol.IReqItemList;

        let code: number = undefined;

        if (pageIndex === undefined ||
            pageSize === undefined ||
            !/\d+/.test(pageIndex + '') ||
            !/\d+/.test(pageSize + '')
        ) {
            code = 0;
            resData = { code, };
            res.json(resData);
            return resData
        }

        pageIndex = pageIndex - 0;
        pageSize = pageSize - 0;
        let openId: string = req.headers['openId'] as string;

        let db = await Database.getIns();
        let priceInterval: [number, number];
        if (canBuy) {
            let { user } = await db.queryUser({ openId, });
            priceInterval = [0, user.coin];
        }
        let { totalCount, list } = await db.queryItem({ name: undefined, priceInterval, pageIndex, pageSize, });
        list.forEach(n=>{
            delete (n as any)['_id'];
        });
        resData = { code, list, totalCount, };
        res.json(resData);
    });
};