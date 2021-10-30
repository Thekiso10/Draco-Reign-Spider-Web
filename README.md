# scraping-web-Listado-Mangas
Obtención de los datos de los mangas de la pagina: https://www.listadomanga.es

## Ejecutar el proyecto
1. Lo primero es descargar las dependencias necesarias:
```Node
npm install
```

2. Despues de tener todas la dependencias, se puede ejecutar:
```
node index.js 
```

## Scraping Web
El proyecto obtiende los datos de los mangas a partir de la pagina https://www.listadomanga.es/lista.php. Estos se guardan en un fichero JSON, que por defecto se genera en *folder/archivo.json*. Esta carpeta esta dentro del mismo proyecto.

## Datos obtenidos
1. El titulo del Manga
2. El ID del Manga de la pagina web
3. El numero de volumenes en Japón
4. El estado de la serie en Japón
5. El numero de volumenes en España
6. El estado de la serie en España 
7. Lista de los tomos publicados en España
8. Fecha de estreno de los tomos publicados en España  

## Versión
Versión Actual: **1.1**