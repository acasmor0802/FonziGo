FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY ./backend /app
RUN ./gradlew clean build --exclude-task test
EXPOSE 8080
CMD ["java", "-jar", "./build/libs/backend-0.0.1-SNAPSHOT.jar"]
