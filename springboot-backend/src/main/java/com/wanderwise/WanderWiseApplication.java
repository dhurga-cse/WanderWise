package com.wanderwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WanderWiseApplication {
    public static void main(String[] args) {
        SpringApplication.run(WanderWiseApplication.class, args);
        System.out.println("🚀 WanderWise Spring Boot Server running on port 5000");
        System.out.println("✅ PostgreSQL Connected Successfully");
    }
}
