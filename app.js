const express = require('express')
const bodyParser = require('body-parser')     

const app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//파일 연결
const config = require('./config/index')
const indexRouter = require('./routes/index');
const path = require('path')

app.use('/', indexRouter);
app.use('/placeImg', express.static('placeImg'))
app.use(express.static(path.join(__dirname, 'views'),{extensions:['html']}));

//데이터베이스
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true)
mongoose.connect(config.database.url, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.info(`[INFO] MONGODB CONNECTED`);
})

app.listen(config.server.port, () => {
    console.info(`[INFO] SERVER RUNNING ${config.server.port}`)
})
