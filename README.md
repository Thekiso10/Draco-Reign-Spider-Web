# Draco Reign - Spider Web
**Draco Reign - Spider Web**, que es una parte integral de la suite **Draco Reign**, está diseñada para llevar a cabo la extracción de datos de la web mediante técnicas de *scraping*. Este proyecto se enfoca en el desarrollo del back-end, implementado en Node.js, y utiliza las potentes bibliotecas de Puppeteer y Express para lograr su funcionalidad.

## Descripción General
**Draco Reign - Spider Web** es una herramienta que te permite recopilar información valiosa de sitios web de manera automatizada. Ya sea para la obtención de datos para análisis, monitoreo de sitios web, o cualquier otro propósito, esta aplicación está diseñada para brindarte un poderoso conjunto de herramientas para realizar el *scraping* de manera eficiente y efectiva.

## Webs scaneadas
El proyecto obtiende los datos de las siguientes webs:
 * [Listado Manga](https://www.listadomanga.es/lista.php) Consulta la [documentación de los Endpoints](back-end/documentation/listado-manga.md) para obtener más detalles.

## Dependencias y versiones
* Node.js >= v18.18.0
* express v4.17.1
* node-cron v2.0.3
* puppeteer v10.2.0
* puppeteer-cluster v0.23.0

## Ejecutar el proyecto
1. Descarga las dependencias necesarias:
```Node
npm install
```

2. Una vez que todas las dependencias estén instaladas, puedes ejecutar el proyecto:
```Node
npm run serve
```
Esto iniciará un servidor Express en el puerto 8000.

## Problemas y Sugerencias
Si encuentras algún problema o tienes alguna sugerencia para mejorar **Draco Reign - Spider Web**, por favor, abre un [issue](https://github.com/Thekiso10/Draco-Reign-Spider-Web/issues) en nuestro repositorio de GitHub. Tu retroalimentación es muy valiosa para nosotros y nos ayuda a hacer de esta herramienta algo aún mejor.

## Versión
Versión Actual: **2.0.0**