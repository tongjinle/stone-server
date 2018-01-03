import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import * as Struct from '../struct';

export default function handle(app: express.Express) {
    // 创建黑店房间
    app.post('/auth/room/createRoom', async (req, res) => {
        let { count, coin, } = req.body as Protocol.IReqCreateRoom;
        let code: number = undefined;
        let id: number = 1001;
        let data: Protocol.IResCreateRoom = { code, id, };
        res.json(data);
    });

    // 通过黑店编号获取黑店信息
    app.get('/auth/room/info', async (req, res) => {
        let { roomId, } = req.query as Protocol.IReqRoomInfo;
        let code: number = undefined;
        let info: Struct.IRoomInfo;

        //
        {
            let begin: number = Date.now();
            let end: number = begin + 5 * 60 * 1000;
            let h = 60 * 60 * 1000;
            let commentDuration: [number, number] = [end + h, end + 5 * h];
            info = {
                roomId: 1001,
                coin: 50,
                begin,
                end,
                commentDuration,
                commentList: undefined,
                score: undefined,
            };
        }
        let reward: number = config.dayReward;
        let data: Protocol.IResRoomInfo = { code, info, };
        res.json(data);
    });

    // 请求加入黑店
    app.post('/auth/room/apply', async (req, res) => {
        let { roomId, } = req.body as Protocol.IReqApplyRoom;
        let flag: boolean = true;
        let code: number = undefined;
        let data: Protocol.IResApplyRoom = { flag, code, };
        res.json(data);
    });

    // 评价黑店
    app.post('/auth/room/comment', async (req, res) => {
        let { roomId, comment, } = req.body as Protocol.IReqCommentRoom;
        let code: number = undefined;
        let data: Protocol.IResCommentRoom = { code, };
        res.json(data);
    });


    // 查询开黑历史
    app.get('/auth/room/history', async (req, res) => {
        let { pageIndex, pageSize, } = req.body as Protocol.IReqRoomHistory;
        let code: number = undefined;
        let list: Struct.IRoomRusume[] = [];


        //
        {
            let h = 60 * 60 * 1000;
            let begin: number = Date.now() - 24 * h;
            list.push({
                begin,
                comment: {
                    good: 3,
                    normal: 1,
                    bad: 1,
                },
                income: 500,
                score: {}
            })
        }
        let data: Protocol.IResRoomHistory = { code, list };
        res.json(data);
    });
};