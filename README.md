# Indicaciones generales

Cuando clonen el repositorio, favor correr en la terminal:

```
npm install
```

Este comando instala las dependencias que se encuentran en el `package.json`. Luego, crear un archivo `.env` en donde se encontrarán variables de entorno que son necesarias para funcionar. Esas variables de entorno estarán en otro medio, como en el equipo de teams, o bueno preguntas. La idea es que no se encuentren públicamente.

Para obtener información de un libro por su id, hacer la consulta con `axios` en el frontend usando el siguiente enlace:
- http://localhost:5000/api/books/:id