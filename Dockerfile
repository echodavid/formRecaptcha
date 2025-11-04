# ---------- Etapa de construcción ----------
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración primero (para aprovechar cache de dependencias)
COPY package*.json ./

# Instalar dependencias (solo las necesarias)
RUN npm install --only=production

# Copiar el resto del código de la aplicación
COPY . .

# ---------- Etapa final ----------
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar desde la etapa de construcción
COPY --from=build /usr/src/app .

# Variables de entorno (pueden sobreescribirse en el entorno real)
ENV NODE_ENV=production \
    PORT=3000

# Exponer puerto
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]
