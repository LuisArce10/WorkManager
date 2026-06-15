package com.workmanager.workmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.workmanager.workmanager",
        "config",
        "controlador",
        "servicio",
        "repositorios",
        "entidades",
        "dto"
})
@EntityScan(basePackages = {"entidades"})
@EnableJpaRepositories(basePackages = {"repositorios"})
public class WorkManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkManagerApplication.class, args);
    }
}
