import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// view setting
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.engine("html", require('ejs').renderFile);
// public
app.use('/public', express.static(__dirname + '/public'));
// three
app.use('/build/', express.static(path.join(__dirname, '../node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, '../node_modules/three/examples/jsm')));
// swup
app.use('/dist/', express.static(path.join(__dirname, '../node_modules/swup/dist')));
console.log(path.join(__dirname, '../node_modules/swup/dist'));
// musics
app.use('/musics/', express.static(__dirname + '/musics'));

app.get('/', (_, res) => res.render('index.html'));
app.get('/game', (_, res) => res.render('game.html'));



/* Backend codes */



app.listen(port, () => {
    console.log(`Exmaple app listening on port ${port}`);
})