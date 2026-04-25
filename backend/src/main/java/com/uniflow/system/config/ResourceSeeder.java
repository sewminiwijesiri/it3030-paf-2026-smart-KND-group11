package com.uniflow.system.config;

import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.model.ResourceStatus;
import com.uniflow.system.catalogue.model.ResourceType;
import com.uniflow.system.catalogue.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class ResourceSeeder {

    @Bean
    CommandLineRunner seedResources(ResourceRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                System.out.println("Seeding actual campus resources...");

                List<Resource> resources = Arrays.asList(
                    createResource("Advanced Computer Lab B2", ResourceType.COMPUTER_LAB, 60, "Innovation Wing, Level 2", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", 
                        Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"), "08:00", "20:00"),
                    
                    createResource("Creative Media Studio", ResourceType.STUDIO, 15, "Arts Block, Room 405", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4", 
                        Arrays.asList("MONDAY", "WEDNESDAY", "FRIDAY"), "09:00", "18:00"),
                    
                    createResource("Executive Conference Hall", ResourceType.CONFERENCE_ROOM, 120, "Main Admin Building", "https://images.unsplash.com/photo-1497366216548-37526070297c", 
                        Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"), "07:00", "22:00"),
                    
                    createResource("Quantum Physics Lab", ResourceType.LABORATORY, 25, "Science Plaza, Floor 1", "https://images.unsplash.com/photo-1532094349884-543bc11b234d", 
                        Arrays.asList("TUESDAY", "THURSDAY"), "10:00", "16:00"),
                    
                    createResource("Central Library Study Suite", ResourceType.STUDY_ROOM, 8, "Library South Wing", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6", 
                        Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"), "00:00", "23:59")
                );

                repository.saveAll(resources);
                System.out.println("Successfully seeded " + resources.size() + " resources.");
            }
        };
    }

    private Resource createResource(String name, ResourceType type, int cap, String loc, String img, List<String> days, String start, String end) {
        Resource r = new Resource();
        r.setName(name);
        r.setType(type);
        r.setCapacity(cap);
        r.setLocation(loc);
        r.setImageUrl(img);
        r.setAvailableDays(days);
        r.setAvailableStartTime(LocalTime.parse(start));
        r.setAvailableEndTime(LocalTime.parse(end));
        r.setStatus(ResourceStatus.AVAILABLE);
        return r;
    }
}
