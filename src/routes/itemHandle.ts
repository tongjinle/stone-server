import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';


enum eBuyItemCode {
    notEnoughMoney,
    notExists,
}

export default function handle(app: express.Express) {
    // 虚拟物品兑换
    app.post('/auth/item/buy', async (req, res) => {
        let resData: Protocol.IResBuyItem;
        let { name, } = req.body as Protocol.IReqBuyItem;
        let code: number = undefined;
        let openId: string = req.headers['openId'] as string;

        let db = await Database.getIns();
        // 是否存在道具
        let { item, } = await db.queryItem({ name, });
        if (!item) {
            code = eBuyItemCode.notExists;
            resData = { code, };
            res.json(resData);
        }

        // 金币不足
        let { user, } = await db.queryUser({ openId, });
        if (user.coin < item.coin) {
            code = eBuyItemCode.notEnoughMoney;
            resData = { code, };
            res.json(resData);
        }

        // 增加一条兑换记录
        let buyTime: number = Date.now();
        await db.insertShopRecord({ openId, itemName: name, buyTime });

        // 扣去用户的coin
        await db.updateUserCoin({ openId, coinDelta: -item.coin, });
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
        let { totalCount, list } = await db.queryItemList({ name: undefined, priceInterval, pageIndex, pageSize, });
        list.forEach(n => {
            delete (n as any)['_id'];
        });
        resData = { code, list, totalCount, };
        res.json(resData);
    });
};