# ------------ Stage 1: Build the application ------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set working directory
WORKDIR /app

# Copy only necessary files for dependency resolution first (for better caching)
COPY pom.xml .
COPY src ./src

# Download dependencies and build the application
RUN mvn -B -DskipTests clean package

# ------------ Stage 2: Run the application ------------
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy the jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the Spring Boot default port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
