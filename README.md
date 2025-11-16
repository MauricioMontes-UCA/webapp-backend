# DOCUMENTACIÓN

## Índice

- [Indicaciones generales](#indicaciones-generales)
- [Servicio de libros](#servicio-de-libros)
- [Servicio de usuarios](#servicio-de-usuarios)

## Indicaciones generales

Cuando clonen el repositorio, favor correr en la terminal:

```
npm install
```

Este comando instala las dependencias que se encuentran en el `package.json`. Luego, crear un archivo `.env` en donde se encontrarán variables de entorno que son necesarias para funcionar. Esas variables de entorno estarán en otro medio, como en el equipo de teams, o bueno preguntas. La idea es que no se encuentren públicamente.

## Servicio de libros

### Endpoints

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

### Trabajando con el servicio

Los libros obtenidos por esta API obtienen información que nos puede ser relevante para el sitio web. La estructura de cada libro es la siguiente:

```js
{
    id: String, // Es muy importante trabajar con estas IDs para identificar los libros después
    title: String,
    authors: String[ ], // Pueden ser muchos autores
    publisher: String,
    publishedDate: String, // Que es una fecha realmente
    description: String, // Mucho texto

    // Es una lista de todos los identificadores estándar del libro
    industryIdentifiers: Object {
		type: String,
		identifier: String
	} [ ],

    pageCount: Int,

    // Estos pueden ser los géneros del libro o algo así.
    // Son categorías de un estándar llamado BISAC.
    categories: String[ ], 
    maturityRating: "NOT_MATURE" || "MATURE",
    imageLinks: Object { 
        smallThumbnail: String, // Es un URL de la portada
        thumbnail: String // Es otro URL de la portada
        // ...
        // Puede tener más elementos, no sé porqué lo quisieron guardar como objeto
    },
    language: String // Idioma del libro
}
```

Actualmente hay cuatro endpoints para el servicio de libros: 

- `GET: /api/books/:id` es el endpoint para la página de la reseña del usuario del libro. Obtiene la información del libro al que le pertenezca la ID ingresada por parámetro. Los elementos de alguna forma tienen que tener guardado el ID del libro para pasarlo por parámetro.

- `GET: /api/books/` es el endpoint a llamar para la página de catálogos. Devuelve un objeto `{ lists: [] }`, donde cada elemento de la lista es un objeto que contiene el género de la lista de libros:

```js
{   
    lists: [
        {
            subject: "recent",
            items: Book[ ]
        },
        {
            subject: "bestseller",
            items: Book[ ]
        }
        // ...
    ]
}
```

Los `subject` son valores quemados de la siguiente lista: 

```js
const subjects = ['recent', 'bestseller', 'fiction', 'mystery', 'romance', 'science', 'history'];
```

- `GET: /api/books/search/:query` es el endopoint para la página catálogo que tiene una búsqueda simple. Devuelve una lista de 10 resultados porque la API de Google Books tiene de a limitarlos a 10, incluso cuando le pido más resultados. La respuesta es un JSON de la siguiente estructura: `{ items: Book [ ] }`.

- `POST: /api/books/search/` es el endpoint para la página de búsqueda avanzada. También devuelve una lista de 10 libros, porque a la API de Google Books le encanta no hacer lo que le pido. En fin, como es un POST, el request tiene que tener un `body`, que debe tener la siguiente estructura:

```js
{ 
	keywords: "String",
	title: "String",
	author: "String",
	publisher: "String",
	subject: "String", // preferiblemente una categoría del BISAC
	isbn: "String" // Código ISBN estándar para libros
}
```

Se puede que el cuerpo no tenga todos los parámetros, o que se le entregue strings vacíos; funciona de ambas formas. La respuesta es la misma que la del endpoint anterior.

## Servicio de usuarios

### Endpoints

- `POST /api/users/`
  Es a esta dirección que se le tiene que mandar un objeto o JSON con la estructura:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "first_name": "string",
    "last_name": "string"
  }
  ```
  Responde con el usuario creado como objeto / JSON.

- `GET /api/users/:id`
  Esta dirección devuelve el objeto dada una ID de usuario.

- `GET /api/users`
  Obtiene todos los usuarios, por motivos de pruebas.

- `GET /api/users?email=`
  El parámetro query **tiene** que ser `email`, devuelve un usuario dado el correo. De lo contrario, devuelve todos los usuarios.

- `PATCH /api/users/:id`
  Dado una ID de usuario y un objeto o JSON con cualquiera de las propiedades descritas para la creación del usuario, actualiza su información con el cuerpo dado.

- `DELETE /api/users/:id`
  Dada la ID de un usuario, borra al usuario. Devuelve un JSON con el mensaje de confirmación.

### Trabajando con el servicio

Los usuarios que son devueltos por parte de la API contienen la siguiente estructura:

```js
{
  	"id": Int,
	"username": String,
	"email": String,
	"created_at": String,
	"first_name": String || null,
	"last_name": String || null
}
```

Nótese que los nombres pueden ser `null`.

Hay validaciones realizadas para que, a la hora de buscar por email, crear el usuario o actualizarlo:
- `email` tenga un formato válido.
- `email` sea único por cada usuario. Si ya hay un usuario con un email ingresado, no puede crearse el usuario.
- `password` para ser seguro tiene que tener 12 carácteres como mínimo, mayúsculas, minúsculas, y alguno símbolo especial (`#?!@$%^&*-`).

**Los métodos `GET` son solo para fines de pruebas con un servicio como Postman o Insomnia. Pueden usarse de momento MIENTRAS NO HAY UN SERVICIO DE AUTENTICACIÓN.**

Un ejemplo de cómo se usa la API con los métodos GET:
```
http://localhost:5000/api/users/9
```

Respuesta:
```json
{
	"id": 9,
	"username": "test1",
	"email": "test1@example.com",
	"created_at": "2025-11-16T06:16:07.457Z",
	"first_name": "Jane",
	"last_name": "Doe"
}
```

El resultado será el mismo si se usa `http://localhost:5000/api/users?email=test1@example.com`

En el caso del endpoint `POST /api/users/`, las propiedades `first_name` y `last_name` son opcionales, pero las otras tres (`email`, `username` y `password`) son obligatorias, si no están presentes devolverá un error.

Al usar el método `POST`, el cuerpo puede ser simplemente:

```js
{
	username: "testuser",
	email: "testing@example.com",
  	password: "$eCurE_P4sSw0rD"
}
```

Este no es el caso para el `PATCH /api/users/`. Si se le manda un cuerpo vacío, se procesará una actualización a pesar de que no hay nada que actualizar.
