"use strict"
const bodyParser = require('body-parser')
const axios = require("axios")

const diafSquareURL = "http://35.187.36.236:8080/function/diaf-square"

module.exports = async (config) => {
    const app = config.app;

    app.use(bodyParser.json());

    app.post('/', (req, res) => {
        console.log(res)
        console.log(req)
        const { a, b } = req.body

        axios.post(diafSquareURL, { a: a + b })
            .then(response => {
                console.log(response.data);
                res.send(response.data)
            })
            .catch(error => {
                console.error(error);
                res.send("ERROR")
            })
    });
}
