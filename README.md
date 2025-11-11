# Indicaciones generales

Cuando clonen el repositorio, favor correr en la terminal:

```
npm install
```

Este comando instala las dependencias que se encuentran en el `package.json`. Luego, crear un archivo `.env` en donde se encontrarán variables de entorno que son necesarias para funcionar. Esas variables de entorno estarán en otro medio, como en el equipo de teams, o bueno preguntas. La idea es que no se encuentren públicamente.

### Endpoints disponibles

- `GET /api/books/:id`  
  Obtiene la información de un libro por su ID.

- `GET /api/books/`  
  Devuelve un objeto `{ lists: [...] }` con listas de libros por género.

- `GET /api/books/search/:query`  
  Búsqueda simple. Devuelve `{ items: [...] }` con hasta 10 resultados.

- `POST /api/books/search/`  
  Búsqueda avanzada. El body debe tener la siguiente estructura:
  ```json
  {
    "keywords": "string",
    "title": "string",
    "author": "string",
    "publisher": "string",
    "subject": "string",
    "isbn": "string"
  }
  ```
  Responde con { items: [...] } (máximo 10 resultados).

## Cómo usar el servicio de libros

Los libros obtenidos por esta API obtienen información que nos puede ser relevante para el sitio web. La estructura de cada libro es la siguiente:

```json
{
    id: String,
    title: String,
    authors: String[ ], // Pueden ser muchos autores
    publisher: String,
    publishedDate: String, // Que es una fecha realmente
    description: String, // Mucho texto

    // Es una lista de todos los identificadores estándar del libro
    industryIdentifiers: Object {type: String, identifier: String} [ ],

    pageCount: Int,

    // Estos pueden ser los géneros del libro o algo así.
    // Son categorías de un estándar llamado BISAC.
    categories: String[ ], 
    maturityRating: "NOT_MATURE" || "MATURE",
    imageLinks: Object { 
        smallThumbnail: String // Es un URL de la portada
        thumbnail: String // Es otro URL de la portada
        ...
        // Puede tener más elementos, no sé porqué lo quisieron guardar como objeto
    }

    language: String // Idioma del libro

}
```

Actualmente hay cuatro endpoints para el servicio de libros: 

- `GET: /api/books/:id` es el endpoint para la página de la reseña del usuario del libro. Obtiene la información del libro al que le pertenezca la ID ingresada por parámetro. Los elementos de alguna forma tienen que tener guardado el ID del libro para pasarlo por parámetro.

- `GET: /api/books/` es el endpoint a llamar para la página de catálogos. Devuelve un objeto `{ lists: [] }`, donde cada elemento de la lista es un objeto que contiene el género de la lista de libros:

```json
{   
    lists: [
        {
            subject: "recent",
            items: Book [ ]
        },
        {
            subject: "bestseller",
            items: Book [ ]
        }
        ...
    ]
}
```

Los `subject` son valores quemados de la siguiente lista: 

```js
const subjects = ['recent', 'bestseller', 'fiction', 'mystery', 'romance', 'science', 'history'];
```

- `GET: /api/books/search/:query` es el endopoint para la página catálogo que tiene una búsqueda simple. Devuelve una lista de 10 resultados porque la API de Google Books tiene de a limitarlos a 10, incluso cuando le pido más resultados. La respuesta es un JSON de la siguiente estructura: `{ items: Book [ ] }`.

- `POST: /api/books/search/` es el endpoint para la página de búsqueda avanzada. También devuelve una lista de 10 libros, porque a la API de Google Books le encanta no hacer lo que le pido. En fin, como es un POST, el request tiene que tener un `body`, que debe tener la siguiente estructura:

```json
{ 
	"keywords": String,
	"title": String,
	"author": String,
	"publisher" : String,
	"subject": String, // preferiblemente una categoría del BISAC
	"isbn": String // Código ISBN estándar para libros
}
```

Se puede que el cuerpo no tenga todos los parámetros, o que se le entregue strings vacíos; funciona de ambas formas. La respuesta es la misma que la del endpoint anterior.