# ------------ Stage 1: Build the application ------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set the working directory
WORKDIR /app

# Copy pom.xml and Maven wrapper first
COPY pom.xml ./
COPY mvnw ./
COPY .mvn .mvn/

# Give permission and go offline (optional)
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copy the entire source code
COPY . .

# Build the application (skip tests)
RUN ./mvnw clean package -DskipTests

# ------------ Stage 2: Run the application ------------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the jar from the builder
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
