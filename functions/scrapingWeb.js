function ExecuteScraping(puppeteer, config, fs) {
    
    (async () => {
        //Cargamos el navegador
        const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
        //Llamamos al navegador para que abra una pagina en blanco
        const page = await browser.newPage();
        //Nos dirimos a la web que nos interesa
        await page.goto(config.url_web);

        //Obtenemos los links de los diferentes Mangas
        const links = await page.evaluate(() => {
            let links = [];
            let elements = document.querySelectorAll("table.ventana_id1 td.izq a");

            for(let element of elements) {
                if(links.includes(element.href) == false){
                    links.push(element.href);
                }
            }
            
            return links;
        })

        console.log("Numeros de links: " + links.length);

        var index = 1;
        const listFullMangas = []
        for(let link of links){
            await page.goto(link);

            let element = await page.evaluate(() => {
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

                //
                objJSON.listMangas = listMangas;

                //return objJSON;
                return objJSON;
            })

            element.id = link.split('=')[1];

            listFullMangas.push(element);
            console.log("Se ha guardado el manga " + element.id + " | NUM: " + index + "/" + links.length);
            index++;
        }

        //IMPORTANTE cerrar el navegador
        await browser.close();

        let jsonFile = {"listMangas": listFullMangas}
        fs.writeFile(config.uri_json, JSON.stringify(jsonFile),'utf8', (err) => { 
            if (err) throw err; 
                console.log('The file has been saved!'); 
        });       

    })();
}

module.exports = {
    "ExecuteScraping": ExecuteScraping
}