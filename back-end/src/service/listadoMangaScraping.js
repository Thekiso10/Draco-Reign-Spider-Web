const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
const jsonService = require('./jsonService');

const tagMappings = {
    "Números en japonés:": "indexJapon",
    "Números en español:": "indexEspanol",
    "Números en castellano:": "indexEspanol",
    "Guion:": "indexAutor",
    "Colección:": "indexColeccion",
};

async function getLinks(page, config) {
  await page.goto(config.listadoMangaUrl);
  const links = await page.evaluate(() => {
    let links = [];
    let elements = document.querySelectorAll("table.ventana_id1 td.izq a");

    let index = 1;

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
    await page.goto(link, { waitUntil: "domcontentloaded" });

    const mangaData = await page.evaluate(() => {
        const objJSON = {};
        let index = {indexJapon: -1, indexEspanol: -1, indexAutor: -1, indexColeccion: -1};
        
        //Definir el bloque de los datos generales    
        let element = document.querySelector("table.ventana_id1 td.izq").childNodes;
        

        for(let [i, tags] of element.entries()){
            if(tags.innerText == "Números en japonés:"){
                index.indexJapon = i + 1;
            }

            if(tags.innerText == "Números en español:" || tags.innerText == "Números en castellano:"){
                index.indexEspanol = i + 1;
            }

            if(tags.innerText == "Guion:"){
                index.indexAutor = i + 2;
            }

            if(tags.innerText == "Colección:"){
                index.indexColeccion = i + 2;
            }
        }
        
        objJSON.title = element[1].innerText;

        //Crear objecto JSON con los dato basico
        if(index.indexJapon != -1){
            objJSON.estadoJapon = element[index.indexJapon].textContent.split('(')[1].slice(0, -1);
            objJSON.numJapon = element[index.indexJapon].textContent.split('(')[0].trim();
        }
        
        if(index.indexEspanol != -1){
            objJSON.estadoEspanol = element[index.indexEspanol].textContent.split('(')[1].slice(0, -1);
            objJSON.numEspanol = element[index.indexEspanol].textContent.split('(')[0].trim();
        }    
        
        if(index.indexAutor != -1){
            objJSON.nombreAutor = element[index.indexAutor].textContent;
            if(element[index.indexAutor].href != null){
                objJSON.idAutor = element[index.indexAutor].href.split('id=')[1];
            }
        }

        if(index.indexColeccion != -1){
            objJSON.coleccion = element[index.indexColeccion].textContent;
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

async function executeScraping(config) {
    let index = 1;
    let linksSize = 0;

    const listFullMangas = [];
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: config.clusterConcurrency,
    });
  
    await cluster.task(async ({ page, data: link }) => {
        const mangaData = await scrapeMangaData(page, link);
        listFullMangas.push(mangaData);
        console.log("Se ha guardado el manga " + mangaData.id + " | NUM: " + index + "/" + linksSize);
        index += 1;
    });

    // Crear una nueva página dentro del clúster
    await cluster.queue(async ({ page }) => {
      const links = await getLinks(page, config);
      linksSize = links.length;
      links.forEach((link) => {
        cluster.queue(link);
      });
    });
  
    await cluster.idle();
    await cluster.close();
    
    await jsonService.saveToJson(config.folderJson + 'manga.json', listFullMangas);
}

async function getScraping(config) {
    await executeScraping(config);
    return jsonService.readFromJson(config.folderJson + 'manga.json');
}

module.exports = {
    executeScraping,
    getScraping,
};