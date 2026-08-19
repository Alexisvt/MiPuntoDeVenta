FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY backend ./backend
WORKDIR /workspace/backend
RUN ./mvnw -B -DskipTests package
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
