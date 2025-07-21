FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

COPY service-ticket-tool/pom.xml .
COPY service-ticket-tool/.mvn .mvn
COPY service-ticket-tool/mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline

COPY service-ticket-tool .

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
