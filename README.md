# Entrevista laboral
## Requisitos
* Crear en una nueva carpeta el siguiente sitio web:
![alt text](https://github.com/newcombin/devskills/blob/main/design.png "Diseño web")
* Los datos del formulario deben ser enviados a la API, la tabla de la derecha debe recibir los datos de la misma al cargarse el sitio.
* Luego de cada inserción exitosa, se debe mostrar el nuevo miembro en la tabla, sin necesidad de volver a utilizar el endpoint GET.
* El boton reset debe limpiar los campos del formulario.
* El boton save debe enviar los datos a la API.
* El número de seguro social (ssn) es único y no puede repetirse en la lista.
* En caso de un intento de inserción erroneo, se debe informar dicho error.
* Al pasar 2 minutos de inactividad, se debe refrescar la tabla automáticamente.

## API
La página debe poder comunicarse con la API de este repositorio. La misma consta de 2 endpoints.
* GET http://localhost:8081/api/members - para obtener los miembros.

```json
[
    {
        "firstName": "Cosme",
        "lastName": "Fulanito",
        "address": "742 Evergreen Terrance",
        "ssn": "333-22-4444"
    },
    {
        "firstName": "Juan",
        "lastName": "Perez",
        "address": "Av. San Martín 242",
        "ssn": "321-44-1235"
    }
]
```

* POST http://localhost:8081/api/members - para añadir un nuevo miembro.

```json
{
    "firstName": "Cosme",
    "lastName": "Fulanito",
    "address": "742 Evergreen Terrance",
    "ssn": "333-22-4444"
}
```
* Para poder utilizarlos, el Authorization header debe formatearse como Bearer [token].

## AUTH
Para poder utilizar los 2 endpoint anteriores debe obtener un token y enviarlo en los llamados.
* POST http://localhost:8081/auth - para obtener el token.

```json
{
    "username": "sarah",
    "password": "connor"
}
```

## Start API server
* Clonar este repositorio: `git clone https://github.com/newcombin/devskillsadv.git`
* Ubicarse en el directorio: `cd devskillsadv`
* Instalar las dependencias: `npm install`
* Ejecutar el servidor: `npm run serve`

## Validaciones de la API
* **firstName, lastName y address:** más de 1 caracter, sin espacios a los costados (trim).
* **SSN:** debe tener el siguiente formato ###-##-#### (cada # es un número, los guiones son obligatorios).
* Si el front no cumple con las validaciones, se debe deshabilitar el botón de enviar.

## Condiciones y tips
* Los colores y formas son de caracter ilustrativo.
* No es necesario que sea mobile responsive.
* No es necesaria compatibilidad con IE o Edge.
* Se puede usar ES6 y HTML5 sin problemas.
* Se puede usar google :D.
* Se puede usar POSTMAN para verificar el funcionamento de la API.
* Crear un archivo README.md para indicar cómo se debe ejecutar la aplicación.
* Subir a un repositorio git con privilegios públicos de lectura y compartir el link como resultado.
