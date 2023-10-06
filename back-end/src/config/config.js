module.exports = {
    port: 8000,
    nameBaseApi: "/spider-web/api",
    clusterConcurrency: 30,
    jsonFolder: "./folder/",
    listadoMangaCron: '0 1 * * *',
    listadoMangaUrl: "https://www.listadomanga.es/lista.php",
    listadoMangaNameFile: "manga.json"
};
