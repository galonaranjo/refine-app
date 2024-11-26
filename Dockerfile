FROM node:20-slim

WORKDIR /app
COPY . .

RUN npm run install:all
RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080
CMD ["npm", "start"]
