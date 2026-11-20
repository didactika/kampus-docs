---
title: Ficheros y cuotas
description: Cómo se guardan los ficheros, quién los lee, y cómo limitar el espacio que puede usar un campus, un curso o una persona.
sidebar:
  order: 5
---

Disponible desde 0.1.0.

## Cómo se guardan los ficheros

Cada fichero pertenece a algo: una foto de perfil a una persona, y más adelante el material de una actividad o una entrega a las suyas. Quien puede ver ese algo puede leer su fichero, y nadie más; un fichero que nadie adjuntó a nada en un día se elimina. El mismo contenido se guarda una sola vez, lo usen cuantos ficheros lo usen, y el contenido que ya no usa ningún fichero se borra a los siete días.

Cuando el operador configura un antivirus, cada subida se escanea antes de guardarse, y el contenido infectado se rechaza con `files.infected`; nunca se guarda. Los enlaces a los ficheros duran cinco minutos. El contenido que podría ejecutarse en un navegador, como HTML o SVG, solo se descarga, nunca se abre dentro de Kampus.

## Cuotas

Con `files.quota.manage` limitas cuánto espacio pueden ocupar los ficheros:

| Cuota | Cuenta |
| --- | --- |
| De un campus, una categoría, un curso o una sección | Los ficheros de ese lugar y de todos los lugares de dentro: un límite en una categoría cubre todos sus cursos |
| De una persona | Los ficheros que esa persona subió, estén donde estén |

Un fichero cuenta desde que se adjunta a lo que lo posee hasta que se elimina. Cuando una subida pasaría un límite, Kampus la rechaza antes de empezar, con `files.quota_exceeded`; si dos subidas compiten por el último espacio, solo se queda la que cabe. Sin límite, no se rechaza nada.

| Permiso | Qué permite | Roles por defecto |
| --- | --- | --- |
| `files.quota.manage` | Fijar las cuotas de lugares y personas | Administradores, Gestor |
