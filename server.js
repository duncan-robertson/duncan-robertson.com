const express = require('express');
const counterService = require('./helpers/counterService');

const port = process.env.PORT || 3000;

const dict = {
    en: require('./dist/assets/i18n/dict.en.json')
};

const app = express();
app.disable('x-powered-by');
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', 'dist');

app.use('/assets/img', express.static('dist/assets/img', {index: false, maxAge: 3600000}))
app.use(express.json());

app.use('/', express.static('dist', {index: false}));

app.get('/time.json', (req, res) => {
    var timestamp = Date.now();
    res.json({
        timestamp
    });
});

app.get('/robots.txt', (req, res) => {
    res.sendStatus(404);
});

app.use('/api/counter', counterService.quotaMiddleware)
app.all('/api/counter/:path?', counterService.forward)

app.get('/*', (req, res) => {
    res.render('./index', dict.en);
});

app.listen(port, () => {
    console.log(`${(new Date()).toISOString()}: Listening on http://localhost:${port}`);
});