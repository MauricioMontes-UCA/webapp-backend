# DOCUMENTACIÓN

## Índice

- [Indicaciones generales](#indicaciones-generales)
- [Servicio de libros](#servicio-de-libros)
- [Servicio de autenticación](#servicio-de-autenticación)
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



## Servicio de autenticación

### Endpoints disponibles

- `POST /api/auth/login`
  Se le pasa el correo y la contraseña del usuario, y hace la validación. Si el proceso de autenticación ha sido el correcto, devuelve la información del usuario, además de devolver un token de autenticación que se inyecta en una cookie. *La cookie de sesión solo dura una hora*

- `DELETE /api/auth/logout`
  No tiene porqué ser un método DELETE, pero tiene más sentido semánticamente. Si iniciaste sesión, entonces cierras la sesión. Borra el token de autenticación.

### Trabajando con el servicio

La cookie sirve para trabajar con rutas protegidas y para hacer solicitudes que solo el usuario debería hacer. En el contexto de la API, esto hace que solo el usuario pueda:

- Obtener información de su cuenta.
- Actualizar / cambiar información de su cuenta.
- Borrar su cuenta.

Para trabajar con `POST /api/auth/login`, el cuerpo simplemente tiene que tener el correo y la contraseña:

```json
{
  "email": "test@example.com",
  "password": "VerySecur3_PassW0rd"
}
```

Y, si las credenciales están buenas, el resultado es el usuario:

```json
{
	"id": 4,
	"username": "test",
	"email": "test@example.com",
	"created_at": "2025-11-16T06:16:07.457Z",
	"first_name": "Jane",
	"last_name": "Doe"
}
```

Además, habrá un token dentro de una cookie. Este token de autenticación solo dura una hora, entonces cuando pase más de una hora, el token ya no es válido y se tiene que volver a iniciar sesión. La cookie debería manejarse automáticamente por el navegador, así que no debería haber mucho problema en cómo usarla.

Y, a la hora de cerrar sesión, simplemente se llama al método `DELETE /api/auth/logout`. Este limpiará el token de sesión sí existe uno, y si no, pues no pasa nada realmente.

## Servicio de usuarios

### Endpoints

- `GET /api/users/`
  Devuelve a todos los usuarios. Si hay dificultades con la conexión de la base de datos, este método puede ser usado para verificar si se creó un usuario, se modificó, etc.

- `GET /api/users?email=`
  El parámetro query **tiene** que ser `email`, devuelve un usuario dado el correo. De lo contrario, devuelve todos los usuarios.

- `GET /api/users/:id`
  Esta dirección devuelve el objeto dada una ID de usuario.

- `POST /api/users`
  Cuando es un método POST, espera un cuerpo con las siguientes propiedades:
  ```js
  {
    "username": String,
    "email": String,
    "password": String,
    "first_name": String || null,
    "last_name": String || null
  }
  ```
  Responde con el usuario creado como objeto / JSON, además de un token de autenticación para que, al crearse el usuario, el flujo sea iniciar sesión y que empiece a usar el sitio web.

- `GET /api/users/me`
  Requiere de que el usuario tenga un token de autenticación para usarse. Este es el método a usar en el frontend para obtener información del usuario.

- `PATCH /api/users/me`
  Requiere de un token de autenticación para usarse. De esta forma, solo el usuario puede modificar su propia cuenta.

- `DELETE /api/users/me`
  Requiere de un token de autenticación para usarse. De esta forma, solo el usuario puede borrar su propia cuenta.

### Trabajando con el servicio

**Los métodos `GET` que no requieren de autenticación son solo para fines de pruebas con un servicio como Postman o Insomnia. Solo trabajar con métodos que requieran de autenticación en el frontend.**

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
No se devuelve ni el hash de la contraseña por motivos de seguridad.

Hay validaciones realizadas para que, a la hora de buscar por email, crear el usuario o actualizarlo:
- `email` tenga un formato válido.
- `email` sea único por cada usuario. Si ya hay un usuario con un email ingresado, no puede crearse el usuario.
- `password` para ser seguro tiene que tener 12 carácteres como mínimo, mayúsculas, minúsculas, y alguno símbolo especial (`#?!@$%^&*-`).

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

Para poder trabajar con el resto de los métodos, esto se puede hacer solo con un usuario que se acaba de crear; o iniciando sesión con otro usuario. De ahí, los métodos de GET, PATCH y DELETE de la ruta `/api/users/me` solo pueden ser usados con el usuario usado en cuestión.

Si no hay un token de sesión, lanzará un error:
```json
{
	"message": "Acceso denegado. No se proporcionó un token de autenticación.",
	"code": 401
}
```

Ahora, una vez con la sesión de un usuario iniciada, el método GET devuelve la información propia del usuario:

*Llamada:*
```
GET http://localhost:5000/api/users/me
```

*Respuesta si se inició sesión con `test1@example.com`:*
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

Ahora, para el método PATCH, el cuerpo puede ser cualquier de las cinco propiedades que tiene el usuario: `email`, `username`, `password`, `first_name`, `last_name`. Si se ingresa un email, se verifica si es un email válido y si no está siendo ocupado por otro usuario. Si se ingresa una contraseña, se verifica que la contraseña cumple con las condiciones para ser segura.

*Llamada:*
```
PATCH http://localhost:5000/api/users/me
```

*Cuerpo de la solicitud:*
```json
{
  "username": "i lack basic creativity",
	"email": "basic@example.com",
}
```

La respuesta será la nueva información del usuario, y un nuevo token de sesión con la información actualizada.

El método DELETE solo sirve para borrar al usuario. Debería haber algo en el frontend que prevenga que se haga fácilmente, por lo menos un mensaje de confirmación o algo. Simplemente se llama a `DELETE http://localhost:5000/api/users/me`, y ya está, el usuario ya no existe. Además, se borra el token de sesión.