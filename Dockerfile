    # ------------ Stage 1: Build the application ------------
    FROM maven:3.9.6-eclipse-temurin-17 AS builder

    WORKDIR /app

    # Explicitly set JAVA_HOME (usually already set by base image, but good for diagnostics)
    ENV JAVA_HOME /opt/java/openjdk
    ENV PATH $JAVA_HOME/bin:$PATH

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
        echo "JAVA_HOME is: $JAVA_HOME" && \
        echo "PATH is: $PATH" && \
        echo "--- Java environment check complete ---"

    # Preload dependencies
    RUN echo "--- Running dependency:go-offline ---" && \
        ./mvnw -Dmaven.repo.local=/tmp/m2-repo dependency:go-offline --batch-mode && \
        echo "--- dependency:go-offline complete ---"

    # Copy the source code
    COPY . .

    # Build the project
    RUN echo "--- Building project with Maven ---" && \
        ./mvnw clean install -DskipTests -e -X --batch-mode && \
        echo "--- Maven build complete ---"

    # ------------ Stage 2: Run the application ------------
    FROM eclipse-temurin:17-jdk

    WORKDIR /app

    # Copy built JAR from builder
    COPY --from=builder /app/target/*.jar app.jar

    EXPOSE 8080

    # Start the Spring Boot app
    ENTRYPOINT ["java", "-jar", "app.jar"]
    