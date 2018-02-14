import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';


enum eBuyItemCode {
    notEnoughMoney,
    notExists,
    insertShopRecordFail,
}

export default function handle(app: express.Express) {
    // 虚拟物品添加
    app.post('/admin/item/create', async (req, res) => {
        let resData: Protocol.IResCreateItem;

        let db = await Database.getIns();

        let { name, coin, src, } = req.body as Protocol.IReqCreateItem;
        let { item, } = await db.queryItem({ name, });
        if (item) {
            resData = { code: 0, };
            res.json(resData);
            return;
        }

        await db.insertItem({ name, coin, src, });

        resData = {};
        res.json(resData);
    });

    // 虚拟物品下架
    app.post('/admin/item/remove', async (req, res) => {
        let resData: Protocol.IResRemoveItem;

        let db = await Database.getIns();
        let { name, } = req.body as Protocol.IReqRemoveItem;


        let { flag } = await db.removeItem({ name, });
        resData = { code: flag ? undefined : 0 };
        res.json(resData);
    });

    // 虚拟物品修改
    // logo 描述 价格
    app.post('/admin/item/update', async (req, res) => {
        let resData: Protocol.IResUpdateItem;

        let db = await Database.getIns();
        let { name, coin, src, newName, } = req.body as Protocol.IReqUpdateItem;
        let { flag, } = await db.updateItem({ name, coin, src, newName });

        resData = { code: flag ? undefined : 0 };
        res.json(resData);
    });




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
            return;
        }

        // 金币不足
        let { user, } = await db.queryUser({ openId, });
        if (user.coin < item.coin) {
            code = eBuyItemCode.notEnoughMoney;
            resData = { code, };
            res.json(resData);
            return;
        }

        // 增加一条兑换记录
        let buyTime: number = Date.now();
        let{flag,shopId,} = await db.insertShopRecord({ openId, itemName: name, buyTime });
        if(!flag){
            code = eBuyItemCode.insertShopRecordFail;
            resData = { code, };
            res.json(resData);
            return;
        }
        // 扣去用户的coin
        await db.updateUserCoin({ openId, coinDelta: -item.coin, });
        resData = {shopId,};
        res.json(resData);
    });



    // 虚拟道具列表
    app.get('/auth/item/list', async (req, res) => {
        let resData: Protocol.IResItemList;
        let { pageIndex, pageSize, canBuy } = req.query as Protocol.IReqItemList;

        let code: number = undefined;

        if (pageIndex === undefined ||
            pageSize === undefined ||
            !/^\d+$/.test(pageIndex + '') ||
            !/^[1-9]+\d*$/.test(pageSize + '')
        ) {
            code = 0;
            resData = { code, };
            res.json(resData);
            return resData
        }

        // 类型转换下
        pageIndex = pageIndex - 0;
        pageSize = pageSize - 0;
        canBuy = canBuy+'' == 'true';    

        let openId: string = req.headers['openId'] as string;

        let db = await Database.getIns();
        let priceInterval: [number, number];
        if (canBuy) {
            let { user } = await db.queryUser({ openId, });
            priceInterval = [0, user.coin];
        }
        let { totalCount, list } = await db.queryItemList({ name: undefined, priceInterval, pageIndex, pageSize, });

        resData = { code, list, totalCount, };
        res.json(resData);
    });
};