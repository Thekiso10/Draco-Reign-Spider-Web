const config = require('./package.json');
//Importan la libreria -> npm i puppeteer
const cron = require('node-cron');
const express = require('express');
const puppeteer = require('puppeteer');
const http = require("http");
const fs = require('fs');

//Funciones propias
const scraping = require('./functions/scrapingWeb');

//Creamos el servidor express
const app = express();
const host = 'localhost';
const port = 8000;

//Hacemos que el servidor escuche el puerto 3000
app.listen(port, function() {
  console.log(`Servidor web escuchando en el puerto http://${host}:${port}`);
});

app.get("/api/getJsonScraping", (req, res) => {
    console.time('tiempo ejecución');
    res.header("Access-Control-Allow-Origin"); //Evitar problemas con los CORPS



    res.json({status: 200, message: "Ok"});
    console.timeEnd('tiempo ejecución');
})

app.get('/', (req, res) => {
    console.log("Forwarded header =>", req.headers['X-Forwarded-For']);
    res.header("Access-Control-Allow-Origin"); //Evitar problemas con los CORPS
    res.json({status: 200, message: `Server is running on http://${host}:${port}`});
})

//Creamos el cron web
cron.schedule('0 3 * * *', function() {
    console.time('tiempo ejecución');

    scraping.ExecuteScraping(puppeteer, config, fs);

    console.timeEnd('tiempo ejecución');
});