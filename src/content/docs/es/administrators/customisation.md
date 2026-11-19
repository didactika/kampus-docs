---
title: Personalización
description: Las palabras que usa tu campus, las funciones que desactivas, los campos personalizados de los cursos, la disposición de las páginas, los menús, el tema y las reglas, por ámbito y copiados con paquetes.
sidebar:
  order: 4
---

Disponible desde 0.1.0.

La personalización cambia Kampus sin código. Todo se fija en un ámbito (la plataforma, un campus, una categoría, un curso o una sección) y vale ahí y debajo: gana el ámbito más cercano que lo fija, salvo que un ámbito superior lo **bloquee**. Cada respuesta dice de dónde viene su valor, y cada cambio queda registrado con quién lo hizo, el antes y el después.

## Las palabras de tu campus

Kampus llama a las cosas por su nombre habitual: curso, categoría, sección. Con `customise.term.manage` las renombras, por idioma, con singular y plural: una facultad puede llamar «asignaturas» a sus cursos mientras otra sigue con «cursos». Un idioma que no renombras conserva la palabra declarada, y quitar tu palabra recupera la de arriba.

| Término | Inglés | Español |
| --- | --- | --- |
| `courses.category` | category / categories | categoría / categorías |
| `courses.course` | course / courses | curso / cursos |
| `courses.section` | section / sections | sección / secciones |

Bloquea una palabra para mantenerla en todos los ámbitos de debajo: renombrarla ahí se rechaza hasta que la desbloquees.

## Desactivar funciones

Con `customise.flag.manage` activas o desactivas funciones en un ámbito. Desactivar una oculta lo que ofrece ahí y conserva sus datos: al reactivarla vuelve todo.

| Función | Activa por defecto | Cuando está desactivada |
| --- | --- | --- |
| `courses.groups` | Sí | Nadie puede crear grupos en los cursos de debajo; los grupos existentes se mantienen |

Un curso o una sección pueden reactivar una función, salvo que un ámbito superior la bloquee desactivada.

## Campos personalizados de los cursos

Con `customise.field.manage` en un campus o una categoría añades campos que tienen todos los cursos de debajo, por ejemplo créditos, un nivel o un tutor. Cada campo tiene un código único en su ámbito, un nombre y un tipo:

| Tipo | Guarda |
| --- | --- |
| Texto | Texto hasta su longitud (1000 caracteres si no fijas otra) |
| Entero | Un número entero |
| Fecha | Un día |
| Booleano | Sí o no |
| Opción | Una de sus opciones |
| Opciones | Cualquiera de sus opciones |
| Cuenta | Una persona del campus |

Un campo es **público**, lo ve quien ve el curso, o **privado**, solo con `customise.field.view`. Los profesores rellenan los campos de sus cursos con `customise.field.edit`. Cuando una categoría define un campo con el mismo código que uno del campus, a sus cursos se les aplica el suyo. Borrar un campo borra sus valores.

## Disposición de las páginas

Cada tipo de página tiene regiones, y con `customise.layout.manage` eliges qué widgets van en cada una y en qué orden. La página de un curso tiene las regiones superior (top), principal (main) y lateral (side):

| Widget | Muestra | Ajustes |
| --- | --- | --- |
| `courses.outline` | Las secciones del curso que ve el lector | Plegado o no |
| `courses.summary` | El resumen y las fechas del curso | Ninguno |
| `customise.text` | Un título y un texto, en cualquier página | Título, texto |

Un widget puede mostrarse solo a quien tenga un permiso. Se aplica entera la disposición del ámbito más cercano: dispón la página de curso para toda una categoría, y los profesores, que tienen `customise.layout.manage` en sus cursos, pueden reorganizar la suya salvo que la bloquees. Si se quita una parte de Kampus que ofrecía un widget, el widget deja de mostrarse sin más; la página sigue abriéndose.

## Menús

La navegación principal (`customise.main`) y los enlaces al pie de cada página (`customise.footer`) son menús que fijas con `customise.menu.manage`. Cada elemento tiene una etiqueta, una ruta del sitio (como `/courses`) o una dirección web, y opcionalmente el permiso que lo muestra; los elementos pueden contener elementos, hasta tres niveles y 100 en total. Cada persona ve solo los elementos que puede ver, y un elemento oculto oculta los de debajo.

## Tema

