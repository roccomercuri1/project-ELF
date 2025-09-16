# Base Image use to build image
FROM postgres 
# Sets the DB password
ENV POSTGRES_PASSWORD docker
# Sets the DB name
ENV POSTGRES_DB elf
# Copies contents to 'elf.sql' over to Image and DB entry point
COPY elf.sql /docker-entrypoint-initdb.d/
