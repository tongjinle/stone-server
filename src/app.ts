/*
    *********************************************  
                       _ooOoo_  
                      o8888888o  
                      88" . "88  
                      (| -_- |)  
                      O\  =  /O  
                   ____/`---'\____  
                 .'  \\|     |//  `.  
                /  \\|||  :  |||//  \  
               /  _||||| -:- |||||-  \  
               |   | \\\  -  /// |   |  
               | \_|  ''\---/''  |   |  
               \  .-\__  `-`  ___/-. /  
             ___`. .'  /--.--\  `. . __  
          ."" '<  `.___\_<|>_/___.'  >'"".  
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |  
         \  \ `-.   \_ __\ /__ _/   .-` /  /  
    ======`-.____`-.___\_____/___.-`____.-'======  
                       `=---='  
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
               佛祖保佑       永无BUG  
*/

import * as _ from 'underscore';
// import * as IoServer from 'socket.io';
import * as Http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import loger from './logIns';
import config from './config';

import httpRouteHandle from './routes/httpRoute';
import utils from './utils';
// import socketRouteHandle from './socketRoute/socketRoute';



class Main {
    app: express.Express;
    server: Http.Server;
    constructor() {

        let app = this.app = express();
           

        this.initHttpRoute();

        let a = express();
        Http.createServer();
       


    }

    initHttpRoute(): void {
        let app = this.app;
        // 钩子
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use((req, res, next) => {
            console.log('req.path', req.path);
            if (req.method == 'OPTIONS') {
                console.log('options...')
                next();

                return;
            }

            next();
        });

        app.all('*', (req: express.Request, res: express.Response, next) => {
            // console.log('set header');
            // let origin = req.header('Origin');
            // console.log(origin);
            // res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            // res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });


        // 路由
        httpRouteHandle(app);

        // 定期清理过期黑店
        utils.clearRoomLoop();

        // 启动
        let { port } = config;
        app.listen(port, () => {
            console.log('=======================================');
            console.log(new Date());
            console.log('** start server at port(3000) **');
            console.log('=======================================');
        });
    }

    

   


}



let app = new Main();





