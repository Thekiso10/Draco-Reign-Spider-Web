# Documentación Endpoints
A continuación, se detallan los endpoints disponibles en el proyecto **Draco Reign - Spider Web** y la información obtenida a través de cada uno de ellos.

## Endpoints
### `/health` (GET)
Este endpoint se utiliza para verificar si el servidor está en funcionamiento.
- Método: **GET**
- Parámetros de Entrada: No se requieren parámetros de entrada.
#### Respuesta
Respuesta Exitosa **(200 OK)**:
```JSON
{
    "message": "Server is running"
}
```

### `/listado-manga/json` (GET)
Este endpoint devuelve un array de JSON relacionados con la lista de mangas obtenidos a través del proceso de scraping.
- Método: **GET**
- Parámetros de Entrada: No se requieren parámetros de entrada.
#### Respuesta
**Respuesta Exitosa (200 OK):**
```JSON
[
    {
        "id": "4184",
        "spanishTitle": "Title example",
        "originalTitle": "Titulo original en Japones",
        "listMangas": [
            {
                "numTomo": 1,
                "fecha": "2 Diciembre 2021",
                "precio": "8,50 €",
                "image": "https://static.listadomanga.com/b81d2aaeef77110d5a98bcf656c64dcd.jpg"
            },
            {
                "numTomo": 2,
                "fecha": "Abril 1990",
                "precio": "450 Ptas.",
                "image": "https://static.listadomanga.com/4fe96f43ca9b1ff44bf5c6bfa900fa62.jpg"
            },
            {
                "numTomo": 3,
                "fecha": "Octubre 2012",
                "precio": null,
                "image": "https://static.listadomanga.com/31b9c0b64322e1cc7b98ea724dc11bd9.jpg"
            }
        ],
        "estadoJapon": "serie completa",
        "numJapon": "3",
        "estadoEspanol": "serie completa",
        "numEspanol": "3",
        "nombreAutor": "Yuko Inari",
        "idAutor": "2836",
        "coleccion": "Shonen"
    }
]

```
**Respuesta de Error (404 Not Found):**
```JSON
{
    "error": "No se encontraron datos."
}
```

**Respuesta de Error (500 Internal Server Error):**
```JSON
{
    "error": "Error interno del servidor."
}
```

### `/listado-manga/scraping` (GET)

Este endpoint realiza el proceso de *scraping* para obtener los datos de la lista de mangas y luego devuelve los mismos datos que se obtienen a través de *`/listado-manga/json`*.

- Método: **GET**
- Parámetros de Entrada: No se requieren parámetros de entrada.
- Respuesta Exitosa (200 OK): Consulta la respuesta en *`/listado-manga/json`*.
- Respuesta de Error (500 Internal Server Error): Consulta la respuesta en *`/listado-manga/json`*.