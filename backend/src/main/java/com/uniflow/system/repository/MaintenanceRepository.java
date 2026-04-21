package com.uniflow.system.repository;

import com.uniflow.system.model.MaintenanceRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MaintenanceRepository extends MongoRepository<MaintenanceRequest, String> {
    List<MaintenanceRequest> findByTechnicianEmail(String technicianEmail);
    List<MaintenanceRequest> findByRequesterEmail(String requesterEmail);
    List<MaintenanceRequest> findByStatus(MaintenanceRequest.MaintenanceStatus status);
}
