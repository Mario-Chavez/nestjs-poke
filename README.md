<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
 npm install
```

3. Tener CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de dato

```
docker-compose up -d
```

5. Clonar el archivo `.env.template` y renombrar la copia a `.env`
6. Llenar la variables de entornos definidas en el `.env`

7. Ejecutar la aplicacion en dev:

```
npm run start:dev
```

8. Reconstruir la DB con la semilla siguiente comando:

```
http://localhost:3000/api/v2/seed
```

## Stack usado

- MongoDb
- Nest
