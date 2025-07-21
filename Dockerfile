# ------------ Stage 1: Build the application ------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy Maven wrapper and configuration files FIRST
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Ensure mvnw is executable
RUN chmod +x mvnw

# Preload Maven dependencies (optional caching step)
RUN ./mvnw -B -Dmaven.repo.local=/tmp/m2-repo dependency:go-offline

# Copy full source (after wrapper setup)
COPY . .

# Build the project
RUN ./mvnw -B -Dmaven.repo.local=/tmp/m2-repo clean install -DskipTests

# ------------ Stage 2: Run the application ------------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy JAR from previous build
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Start the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
