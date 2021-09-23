const express = require('express');

const port = process.env.PORT || 3000;
const app = express();
const dict = {
    en: require('./dist/assets/i18n/dict.en.json')
};

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', 'dist');

app.use('/assets/img', express.static('dist/assets/img', {index: false, maxAge: 3600000}))

app.use('/', express.static('dist', {index: false}));

app.get('/time.json', (req, res) => {
    var timestamp = Date.now();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        timestamp
    }));
});

app.get('/robots.txt', (req, res) => {
    res.sendStatus(404);
});

app.get('/*', (req, res) => {
    res.render('./index', dict.en);
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});