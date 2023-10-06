const fs = require('fs');

function saveToJson(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function readFromJson(filePath) {
    return new Promise((resolve, reject) => {
        // Verificar si el archivo existe antes de intentar leerlo
        fs.stat(filePath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // El archivo no existe
                    reject(new Error('El archivo no existe'));
                } else {
                    // Ocurrió un error diferente al verificar la existencia del archivo
                    reject(err);
                }
            } else {
                // El archivo existe, proceder a la lectura
                fs.readFile(filePath, 'utf8', (readErr, data) => {
                    if (readErr) {
                        reject(readErr);
                    } else {
                        resolve(JSON.parse(data));
                    }
                });
            }
        });
    });
}

module.exports = {
    saveToJson,
    readFromJson,
};