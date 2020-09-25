const express =require('express');

const app = express();

app.get('/api/info', (req, res) => {
    res.json({
        name: 'webpack',
        msg: '代理接口'
    })
});
app.listen('9092');