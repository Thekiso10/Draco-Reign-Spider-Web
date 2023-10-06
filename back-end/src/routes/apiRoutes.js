const express = require('express');
const listadoMangaScraping = require('../service/listadoMangaScraping');
const config = require('../config/config');

const router = express.Router();

// Función auxiliar para manejar errores y enviar respuestas
async function handleResponse(req, res, action) {
    res.header('Access-Control-Allow-Origin', '*');
    try {
        const jsonScraping = await action();
        if (jsonScraping.length > 0) {
            res.status(200).send(jsonScraping);
        } else {
            res.status(404).send({ error: 'No se encontraron datos.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Error interno del servidor.' });
    }
}

router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

router.get('/listado-manga/json', async (req, res) => {
    await handleResponse(req, res, () => listadoMangaScraping.getScraping(config));
});

router.get('/listado-manga/scraping', async (req, res) => {
    await handleResponse(req, res, async () => {
        await listadoMangaScraping.executeScraping(config);
        return listadoMangaScraping.getScraping(config);
    });
});

module.exports = router;