El tema fija los colores, la fuente, los tamaños y el movimiento del sitio con `customise.theme.manage`. Un ámbito fija solo los tokens que quiere cambiar; los demás vienen de arriba, y un tema bloqueado impide a los ámbitos de debajo cambiar nada.

| Tokens | Qué son |
| --- | --- |
| `primary`, `secondary`, `surface`, `background`, `danger`, cada uno con su color `on_` | Un color (`#rrggbb`) y el color del texto sobre él |
| `link` | El color de los enlaces |
| `font_family` | Las fuentes, como `Inter, sans-serif` |
| `font_size`, `spacing`, `radius` | Tamaños en píxeles |
| `motion` | `full`, o `reduced` para menos animación |

Kampus rechaza un tema cuyo texto costaría leer: cada color de texto mantiene un contraste de al menos 4,5 a 1 sobre su fondo, como pide WCAG 2.2 AA.

## Reglas

Una regla hace algo por sí sola cuando pasa algo: «cuando alguien se inscribe en un curso de esta categoría, añádelo al grupo Recién llegados». Con `customise.rule.manage` escribes reglas en un ámbito, y reaccionan a lo que pasa ahí y debajo. Cada regla tiene:

| Parte | Qué es |
| --- | --- |
| Disparador | Lo que pasa, como `enrol.enrolment_created` |
| Condiciones | Opcionales: comparaciones sobre lo que dice el evento (igual, distinto, uno de, presente), combinadas con todas, alguna y no |
| Acciones | Lo que hace, en orden, con sus parámetros, como `courses.add_to_group` con el grupo |

Las reglas nunca ejecutan código propio: solo las acciones que ofrecen las partes de Kampus. Solo puedes escribir una regla cuyas acciones podrías hacer tú, y sigue actuando como tú: si pierdes un permiso que necesita una acción, esa acción falla. Cambiar una regla te hace su propietario.

Cada vez que una regla reacciona, Kampus lo registra: con éxito, fallida con el motivo, u omitida cuando sus condiciones no se cumplían. Una acción fallida no se reintenta, y las anteriores quedan hechas. Una regla no puede reaccionar a lo que hacen sus propias acciones, y las cadenas de reglas se detienen tras cinco pasos. Desactiva una regla para conservarla sin que se ejecute.

## Paquetes

Un paquete copia personalización de un ámbito a otro, o a otro campus. Con `customise.package.manage` exportas lo que un ámbito fija por sí mismo, de los tipos que elijas: términos, funciones, campos (sin sus valores), disposiciones, menús, el tema y las reglas. Lo que el ámbito toma de arriba no se exporta.

Importar va en dos pasos. Primero Kampus lee el paquete y comprueba cada elemento contra el ámbito de destino: que las partes de Kampus de ahí lo declaran, que nada de arriba lo bloquea y que tienes el permiso de cada tipo. Muestra las diferencias, lo que añade y lo que cambia, con el valor anterior. Nada cambia hasta que lo aplicas; entonces se escribe todo a la vez, o nada, y el historial lo muestra como un solo cambio. Un paquete se aplica una vez.

Una importación añade y cambia, nunca quita. Un campo conserva su tipo: un campo del mismo código con otro tipo se rechaza. Las reglas se emparejan por nombre, y pasas a ser su propietario. Un parámetro de regla que nombra un registro, como un grupo, sigue nombrando ese registro: revisa las reglas después de importarlas en otro curso.

## Permisos de personalización

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `customise.term.manage` | Renombrar las palabras de un ámbito | Administradores, Gestor, Profesor |
| `customise.flag.manage` | Activar o desactivar funciones | Administradores, Gestor |
| `customise.field.manage` | Añadir y borrar campos personalizados | Administradores, Gestor |
| `customise.field.view` | Ver los campos personalizados privados | Administradores, Gestor, Profesor, Profesor sin edición |
| `customise.field.edit` | Rellenar los campos personalizados de un curso | Administradores, Gestor, Profesor |
| `customise.layout.manage` | Disponer los widgets de las páginas | Administradores, Gestor, Profesor |
| `customise.menu.manage` | Fijar los menús | Administradores, Gestor |
| `customise.theme.manage` | Fijar el tema | Administradores, Gestor |
| `customise.rule.manage` | Escribir, cambiar y quitar reglas | Administradores, Gestor |
| `customise.package.manage` | Exportar la personalización de un ámbito e importar paquetes | Administradores, Gestor |
