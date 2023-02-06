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
const port = 3000;

//Hacemos que el servidor escuche el puerto 3000
app.listen(port, function() {
  console.log(`Servidor web escuchando en el puerto ${port}`);
});

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);

    scraping.ExecuteScraping(puppeteer, config, fs);

    res.end(`{"message": "Test de la función ejecutado. Revisa los logs"}`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

//Creamos el cron web
cron.schedule('0 3 * * *', function() {
    console.time('tiempo ejecución');

    scraping.ExecuteScraping(puppeteer, config, fs);

    console.timeEnd('tiempo ejecución');
});