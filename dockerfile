FROM node:22-alpine

# directorio de trabajo dentro del contenedor
WORKDIR /app

# copia los archivos de dependencias primero
# esto aprovecha el cache de Docker, si no cambian las dependencias
# no reinstala todo en cada build
COPY package*.json ./

RUN npm install

# copia el resto del código de la aplicación
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]