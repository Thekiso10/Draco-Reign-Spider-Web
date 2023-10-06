const express = require('express');
const scraping = require('../service/listadoMangaScraping');
const config = require('../config/config');

const router = express.Router();

router.get('/listado-manga/json', (req, res) => {
    console.time('tiempo ejecución');
    res.header("Access-Control-Allow-Origin"); // Evitar problemas con los CORPS

    let jsonScraping = scraping.getScraping(config);
    let status = (jsonScraping.length > 0) ? 200 : 500;

    res.json({ status: status, json: jsonScraping });
    console.timeEnd('tiempo ejecución');
});

router.get('/status', (req, res) => {
    console.log("Forwarded header =>", req.headers['X-Forwarded-For']);
    res.header("Access-Control-Allow-Origin", "*"); // Evitar problemas con los CORPS
    res.json({ status: 200, message: `Server is running on http://localhost:${config.port}/api` });
});

module.exports = router;