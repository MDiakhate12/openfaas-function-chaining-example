"use strict"
const bodyParser = require('body-parser')

module.exports = async (config) => {
    const app = config.app;

    app.use(bodyParser.json());

    app.post('/', (req, res) => {
        console.log(res)
        console.log(req)
        const { a } = req.body

        res.send({ result: a*a });
    });
}
