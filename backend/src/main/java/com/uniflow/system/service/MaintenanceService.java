package com.uniflow.system.service;

import com.uniflow.system.model.MaintenanceRequest;
import com.uniflow.system.repository.MaintenanceRepository;
import com.smartcampus.notification.service.NotificationService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final NotificationService notificationService;

    public MaintenanceService(MaintenanceRepository maintenanceRepository, NotificationService notificationService) {
        this.maintenanceRepository = maintenanceRepository;
        this.notificationService = notificationService;
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
        
        MaintenanceRequest.MaintenanceStatus oldStatus = request.getStatus();
        request.setStatus(status);
        if (notes != null) request.setResolutionNotes(notes);
        if (newAttachments != null && !newAttachments.isEmpty()) {
            if (request.getAttachments() == null) {
                request.setAttachments(new java.util.ArrayList<>(newAttachments));
            } else {
                java.util.List<String> currentAttachments = new java.util.ArrayList<>(request.getAttachments());
                currentAttachments.addAll(newAttachments);
                request.setAttachments(currentAttachments);
            }
        }
        request.setUpdatedAt(LocalDateTime.now());
        MaintenanceRequest savedRequest = maintenanceRepository.save(request);

        // Notify User and Admin about status changes
        if (oldStatus != status) {
            String title = "";
            String message = "";
            String targetUrlUser = "/my-tickets";
            String targetUrlAdmin = "/admin/maintenance";

            if (status == MaintenanceRequest.MaintenanceStatus.IN_PROGRESS) {
                title = "Technician On-Site";
                message = "Work has started on your request for " + request.getResourceName() + ".";
            } else if (status == MaintenanceRequest.MaintenanceStatus.RESOLVED) {
                title = "Issue Resolved";
                message = "The malfunction at " + request.getResourceName() + " has been rectified.";
            }

            if (!title.isEmpty()) {
                // Notify Requester
                notificationService.sendUserNotification(request.getRequesterEmail(), title, message, "MAINTENANCE", targetUrlUser);
                // Notify Admin
                notificationService.sendAdminNotification(title, "Operator Update: " + message, "MAINTENANCE", targetUrlAdmin);
            }
        }

        return savedRequest;
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
        MaintenanceRequest savedRequest = maintenanceRepository.save(request);

        // Notify Technician in real-time
        notificationService.sendUserNotification(
            technicianEmail,
            "New Task Assigned",
            "You have been assigned to a maintenance task for " + request.getResourceName() + ": " + request.getDescription(),
            "MAINTENANCE_ASSIGNMENT",
            "/technician/tasks"
        );

        return savedRequest;
    }

    public MaintenanceRequest createRequest(MaintenanceRequest request) {
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        if (request.getStatus() == null) request.setStatus(MaintenanceRequest.MaintenanceStatus.OPEN);
        
        MaintenanceRequest savedRequest = maintenanceRepository.save(request);
        
        // Notify Admins in real-time
        notificationService.sendAdminNotification(
            "New Maintenance Ticket",
            "A new ticket has been raised for " + request.getResourceName() + ": " + request.getDescription(),
            "MAINTENANCE",
            "/admin/maintenance"
        );
        
        return savedRequest;
    }

    public void deleteRequest(String id) {
        if (!maintenanceRepository.existsById(id)) {
            throw new RuntimeException("Request not found");
        }
        maintenanceRepository.deleteById(id);
    }
    
    public List<MaintenanceRequest> getHistoryByResource(String resourceName) {
        return maintenanceRepository.findByResourceName(resourceName);
    }
}
