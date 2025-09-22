FROM node:16
WORKDIR /elf_app

COPY package*.json /elf_app
RUN npm install

COPY server/ /elf_app/

ENV PORT=3000
ENV DB_USER=postgres
ENV DB_HOST=elf-db
ENV DB_NAME=elf
ENV DB_PASSWORD=docker
ENV DB_PORT=5432

EXPOSE 3000

CMD [ "node", "index.js" ]