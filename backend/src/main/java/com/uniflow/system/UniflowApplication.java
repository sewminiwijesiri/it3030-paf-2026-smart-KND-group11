package com.uniflow.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication(scanBasePackages = {"com.uniflow.system", "com.smartcampus.booking", "com.smartcampus.notification"})
public class UniflowApplication {

	public static void main(String[] args) {
		// Manually load .env from the root folder (one level up) 
		// and set them as system properties for Spring to find.
		Dotenv dotenv = Dotenv.configure()
				.directory("../")
				.ignoreIfMalformed()
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		SpringApplication.run(UniflowApplication.class, args);
	}

}
