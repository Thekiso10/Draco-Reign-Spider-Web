const config = require('./package.json');
//Importan la libreria -> npm i puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');

console.time('tiempo ejecución');

(async () => {
    //Cargamos el navegador
    const browser = await puppeteer.launch();
    //Llamamos al navegador para que abra una pagina en blanco
    const page = await browser.newPage();
    //Nos dirimos a la web que nos interesa
    await page.goto(config.url_web);

    //Obtenemos los links de los diferentes Mangas
    const links = await page.evaluate(() => {
        let links = [];
        let elements = document.querySelectorAll("table.ventana_id1 td.izq a");

        for(let element of elements) {
            links.push(element.href);
        }
        
        return links;
    })

    const listFullMangas = []
    for(let link of links){
        await page.goto(link);
        //await page.waitForTimeout(1000);

        let element = await page.evaluate(() => {
            //Definir el bloque de los datos generales    
            let element = document.querySelector("table.ventana_id1 td.izq").childNodes;

            let indexJapon = -1;
            let indexEspanol = -1;
            for(let [index, tags] of element.entries()){
                if(tags.innerText == "Números en japonés:"){
                    indexJapon = index + 1;
                }

                if(tags.innerText == "Números en español:"){
                    indexEspanol = index + 1;
                }
            }

            //Crear objecto JSON con los dato basicos
            let estadoJapon = null;
            if(indexJapon != -1){
                estadoJapon = element[indexJapon].textContent.split('(')[1].slice(0, -1);
            }
               
            let estadoEspanol = null;
            if(indexEspanol != -1){
                estadoEspanol = element[indexEspanol].textContent.split('(')[1].slice(0, -1);
            }    
                

            let objJSON = {};
            objJSON.title = element[1].innerText;

            if(indexJapon != -1){
                objJSON.numJapon = element[indexJapon].textContent.split('(')[0].trim();
                objJSON.estadoJapon = estadoJapon;
            }
            
            if(indexEspanol != -1){
                objJSON.numEspanol = element[indexEspanol].textContent.split('(')[0].trim();
                objJSON.estadoEspanol = estadoEspanol;
            }
            
            
            let listMangas = []
            let mangas = document.querySelectorAll("table.ventana_id1 td.cen a");
            for(let [index, manga] of mangas.entries()){
                if((index + 1) <= Number(objJSON.numEspanol)){
                    if(!isNaN(Date.parse(manga.innerText))){
                        let date = manga.innerText

                        let padreTabla = manga.parentElement.childNodes
                        if(Number.isInteger(parseInt(padreTabla[padreTabla.length - 2].textContent.trim()))){
                            date = padreTabla[padreTabla.length - 2].textContent.concat(date);       
                        }

                        listMangas.push({"numTomo": (index + 1), "fecha": date})
                    }
                }
            }

            //
            objJSON.listMangas = listMangas;

            //return objJSON;
            return objJSON;
        })

        element.id = link.split('=')[1];

        listFullMangas.push(element);
        console.log("Se ha guardado el manga " + element.id);
    }

    //IMPORTANTE cerrar el navegador
    await browser.close();

    let jsonFile = {"listMangas": listFullMangas}
    fs.writeFile(config.uri_json, JSON.stringify(jsonFile),'utf8', (err) => { 
        if (err) throw err; 
            console.log('The file has been saved!'); 
    }); 

    console.timeEnd('tiempo ejecución');
})();