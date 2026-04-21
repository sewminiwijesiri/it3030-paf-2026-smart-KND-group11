package com.uniflow.system.controller;

import com.uniflow.system.model.MaintenanceRequest;
import com.uniflow.system.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:3000")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> createTicket(@RequestBody MaintenanceRequest request, Authentication authentication) {
        request.setRequesterEmail(authentication.getName());
        return ResponseEntity.ok(maintenanceService.createRequest(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<MaintenanceRequest>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(maintenanceService.getRequestsForUser(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(maintenanceService.getRequestById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MaintenanceRequest>> getAllTickets() {
        return ResponseEntity.ok(maintenanceService.getAllRequests());
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaintenanceRequest> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianEmail) {
        return ResponseEntity.ok(maintenanceService.assignTechnician(id, technicianEmail));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MaintenanceRequest> updateStatus(
            @PathVariable String id,
            @RequestParam MaintenanceRequest.MaintenanceStatus status,
            @RequestBody(required = false) MaintenanceRequest updateDetails) {
        
        String notes = updateDetails != null ? updateDetails.getResolutionNotes() : null;
        List<String> attachments = updateDetails != null ? updateDetails.getAttachments() : null;
        
        return ResponseEntity.ok(maintenanceService.updateTicketDetails(id, status, notes, attachments));
    }
}
