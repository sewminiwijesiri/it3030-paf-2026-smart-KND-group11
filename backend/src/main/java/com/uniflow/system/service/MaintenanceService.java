package com.uniflow.system.service;

import com.uniflow.system.model.MaintenanceRequest;
import com.uniflow.system.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    public List<MaintenanceRequest> getRequestsForTechnician(String email) {
        return maintenanceRepository.findByTechnicianEmail(email);
    }

    public MaintenanceRequest updateStatus(String id, MaintenanceRequest.MaintenanceStatus status) {
        MaintenanceRequest request = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        request.setUpdatedAt(LocalDateTime.now());
        return maintenanceRepository.save(request);
    }

    public List<MaintenanceRequest> getAllRequests() {
        return maintenanceRepository.findAll();
    }

    public MaintenanceRequest createRequest(MaintenanceRequest request) {
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        if (request.getStatus() == null) request.setStatus(MaintenanceRequest.MaintenanceStatus.PENDING);
        return maintenanceRepository.save(request);
    }
}
