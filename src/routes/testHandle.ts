import * as express from 'express';

export default function handle(app: express.Express) {

    // 测试
    app.get('/test', async (req, res) => {
        res.end('hello world');
    });

    app.post('/testPost', async (req, res) => {
        console.log('testPost');
        console.log(req.body);
        res.end('testPost');
    });
}