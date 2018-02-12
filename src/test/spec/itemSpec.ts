import Database from '../../db';
import * as axiosNs from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';
import * as utils from '../utils';



let { apiPrefix, } = config;

async function createItem(axi: axiosNs.AxiosInstance, name: string, coin: number, src: string, ): Promise<Protocol.IResCreateItem> {
    let { data, } = await axi.post(apiPrefix + 'admin/item/create', { name, coin, src }) as { data: Protocol.IResCreateItem };
    return data;
}

async function updateItem(axi: axiosNs.AxiosInstance, params: Protocol.IReqUpdateItem): Promise<Protocol.IResUpdateItem> {
    let { data, } = await axi.post(apiPrefix + 'admin/item/update', params) as { data: Protocol.IResUpdateItem };
    return data;
}

async function queryItemList(axi: axiosNs.AxiosInstance, params: Protocol.IReqItemList): Promise<Protocol.IResItemList> {
    let url = apiPrefix + 'auth/item/list' + '?' + qs.stringify(params);
    // console.log(url);
    let { data, } = await axi.get(url) as { data: Protocol.IResItemList };
    return data;
}

async function buyItem(axi: axiosNs.AxiosInstance, params: Protocol.IReqBuyItem): Promise<Protocol.IResBuyItem> {
    let url = apiPrefix + 'auth/item/buy';
    let { data, } = await axi.post(url, params) as { data: Protocol.IResBuyItem };
    return data;
}


