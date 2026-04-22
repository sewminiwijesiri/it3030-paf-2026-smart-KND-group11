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

    public MaintenanceRequest getRequestById(String id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
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

    public MaintenanceRequest updateTicketDetails(String id, MaintenanceRequest.MaintenanceStatus status, String notes, List<String> newAttachments) {
        MaintenanceRequest request = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus(status);
        if (notes != null) request.setResolutionNotes(notes);
        if (newAttachments != null && !newAttachments.isEmpty()) {
            if (request.getAttachments() == null) {
                request.setAttachments(newAttachments);
            } else {
                request.getAttachments().addAll(newAttachments);
            }
        }
        request.setUpdatedAt(LocalDateTime.now());
        return maintenanceRepository.save(request);
    }

    public List<MaintenanceRequest> getAllRequests() {
        return maintenanceRepository.findAll();
    }

    public List<MaintenanceRequest> getRequestsForUser(String email) {
        return maintenanceRepository.findByRequesterEmail(email);
    }

    public MaintenanceRequest assignTechnician(String id, String technicianEmail) {
        MaintenanceRequest request = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setTechnicianEmail(technicianEmail);
        request.setUpdatedAt(LocalDateTime.now());
        return maintenanceRepository.save(request);
    }

    public MaintenanceRequest createRequest(MaintenanceRequest request) {
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        if (request.getStatus() == null) request.setStatus(MaintenanceRequest.MaintenanceStatus.OPEN);
        return maintenanceRepository.save(request);
    }

    public void deleteRequest(String id) {
        if (!maintenanceRepository.existsById(id)) {
            throw new RuntimeException("Request not found");
        }
        maintenanceRepository.deleteById(id);
    }
}
