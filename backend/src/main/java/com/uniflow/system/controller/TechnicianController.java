package com.uniflow.system.controller;

import com.uniflow.system.model.MaintenanceRequest;
import com.uniflow.system.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technician")
@CrossOrigin(origins = "http://localhost:3000")
public class TechnicianController {

    private final MaintenanceService maintenanceService;

    public TechnicianController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<MaintenanceRequest>> getTasks(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(maintenanceService.getRequestsForTechnician(email));
    }

    @PutMapping("/tasks/{id}/status")
    public ResponseEntity<MaintenanceRequest> updateTaskStatus(
            @PathVariable String id, 
            @RequestParam MaintenanceRequest.MaintenanceStatus status,
            @RequestBody(required = false) MaintenanceRequest updateDetails) {
        
        String notes = updateDetails != null ? updateDetails.getResolutionNotes() : null;
        List<String> attachments = updateDetails != null ? updateDetails.getAttachments() : null;
        
        return ResponseEntity.ok(maintenanceService.updateTicketDetails(id, status, notes, attachments));
    }

    @GetMapping("/test")
    public String technicianTest() {
        return "Welcome TECHNICIAN!";
    }
}
