# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

COPY service-ticket-tool/pom.xml ./
COPY service-ticket-tool/mvnw ./
COPY service-ticket-tool/.mvn .mvn/
RUN chmod +x mvnw && ./mvnw dependency:go-offline

COPY service-ticket-tool/ .

RUN ./mvnw clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
