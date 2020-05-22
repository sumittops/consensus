const express = require('express');

const app = express()

app.use(express.static('dist'));

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
})

const port = process.env.APP_PORT || 9000;

app.listen(port, () => {
    console.log(`client getting served on ${port}`);
});
