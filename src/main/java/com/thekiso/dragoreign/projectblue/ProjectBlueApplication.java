package com.thekiso.dragoreign.projectblue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@SpringBootApplication
@Configuration
public class ProjectBlueApplication {

	private static final Logger log = LoggerFactory.getLogger(ProjectBlueApplication.class);

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(ProjectBlueApplication.class);
		Environment env = app.run(args).getEnvironment();
		log.info("\n---------------------------------------------------------------------------------- \n" +
				"Application '{}' is running. Access local URL: http://localhost:{} \n" +
				"----------------------------------------------------------------------------------", env.getProperty("spring.application.name"), env.getProperty("server.port") );
	}

}
