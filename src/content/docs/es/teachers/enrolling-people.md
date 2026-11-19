---
title: Matricular a personas
description: Los métodos de matriculación de un curso, matricular a mano, claves y aprobaciones, grupos de sistema, y suspender o quitar matrículas.
sidebar:
  order: 2
---

Disponible desde 0.1.0.

## Métodos de matriculación

Las personas participan en tu curso mediante los **métodos de matriculación** que le añades. Cada uno da un rol (estudiante, por ejemplo) y puede tener:

| Ajuste | Qué hace |
| --- | --- |
| Periodo de apertura | Solo se puede entrar entre estas fechas |
| Duración por defecto | Las matrículas terminan tantos días después de empezar, salvo que indiques un fin |
| Capacidad | No más personas que estas, aunque muchas entren a la vez |
| Aprobación | Las personas piden entrar y tú decides |
| Regla de expiración | Cuando una matrícula termina: suspenderla, quitarla, o mantener a la persona sin el rol |

Solo puedes añadir un método que dé un rol que tú puedas dar: un profesor puede matricular estudiantes, pero no gestores. Desactivar un método detiene la participación que da sin borrar nada; borrarlo quita sus matrículas, y los roles y grupos que trajeron.

## Los métodos

- **Manual**: matriculas tú a las personas, una o muchas a la vez; Kampus te dice qué pasó con cada una.
- **Autoinscripción**: las personas se matriculan solas. Dale una clave para compartir con tus estudiantes, y claves para grupos: quien da la clave de un grupo entra en ese grupo. Con aprobación, te envían una solicitud y tú la apruebas o la rechazas.
- **Grupo de sistema**: los miembros de un grupo de tu campus, como una promoción. Kampus matricula a quien entra en el grupo y quita a quien sale; no los matriculas ni los quitas a mano.

## Gestionar matrículas

Puedes suspender una matrícula y reactivarla después: mientras está suspendida la persona no participa y pierde el rol, y no se borra nada. Puedes cambiar su inicio y su fin, y quitarla. Quitar una matrícula nunca borra las calificaciones ni el progreso de la persona, y solo retira lo que esa matrícula dio: un rol dado a mano, o por otra matrícula, se queda.

Solo las personas que participan en el curso pueden estar en sus grupos, y mientras haya participantes en un curso publicado no puede volver a borrador.
