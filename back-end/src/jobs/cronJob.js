const config = require('../config/config');
const cron = require('node-cron');

const listadoMangaScraping = require('./../service/listadoMangaScraping');

cron.schedule(config.listadoMangaCron, async function() {
  console.time('tiempo ejecución');
  await listadoMangaScraping.executeScraping(config);
  console.timeEnd('tiempo ejecución');
});
