    # ------------ Stage 1: Build the application ------------
    FROM maven:3.9.6-eclipse-temurin-17 AS builder

    WORKDIR /app

    # Ensure mvnw is executable
    RUN chmod +x mvnw

    # Copy Maven wrapper and configs
    COPY pom.xml ./
    COPY mvnw ./
    COPY .mvn .mvn/

    # --- Diagnostic Step 1: Verify Java environment before Maven build ---
    RUN echo "--- Verifying Java environment in builder stage ---" && \
        java -version && \
        javac -version && \
        echo "--- Java environment check complete ---"

    # Preload dependencies
    RUN echo "--- Running dependency:go-offline ---" && \
        ./mvnw -Dmaven.repo.local=/tmp/m2-repo dependency:go-offline --batch-mode && \
        echo "--- dependency:go-offline complete ---"

    # Copy the source code
    COPY . .

    # Build the project
    # Add -e (show errors) and -X (debug output) for verbose logging
    # Add --batch-mode for non-interactive execution
    RUN echo "--- Building project with Maven ---" && \
        ./mvnw clean package -DskipTests -e -X --batch-mode && \
        echo "--- Maven build complete ---"

    # ------------ Stage 2: Run the application ------------
    FROM eclipse-temurin:17-jdk

    WORKDIR /app

    # Copy built JAR from builder
    COPY --from=builder /app/target/*.jar app.jar

    EXPOSE 8080

    # Start the Spring Boot app
    ENTRYPOINT ["java", "-jar", "app.jar"]
    