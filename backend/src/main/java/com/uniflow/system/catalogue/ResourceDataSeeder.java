package com.uniflow.system.catalogue;

import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.model.ResourceStatus;
import com.uniflow.system.catalogue.model.ResourceType;
import com.uniflow.system.catalogue.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ResourceDataSeeder implements CommandLineRunner {

    private final ResourceRepository resourceRepository;
    private final com.uniflow.system.repository.MaintenanceRepository maintenanceRepository;

    public ResourceDataSeeder(ResourceRepository resourceRepository, 
                             com.uniflow.system.repository.MaintenanceRepository maintenanceRepository) {
        this.resourceRepository = resourceRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed data if the collection is empty to avoid duplicates
        if (resourceRepository.count() == 0) {
            seedResources();
        }
        if (maintenanceRepository.count() == 0) {
            seedMaintenanceRequests();
        }
    }

    private void seedMaintenanceRequests() {
        String technicianEmail = "sewminiwijesiri5@gmail.com";
        
        com.uniflow.system.model.MaintenanceRequest req1 = new com.uniflow.system.model.MaintenanceRequest();
        req1.setResourceName("Computer Lab B2");
        req1.setDescription("Network switches in rack 4 are unresponsive. High latency reported by students.");
        req1.setTechnicianEmail(technicianEmail);
        req1.setPriority(com.uniflow.system.model.MaintenanceRequest.MaintenancePriority.HIGH);
        req1.setStatus(com.uniflow.system.model.MaintenanceRequest.MaintenanceStatus.PENDING);
        req1.setCreatedAt(java.time.LocalDateTime.now());
        
        com.uniflow.system.model.MaintenanceRequest req2 = new com.uniflow.system.model.MaintenanceRequest();
        req2.setResourceName("Lecture Hall A");
        req2.setDescription("Main projector bulb replacement needed. Brightness has dropped significantly.");
        req2.setTechnicianEmail(technicianEmail);
        req2.setPriority(com.uniflow.system.model.MaintenanceRequest.MaintenancePriority.MEDIUM);
        req2.setStatus(com.uniflow.system.model.MaintenanceRequest.MaintenanceStatus.IN_PROGRESS);
        req2.setCreatedAt(java.time.LocalDateTime.now());

        maintenanceRepository.saveAll(java.util.Arrays.asList(req1, req2));
        System.out.println(">>> Maintenance Requests seeded successfully.");
    }

    private void seedResources() {
        List<Resource> resources = Arrays.asList(
            // Lecture Halls
            new Resource("Lecture Hall A", ResourceType.LECTURE_HALL, 250, "Main Building, Ground Floor", 
                Arrays.asList("08:00-10:00", "10:00-12:00", "14:00-16:00"), ResourceStatus.AVAILABLE),
            new Resource("Lecture Hall B", ResourceType.LECTURE_HALL, 180, "Main Building, 1st Floor", 
                Arrays.asList("09:00-11:00", "13:00-15:00"), ResourceStatus.AVAILABLE),
            
            // Labs
            new Resource("Computer Lab B2", ResourceType.LAB, 40, "Engineering Block, Level 2", 
                Arrays.asList("08:00-17:00"), ResourceStatus.AVAILABLE),
            new Resource("Physics Research Lab", ResourceType.LAB, 15, "Science Wing, Ground Floor", 
                Arrays.asList("10:00-16:00"), ResourceStatus.MAINTENANCE),
            new Resource("Chemistry Lab 01", ResourceType.LAB, 30, "Science Wing, 1st Floor", 
                Arrays.asList("08:00-12:00"), ResourceStatus.AVAILABLE),

            // Meeting Rooms
            new Resource("Meeting Room Admin 1", ResourceType.MEETING_ROOM, 10, "Administration Block, Level 3", 
                Arrays.asList("09:00-10:00", "11:00-12:00"), ResourceStatus.AVAILABLE),
            new Resource("Student Council Hub", ResourceType.MEETING_ROOM, 20, "Student Center, 2nd Floor", 
                Arrays.asList("10:00-18:00"), ResourceStatus.AVAILABLE),
            
            // Assets (Projectors / Cameras)
            new Resource("Projector P-01 (Portable)", ResourceType.PROJECTOR, 0, "IT Support Room", 
                Arrays.asList("Daily 08:00-16:00"), ResourceStatus.AVAILABLE),
            new Resource("Projector P-05 (Ultra HD)", ResourceType.PROJECTOR, 0, "Main Library Counter", 
                Arrays.asList("Daily 09:00-17:00"), ResourceStatus.BUSY),
            new Resource("Digital SLR Camera C-02", ResourceType.CAMERA, 0, "Media Lab Storage", 
                Arrays.asList("Daily 08:00-16:00"), ResourceStatus.AVAILABLE),
            new Resource("Streaming Kit S-01", ResourceType.CAMERA, 0, "Auditorium Control Room", 
                Arrays.asList("Special Request Only"), ResourceStatus.OUT_OF_ORDER)
        );

        resourceRepository.saveAll(resources);
        System.out.println(">>> Facilities & Assets Catalogue Seeded successfully with " + resources.size() + " resources.");
    }
}
