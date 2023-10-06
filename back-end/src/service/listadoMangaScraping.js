const { Cluster } = require('puppeteer-cluster');
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
    await page.goto(link, { waitUntil: "domcontentloaded" });

    const mangaData = await page.evaluate(() => {
        let index = {indexJapon: -1, indexEspanol: -1, indexAutor: -1, indexColeccion: -1};
        const tagMappings = {"Números en japonés:": "indexJapon", "Números en español:": "indexEspanol", "Números en castellano:": "indexEspanol", "Guion:": "indexAutor", "Colección:": "indexColeccion"};

        //Definir el bloque de los datos generales    
        let element = document.querySelector("table.ventana_id1 td.izq").childNodes;
        const objJSON = {"title": element[1].innerText, "listMangas": []};
        
        for (const [i, tags] of element.entries()) {
            const tagText = tags.innerText;
            if (tagMappings.hasOwnProperty(tagText)) {
                index[tagMappings[tagText]] = i + ((tagText === "Guion:" || tagText === "Colección:") ? 2 : 1);
            }
        }
        
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

        const mangas = document.querySelectorAll("table.ventana_id1 td.cen a");
        Array.from(mangas).forEach((manga, index) => {
            const mangaNumber = index + 1;
            const mangaText = manga.innerText;
            const childNode = manga.parentElement.childNodes;
            const dateNode = childNode[childNode.length - 2];
            const priceNode = childNode[childNode.length - 3];

            if (mangaNumber <= Number(objJSON.numEspanol) && !isNaN(Date.parse(mangaText))) {
                const date = Number.isInteger(parseInt(dateNode.textContent.trim())) ? dateNode.textContent + mangaText : mangaText;
                const price = Number.isInteger(parseInt(dateNode.textContent.trim())) ? childNode[childNode.length - 4].textContent : priceNode.textContent;

                objJSON.listMangas.push({"numTomo": mangaNumber, "fecha": date, "precio": (!price.includes("páginas en") ? price : null), image: childNode[0].src});
            }
        });

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
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: config.clusterConcurrency,
        monitor: false,
        puppeteerOptions: {
          headless: true, // Abre el navegador en una ventana visible
        }
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
    
    await jsonService.saveToJson(config.jsonFolder + config.listadoMangaNameFile, listFullMangas);
}

async function getScraping(config) {
    return jsonService.readFromJson(config.jsonFolder + config.listadoMangaNameFile).then((jsonData) => {
        return jsonData
    }).catch((error) => {
        console.error('Error al leer el archivo JSON:', error.message);
        return [];
    });
}

module.exports = {
    executeScraping,
    getScraping,
};