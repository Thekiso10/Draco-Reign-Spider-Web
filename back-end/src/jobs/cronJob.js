const cron = require('node-cron');
const puppeteer = require('puppeteer');
const jsonService = require('./../service/jsonService');
const listadoMangaScraping = require('./../service/listadoMangaScraping');
const config = require('../config/config');

cron.schedule(config.listadoMangaCron, async function() {
  console.time('tiempo ejecución');
  await listadoMangaScraping.executeScraping(config, jsonService);
  console.timeEnd('tiempo ejecución');
});
