From postgres:17.2-alpine
ENV POSTGRES_DB fonzigo
ENV POSTGRES_USER fonzi
ENV POSTGRES_PASSWORD fonzipass
COPY ./init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432