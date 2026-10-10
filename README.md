
## Preguntas Práctica 10

**¿Por qué el filtro atrapa la clase base y no cada error por separado?**

Porque con catch ErrorDeDominio atrapa a los cuatro errores y a cualquiera que se agregue después, mientras herede de ErrorDeDominio. Así no tienes que agregar cada nuevo error al filtro, con la posibilidad de que se te olvide.

**¿Qué pasa si se comenta next()?**

La petición se queda cargando y nunca llega respuesta ni tampoco sale ningún error.

**¿Por qué este middleware no podría decidir si un usuario tiene permiso para una ruta?**

Porque el middleware corre antes de que Nest sepa qué controller y qué método va a atender la petición. Entonces no puede leer cosas como @Publico()

**¿Por qué la petición que responde 409 no aparece en ese registro?**

Porque el tap solo corre cuando el controller responde bien. Si el service lanza un error, se brinca el interceptor y se va directo al filtro.

**¿Por qué este cambio rompe a cualquier cliente que ya estuviera usando la API?**

Porque cambia la forma de la respuesta. Antes GET /clases regresaba el arreglo directo y ahora viene dentro de data, entonces un cliente que leía res[0] ahora tiene que leer res.data[0].

**Si el servidor respondió en los dos casos, ¿quién bloquea y a quién protege?**

El navegador bloquea. Protege al usuario, no a la API.

**¿Por qué el campo se llama passwordHash y no password?**

Para que quede claro que ahí va el hash y no la contraseña plana. Así se evitan accidentes.

**¿Por qué los dos errores del inicio de sesión dicen exactamente lo mismo?**

Porque si fuera uno para cada cosa, cualquier persona iba a poder saber si el correo sí está registrado y sabiendo eso, seguir intentando acceder.

**Si el contenido se puede leer, ¿qué es lo que protege la firma?**

La firma no es para ocultar, sino que lo que hace es que no puedan cambiar lo que tiene. Por ejemplo si alguien cambia el rol, la firma ya no coincide y la API lanza un 401.

**¿Por qué es más seguro proteger todo y abrir a mano, que al revés?**

Porque si se te olvida poner el public te darás cuenta rápido, pero si se te olvida proteger una ruta que no debería estar abierta es bastante más difícil que te ddes cuenta.

**¿Cuál es la diferencia entre un 401 y un 403?**

401 es que no sabe quién eres y 403 es que sí sabe pero no tienes permiso para hacer eso.

**¿Cuántas líneas del AuthService tuvieron que cambiar para pasar de memoria a MySQL? ¿Por qué?**

Ninguna. El AuthService usa la interfaz UsuarioRepository y no sabe si los datos están en memoria o en MySQL.

**¿Por qué es importante tomar al usuario de los claims del token y no de un parámetro de la URL o del cuerpo?**

Porque la URL y el cuerpo los escribe el cliente y puede poner lo que quiera.



## Preguntas Práctica 9

**¿Qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?**

Ninguna, solo cambié el useClass en clases.module.ts para que usara ClasePrismaRepository.

**¿Por qué InscripcionesService no tuvo que cambiar ni una línea de las reglas de cupo y duplicados?**

Porque el service solo usa los métodos del repositorio y no le importa de dónde salen los datos. El repositorio de Prisma tiene los mismos métodos que el de memoria, así que sigue igual.

**Una de las cuatro opciones es indispensable: sin ella la validación no hace nada y tampoco avisa**

transform: true

**¿Por qué una interfaz no puede validar nada en tiempo de ejecución?**

Porque las interfaces desaparecen al compilar, entonces cuando corre el programa ya no existen y no hay dónde guardar las reglas de validación.

**¿Qué código de estado responde y qué trae en el cuerpo?**

Responde 400 Bad Request. En el cuerpo viene message, error y statusCode.

**¿Cuántas líneas quedó más corto el controlador?**

81 - 55 = 26 líneas más corto.

**Si la respuesta llega en los dos casos, ¿quién bloquea realmente y a quién protege?**

Bloquea el navegador, no el servidor. El servidor responde siempre, pero si el origen no está permitido, el navegador no deja que la página lea la respuesta. Protege al usuario, no a la API.





# Gimnasio API — Código base (Semana 5)

API REST en NestJS para el gimnasio: `Clases`, `Horarios`, `Miembros` e `Inscripciones`, cada
módulo con dominio, DTOs e infraestructura separados (patrón repositorio + inyección por token).
Los datos viven en memoria — ningún repositorio se conecta todavía a una base de datos real.

Este proyecto es el punto de partida de la Práctica 8 (Prisma) y la Práctica 9 (Blindar la API).

## Cómo correrlo

```bash
npm install
npm run start:dev
```

El servidor levanta en `http://localhost:3000`. En `peticiones.http` está la batería completa de
pruebas (requiere la extensión "REST Client" de VS Code).

## Estructura

```
src/
  clases/        CRUD de clases del gimnasio
  horarios/      CRUD de horarios (día, hora, cupo, entrenador)
  miembros/      CRUD de miembros del gimnasio
  inscripciones/ inscribir a un miembro a un horario, con reglas de cupo y duplicados
  datos/         datos de arranque (seed) que usan Horarios y Miembros
```

Cada módulo sigue la misma forma: `dominio/` (entidades + interfaz del repositorio), `dto/`,
`infra/` (repositorio en memoria) y el token de inyección en `<módulo>.tokens.ts`.

## Diagrama de la base de datos

![](diagrammysql.png)
