# ------------ Stage 1: Build the application ------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy Maven wrapper and configs
COPY pom.xml ./
COPY mvnw ./
COPY .mvn .mvn/

# Preload dependencies
RUN ./mvnw dependency:go-offline

# Copy the source code
COPY . .

# Build the project
RUN ./mvnw clean package -DskipTests

# ------------ Stage 2: Run the application ------------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Start the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
