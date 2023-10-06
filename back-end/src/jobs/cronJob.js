const cron = require('node-cron');
const jsonService = require('./../service/jsonService');
const listadoMangaScraping = require('./../service/listadoMangaScraping');
const config = require('../config/config');

cron.schedule(config.listadoMangaCron, async function() {
  console.time('tiempo ejecución');
  await listadoMangaScraping.executeScraping(config);
  console.timeEnd('tiempo ejecución');
});
