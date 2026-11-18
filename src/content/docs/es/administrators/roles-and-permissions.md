---
title: Roles y permisos
description: Los roles por defecto de un campus, qué puede hacer cada uno y cómo funcionan las anulaciones, la congelación y "ver como".
sidebar:
  order: 1
---

Disponible desde 0.1.0.

Todo lo que una persona puede hacer en Kampus depende de los roles que tiene y de dónde los tiene. Un rol se tiene en un **ámbito**: la plataforma, un campus, una categoría, un curso, una sección o una actividad. Un rol en un ámbito vale ahí y en todo lo que cuelga de él.

## Roles por defecto

Cada campus nuevo recibe estos roles, cada uno creado a partir de la plantilla del mismo nombre. Puedes cambiar cualquiera y devolverlo a su plantilla cuando quieras; antes de restablecerlo, Kampus muestra en qué difiere.

| Rol | Permisos de acceso por defecto |
| --- | --- |
| Administrador de la plataforma | Todos |
| Administrador del campus | Todos |
| Gestor | Asignar y quitar roles, cambiar anulaciones (no las de riesgo), ver como, revisar |
| Creador de cursos | Ninguno de los permisos de acceso |
| Profesor | Asignar roles, ver como, revisar |
| Profesor sin edición | Revisar |
| Responsable de sección | Asignar roles, revisar |
| Estudiante, Mentor, Usuario autenticado | Ninguno de los permisos de acceso |
| Invitado | Ninguno, y nunca un permiso de escritura o de riesgo |

Los visitantes sin sesión leen con el rol **Invitado** del campus.

## Los permisos de acceso

| Permiso | Qué permite | Ámbito más bajo |
| --- | --- | --- |
| `access.grant.create` | Dar un rol a una persona | Sección |
| `access.grant.delete` | Quitar un rol a una persona | Sección |
| `access.override.update` | Cambiar el valor de un rol en un ámbito | Actividad |
| `access.override.risky` | Cambiar un permiso de riesgo en un ámbito | Actividad |
| `access.role.manage` | Crear, cambiar y restablecer roles | Campus |
| `access.scope.freeze` | Congelar y descongelar un ámbito | Actividad |
| `access.view_as` | Ver un ámbito como otro rol | Actividad |
| `access.review` | Consultar quién tiene qué roles y por qué se decide una comprobación | Actividad |

Las demás partes de Kampus declaran sus propios permisos; aparecerán aquí a medida que estén disponibles.

## Cómo se decide una comprobación

1. Cuentan los roles que la persona tiene en el ámbito y en sus antecesores, mientras la asignación esté vigente.
2. Para cada rol, el valor es la **anulación** más cercana desde el ámbito hasta el campus; si no hay ninguna, vale el valor propio del rol.
3. Cualquier **prohibir** rechaza. Si no, basta un **permitir**.

Toda decisión se puede explicar: Kampus muestra los roles considerados, el valor de cada uno y el ámbito del que viene.

## Roles asignables

Un rol solo puede dar, anular o "ver como" los roles que tiene **permitidos**. Por ejemplo, un profesor puede dar el rol de estudiante, pero no el de gestor. Esto se configura en cada rol.

## Reglas de seguridad

- Un campus siempre conserva al menos una persona que puede gestionarlo: Kampus rechaza un cambio que lo dejaría sin ninguna.
- En un ámbito **congelado** no se puede cambiar nada, solo leer.
- Las cuentas suspendidas pierden todos sus permisos hasta que se restauran.
- Cada cambio de un rol, una asignación o una anulación queda registrado con quién lo hizo y cuándo.

## Ver como

Con `access.view_as` puedes ver un curso, una sección o una actividad tal y como lo ve otro rol, por ejemplo como estudiante. Mientras ves como otro rol solo puedes leer, y solo dentro de ese ámbito. El inicio y el fin de cada sesión de "ver como" quedan registrados.