let fn: ITestFunc = async function({ db, axi, }) {
    let ret: IResult[] = [];

    // 成功添加item
    // 同名item不能添加
    {
        await db.removeUserAll();
        await db.removeItemAll();

        await utils.createUser(axi, '654321');
        let admin = await utils.createAdmin('admin','dota123');
        let name = 'item0';
        let coin = 100;
        let src = 'http://www.abc.com/1.jpg';
        let { code, } = await createItem(admin, name, coin, src);
        let { item, } = await db.queryItem({ name, });

        ret.push({ title: '成功添加item', expect: [undefined, true], calc: [code, !!item], });

    }

    // item修改失败
    // 不存在的name
    {
        await db.removeUserAll();
        await db.removeItemAll();

        let admin = await utils.createAdmin('admin','dota123');
        let name = 'item0';
        let coin2 = 100;
        let src = 'http://www.abc.com/1.jpg';
        let { code, } = await updateItem(admin, { name, coin: coin2, src });

        ret.push({ title: 'item修改失败', expect: 0, calc: code });

    }

    // 修改item描述,价格,图片
    {

        await db.removeUserAll();
        await db.removeItemAll();

        let admin: axiosNs.AxiosInstance = await utils.createAdmin('admin', 'dota123');

        let name = 'item0';
        let coin = 100;
        let src = 'http://www.abc.com/1.jpg';
        let { code, } = await createItem(admin, name, coin, src);

        // 成功
        {
            let coin2 = 200;
            let { code, } = await updateItem(admin, { name, coin: coin2, src });

            let { item } = await db.queryItem({ name });
            ret.push({ title: '成功修改item-coin', expect: [undefined, 200], calc: [code, (item && item.coin)], });
        }

        // 成功修改name
        {
            let name2 = 'item1';
            let src = 'http://www.abc.com/2.jpg';
            let { code, } = await updateItem(admin, { name, newName: name2, coin, src, });
            let { item, } = await db.queryItem({ name, });
            let { item: item2, } = await db.queryItem({ name: name2, });
            ret.push({ title: '成功修改item-name', expect: [undefined, false, true], calc: [code, !!item, !!item2,] });
        }


    }

    // 列表查询
    {
        await db.removeUserAll();
        await db.removeItemAll();

        await utils.createUser(axi, '654321');
        let admin = await utils.createAdmin('admin', 'dota123');
        {
            let { code, list, totalCount, } = await queryItemList(axi, { pageIndex: 0, pageSize: 2, canBuy: false, });
            ret.push({ title: '列表查询-没有道具', expect: [undefined, 0], calc: [code, totalCount] });
        }

        {
            let { code, } = await queryItemList(axi, { pageIndex: 0, pageSize: -2, canBuy: false, });
            ret.push({ title: '列表查询-不合法的pageSize', expect: [0], calc: [code,] });
        }

        {
            let { code, } = await queryItemList(axi, { pageIndex: -1, pageSize: 2, canBuy: false, });
            ret.push({ title: '列表查询-不合法的pageIndex', expect: [0], calc: [code,] });
        }

        await Promise.all(
            (
                [
                    ['item0', 10, '1.jpg'],
                    ['item1', 100, '2.jpg'],
                    ['item2', 200, '3.jpg'],
                    ['ball3', 400, '4.jpg'],
                    ['ball4', 1000, '5.jpg'],
                    ['ball5', 10000, '6.jpg'],
                ] as [string, number, string][]
            ).map(n => createItem(admin, n[0], n[1], n[2], ))
        );

        {
            let { list, totalCount, } = await queryItemList(axi, { pageIndex: 0, pageSize: 2, canBuy: false, });
            ret.push({ title: '列表查询-第0页,每页2个,超过当前用户coin的也都显示', expect: [6, 'item0|item1'], calc: [totalCount, list.map(n => n.name).join('|')] });
        }

        {
            let { list, totalCount, } = await queryItemList(axi, { pageIndex: 0, pageSize: 100, canBuy: false, });
            ret.push({ title: '列表查询-第0页,每页100个,超过当前用户coin的也都显示', expect: [6], calc: [totalCount], });
        }

        {
            let openId: string = await utils.getOpenId(axi);
            await db.updateUserCoin({ openId, coinAbs: 300, });

            let { list, totalCount, } = await queryItemList(axi, { pageIndex: 1, pageSize: 2, canBuy: true, });
            ret.push({ title: '列表查询-第0页,每页2个,超过当前用户coin的不显示,当前用户300coin', expect: [3, 'item2'], calc: [totalCount, list.map(n => n.name).join('|')] });

        }
    }

    // 购买
    {
        await db.removeUserAll();
        await db.removeItemAll();

        await utils.createUser(axi, '654321');
        let admin = await utils.createAdmin('admin', 'dota123');

        await Promise.all(
            (
                [
                    ['item0', 10, '1.jpg'],
                    ['item1', 100, '2.jpg'],
                    ['item2', 200, '3.jpg'],
                    ['ball3', 400, '4.jpg'],
                    ['ball4', 1000, '5.jpg'],
                    ['ball5', 10000, '6.jpg'],
                ] as [string, number, string][]
            ).map(n => createItem(admin, n[0], n[1], n[2]))
        );

        let puman = await utils.getAxios('123456');
        let pumanOpenId = await utils.getOpenId(puman);
        await utils.createUser(puman, '123456');

        {
            // 金币不够
            await db.updateUserCoin({ openId: pumanOpenId, coinAbs: 0, });
            let { code, } = await buyItem(puman, { name: 'item0' });
            ret.push({ title: '金币不够-用户0coin,不能购买', expect: 0, calc: code, });

        }

        {
            // 道具不存在
            await db.updateUserCoin({ openId: pumanOpenId, coinAbs: 0, });
            let { code, } = await buyItem(puman, { name: 'no-one' });
            ret.push({ title: '不存在的item,不能购买', expect: 1, calc: code, });

        }


        let dino = await utils.getAxios('123456');
        let dinoOpenId = await utils.getOpenId(dino);
        await utils.createUser(dino, '123456');
        await db.updateUserCoin({ openId: dinoOpenId, coinAbs: 5000, });
        {
            // 成功购买
            let { code, shopId, } = await buyItem(dino, { name: 'item0' });
            let { shop, } = await db.queryShopRecord({ id: shopId, });
            ret.push({ title: '成功购买', expect: [undefined, true], calc: [code, !!shop] });
        }
    }





    return ret;
}



export default fn;