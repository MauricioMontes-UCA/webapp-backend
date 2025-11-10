// Esta es una función algo situacional, pero creo que para el servicio de books servirá

/*

En este caso, es donde específico que los objetos, el libro devuelto, tiene un montón de información que
no va a ser necesaria para nosotros. Entonces, en mi opinión y sin consultar con nadie, decidí que la información
que nos importa es la siguiente:

{
    "id": string,
    "volumeInfo": object {
        "title": string,
        "authors": string [ ],
        "publisher": string,
        "publishedDate": string (es una fecha),
        "description": string,
        "industryIdentifiers": object [ ] [
            {
                "type": string (versión de ISBN),
                "identifier": string (código ISBN)
            },
        ],
        "pageCount": int,
        "categories": string [ ],
        "maturityRating": string (parece ser un enum),
        "imageLinks": objetct {
            "smallThumbnail": string,
            "thumbnail": string
        },
        "language": string,
    }
}
*/

// La función recibe el objeto que es el volumen, que en general es el response.data.items[i]
// de la respuesta de axios.
export const filterBookInfo = (bookData) => {
    return {
        id: bookData.id,
        title: bookData.volumeInfo.title,
        authors: bookData.volumeInfo.authors,
        publisher: bookData.volumeInfo.publisher,
        publishedDate: bookData.volumeInfo.publishedDate,
        description: bookData.volumeInfo.description,
        industryIdentifiers: bookData.volumeInfo.industryIdentifiers,
        pageCount: bookData.volumeInfo.pageCount,
        categories: bookData.volumeInfo.categories,
        maturityRating: bookData.volumeInfo.maturityRating,
        imageLinks: bookData.volumeInfo.imageLinks,
        language: bookData.volumeInfo.language
    }
}