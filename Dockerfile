# ------------ Stage 1: Build the application ------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy only necessary files for efficient Docker layer caching
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN ./mvnw dependency:go-offline

# Copy rest of the source code
COPY . .

# Build the app
RUN ./mvnw clean package -DskipTests

# ------------ Stage 2: Run the application ------------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose default Spring Boot port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
