import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import * as Struct from '../struct';
import Database from '../db';

enum eCreateRoomCode {
    // 已经创建了黑店
    hasCreated,
    // 已经加入他人的黑店
    hasJoined,
}

export default function handle(app: express.Express) {
    // 创建黑店房间
    app.post('/auth/room/create', async (req, res) => {
        let resData: Protocol.IResCreateRoom;
        let { count, coin, } = req.body as Protocol.IReqCreateRoom;
        let code: number = undefined;

        let openId: string = req.headers['openId'] as string;

        let db = await Database.getIns();
        let { user } = await db.queryUser({ openId, });
        // 存在当前黑店
        if (user.currRoomId != undefined) {
            let { room } = await db.queryRoom({ roomId: user.currRoomId, });

            code = !!room ? eCreateRoomCode.hasCreated : eCreateRoomCode.hasJoined;
            resData = { code, };
            res.json(resData);
            return;
        }

        let beginTime: number = Date.now(),
            endTime: number = beginTime + config.roomEndTime,
            commentDuration: [number, number] = [beginTime + config.commentBeginTime, beginTime + config.commentEndTime];

        let { roomId, } = await db.insertRoom({ openId, count, coin, beginTime, endTime, commentDuration, });
        resData = { code, id: roomId, };
        res.json(resData);
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