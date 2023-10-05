const puppeteer = require('puppeteer');
const jsonService = require('./jsonService');

async function getLinks(page, config) {
  await page.goto(config.listadoMangaUrl);
  const links = await page.evaluate(() => {
    let links = [];
    let elements = document.querySelectorAll("table.ventana_id1 td.izq a");

    for (let element of elements) {
      if (!links.includes(element.href)) {
        links.push(element.href);
      }
    }
    return links;
  });
  return links;
}

async function scrapeMangaData(page, link) {
  await page.goto(link);

  const mangaData = await page.evaluate(() => {
      //Definir el bloque de los datos generales    
      let element = document.querySelector("table.ventana_id1 td.izq").childNodes;

      let indexJapon = -1;
      let indexEspanol = -1;
      let indexAutor = -1;
      let indexColeccion = -1;
      for(let [index, tags] of element.entries()){
          if(tags.innerText == "Números en japonés:"){
              indexJapon = index + 1;
          }

          if(tags.innerText == "Números en español:" || tags.innerText == "Números en castellano:"){
              indexEspanol = index + 1;
          }

          if(tags.innerText == "Guion:"){
              indexAutor = index + 2;
          }

          if(tags.innerText == "Colección:"){
              indexColeccion = index + 2;
          }
      }

      let objJSON = {};
      objJSON.title = element[1].innerText;

      //Crear objecto JSON con los dato basico
      if(indexJapon != -1){
          objJSON.estadoJapon = element[indexJapon].textContent.split('(')[1].slice(0, -1);
          objJSON.numJapon = element[indexJapon].textContent.split('(')[0].trim();
      }

      if(indexEspanol != -1){
          objJSON.estadoEspanol = element[indexEspanol].textContent.split('(')[1].slice(0, -1);
          objJSON.numEspanol = element[indexEspanol].textContent.split('(')[0].trim();
      }    

      if(indexAutor != -1){
          objJSON.nombreAutor = element[indexAutor].textContent;
          if(element[indexAutor].href != null){
              objJSON.idAutor = element[indexAutor].href.split('id=')[1];
          }
      }

      if(indexColeccion != -1){
          objJSON.coleccion = element[indexColeccion].textContent;
      }

      let listMangas = []
      let mangas = document.querySelectorAll("table.ventana_id1 td.cen a");
      for(let [index, manga] of mangas.entries()){
          if((index + 1) <= Number(objJSON.numEspanol)){
              if(!isNaN(Date.parse(manga.innerText))){
                  let padreTabla = manga.parentElement.childNodes

                  let date = manga.innerText
                  let precio = padreTabla[padreTabla.length - 3].textContent;

                  if(Number.isInteger(parseInt(padreTabla[padreTabla.length - 2].textContent.trim()))){
                      date = padreTabla[padreTabla.length - 2].textContent.concat(date); 
                      precio = padreTabla[padreTabla.length - 4].textContent;
                  }

                  listMangas.push({"numTomo": (index + 1), "fecha": date, "precio": precio})
              }
          }
      }

      objJSON.listMangas = listMangas;

    return objJSON;
  });

  mangaData.id = link.split('=')[1];
  return mangaData;
}

async function executeScraping(config, jsonService) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const links = await getLinks(page, config);

  const listFullMangas = [];
  const linksSize = links.length;
  let index = 1;
  
  for (const link of links) {
      const mangaData = await scrapeMangaData(page, link);
      listFullMangas.push(mangaData);
      console.log("Se ha guardado el manga " + mangaData.id + " | NUM: " + index + "/" + linksSize);
      index += 1;
  }

  await jsonService.saveToJson(config.folderJson + 'manga.json', listFullMangas);
  await browser.close();
}

async function getScraping(config, jsonService) {
    await executeScraping(config, jsonService);
    return jsonService.readFromJson(config.folderJson + 'manga.json');
}

module.exports = {
  executeScraping,
  getScraping,
};