---
title: Calificaciones
description: Organizar los registros de calificación del curso, poner notas, anularlas y bloquearlas, y qué ve el alumnado.
sidebar:
  order: 4
---

Disponible desde la 0.1.0. Las fórmulas llegan en una versión posterior.

## Los registros de un curso

Los registros de un curso forman un árbol. Arriba está el propio curso, con su total; dentro añades **categorías** para agrupar lo que se califica, y cada categoría tiene un total propio. Un **registro de calificación** es una cosa calificada: un elemento manual que defines (un examen oral, la participación) o una de las notas que da una actividad, que Kampus crea cuando la actividad la declara. Un registro tiene título, nota mínima y máxima, una nota para aprobar opcional, un peso, un multiplicador y un desplazamiento. La nota que cuenta es la nota multiplicada y desplazada, mantenida dentro del rango del registro.

Una categoría solo se borra cuando está vacía. Los registros manuales se pueden borrar; los de una actividad desaparecen con ella, y un total con su categoría.

## Poner notas

Elige un registro y pon las notas de varias personas a la vez: hasta 500 de una vez, todas o ninguna. Enviar de nuevo la misma nota no cambia nada, así que puedes repetir una importación sin riesgo. Cada cambio se guarda como una entrada con su origen (la actividad, tú, una importación), quién lo hizo y cuándo, y el historial de una nota es esa lista de entradas.

## Anular, bloquear y ocultar

- **Anula** una nota cuando la actividad dio una que quieres sustituir. La anulación cuenta hasta que la quites, aunque la actividad envíe después una nota nueva; la nota de la actividad se conserva a su lado.
- **Bloquea** un registro para detener todos los cambios en él y en sus notas, o una nota para protegerla; desbloquea para volver a cambiar. Enviar la misma nota a una bloqueada no es un cambio y se acepta; una distinta se rechaza.
- **Oculta** un registro o una nota hasta una fecha. Hasta entonces el alumnado no la ve; tú sí.

## Qué ve cada persona

El alumnado ve sus propias notas cuando están visibles, y la estructura de los registros. Quien puede ver las notas de todos las obtiene en el informe del calificador, que carga una página de personas cada vez; las notas ocultas solo las ve quien puede ver contenido oculto. La misma regla se aplica allí donde aparecen notas, así que una nota oculta nunca se filtra por otra vista.

## Totales

Cada categoría y el curso tienen un **total** que Kampus calcula con las notas de lo que contienen; un total no se califica a mano, aunque puedes anularlo como cualquier nota. El cálculo se hace en segundo plano poco después de que cambie una nota o un ajuste, así que un total puede tardar unos segundos. Elige cómo suma una categoría su contenido:

| Método | Cómo cuenta |
| --- | --- |
| Media | Cada elemento vale lo mismo, como proporción de su propio máximo |
| Media ponderada | Cada elemento cuenta según su peso |
| Media ponderada simple | Cada elemento cuenta según su rango, de modo que uno más grande pesa más |
| Natural | Las notas se suman tal cual; el máximo del total es la suma de los máximos |
| Mediana, menor, mayor, moda | La proporción central, la menor, la mayor o la más frecuente |

Una nota vacía se deja fuera del total o cuenta como cero, según elijas para la categoría. La **puntuación extra** suma al total sin subir su máximo. **Descartar las más bajas** y **conservar las más altas** valen para todos los métodos salvo natural, menor y mayor; cuando dos notas empatan, se descarta primero el elemento con el máximo mayor. También puedes dejar fuera de los totales la nota de una persona sin borrarla. Un total que suma algo oculto también se oculta, de modo que el alumnado nunca ve un número que delate una nota oculta.

## Escalas y letras

En lugar de números, un registro puede calificarse con los elementos de una **escala**, como Insuficiente, Regular, Bueno, Excelente. La administración y los gestores definen escalas en un campus, una categoría o un curso; una escala está disponible allí y por debajo, y gana la definición más cercana de un código. Cambiar una escala crea una versión nueva: los registros ya configurados conservan la versión con la que se crearon, así que sus notas no cambian de significado. Un registro con escala toma la posición de un elemento como nota, del primero al último.

Un **conjunto de letras** convierte un porcentaje en una letra, con tramos que empiezan en un porcentaje (A desde 90, B desde 75, etc.); un tramo empieza en 0. Se define del mismo modo y a un curso le aplica el conjunto más cercano.

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `records.view_own` | Ver las propias notas y la estructura de los registros | Todas las personas del curso |
| `records.view_all` | Ver las notas de todos y el informe del calificador | Profesorado, profesorado sin edición, gestores, administradores |
| `records.view_hidden` | Ver registros y notas ocultos | Profesorado, gestores, administradores |
| `records.grade` | Poner notas | Profesorado, profesorado sin edición, gestores, administradores |
| `records.override` | Anular notas | Profesorado, gestores, administradores |
| `records.lock` | Bloquear y desbloquear registros y notas | Profesorado, gestores, administradores |
| `records.hide` | Ocultar registros y notas hasta una fecha | Profesorado, gestores, administradores |
| `records.manage` | Añadir y cambiar categorías y registros | Profesorado, gestores, administradores |
| `records.export` | Exportar las notas de un curso | Profesorado, gestores, administradores |
