## Ejercicio

En este ejercicio he usado React + Typescript, a nivel de componentes no he usado librerías de terceros, para asi practicar el uso de customHooks y componentes con gestión de lógica.

El proyecto a nivel de Despliegue usa [Netlify](https://www.netlify.com/), a travez de este servicio he implementado:

1. Un sistema de login dummy usando el producto functions de Netlify, con este he simulado una respuesta http al formulario de login, la respuesta de este login es un token JWT que sera adjunto a los futuros request.
2. Un sistema CRUD dummy usando el servicio [mockapi.io](https://mockapi.io/), con este he simulado las interacciones CRUD asociadas a la vista panel.

Todo ha sido empaquetado a travez de [Vite](https://vitejs.dev/).

## Despliegue

### Local

```bash
## Instalar dependecias
npm i

## netlify login ( https://docs.netlify.com/cli/get-started/ )
npx netlify login

## Entorno de desarrollo
npm run netlify:dev
```

### Producción

Asociar el repositorio a Netlify y listo

## Todo

1. [ ] Asociar test.
2. [x] Cachear el token para una mejor experiencia de autentificación.
