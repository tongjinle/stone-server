import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';


export default function handle(app: express.Express) {
    // 虚拟物品兑换
    app.post('/auth/item/buy', async (req, res) => {
        let { id } = req.body as Protocol.IReqBuyItem;
        let code: number = undefined;
        let data: Protocol.IResBuyItem = { code, };
        res.json(data);
    });



    // 虚拟道具列表
    app.get('/auth/item/list', async (req, res) => {
        let { pageIndex, pageSize, canBuy } = req.query as Protocol.IReqItemList;
        let code: number = undefined;
        let list: { id: number, src: string, }[] = [];
        let totalCount: number = 48;
        let data: Protocol.IResItemList = { code, list, totalCount, };
        res.json(data);
    });
};