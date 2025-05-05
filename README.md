# Proyectobad115Frontend

Este proyecto fue generado utilizando [Angular CLI](https://github.com/angular/angular-cli) versión 19.2.10.

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

## Pasos para ejecutar el proyecto

### 1. Instalar Node.js
Asegúrate de tener instalado Node.js (versión recomendada 18.x o superior). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

### 2. Instalar Angular CLI
Abre una terminal y ejecuta:

```bash
npm install -g @angular/cli
```

### 3. Instalar dependencias del proyecto
En la raíz del proyecto, ejecuta:

```bash
npm install
```

### 4. Ejecutar la aplicación
Para iniciar el servidor de desarrollo, ejecuta:

```bash
ng serve
```

Luego abre tu navegador en [http://localhost:4200](http://localhost:4200).

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.

## Generación de código (Scaffolding)

Angular CLI incluye potentes herramientas para la generación de código. Para crear un nuevo componente, ejecuta:

```bash
ng generate component nombre-del-componente
```

Para ver la lista completa de esquemas disponibles (como `components`, `directives` o `pipes`), ejecuta:

```bash
ng generate --help
```

## Construcción del proyecto

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los archivos resultantes en el directorio `dist/`. Por defecto, la compilación para producción optimiza tu aplicación para mayor rendimiento y velocidad.

## Ejecución de pruebas unitarias

Para ejecutar pruebas unitarias con el runner [Karma](https://karma-runner.github.io), utiliza el siguiente comando:

```bash
ng test
```

## Pruebas end-to-end (e2e)

Para pruebas end-to-end, ejecuta:

```bash
ng e2e
```

Angular CLI no incluye un framework de pruebas end-to-end por defecto. Puedes elegir el que mejor se adapte a tus necesidades.

## Recursos adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página de [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
