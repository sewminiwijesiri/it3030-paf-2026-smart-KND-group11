package com.uniflow.system.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "maintenance_requests")
public class MaintenanceRequest {

    @Id
    private String id;
    private String resourceId;
    private String resourceName;
    private String requesterEmail;
    private String technicianEmail;
    private String description;
    private String category;
    private String preferredContact;
    private java.util.List<String> attachments;
    private String resolutionNotes;
    private MaintenanceStatus status;
    private MaintenancePriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum MaintenanceStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED, PENDING
    }

    public enum MaintenancePriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }
    public String getRequesterEmail() { return requesterEmail; }
    public void setRequesterEmail(String requesterEmail) { this.requesterEmail = requesterEmail; }
    public String getTechnicianEmail() { return technicianEmail; }
    public void setTechnicianEmail(String technicianEmail) { this.technicianEmail = technicianEmail; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPreferredContact() { return preferredContact; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }
    public java.util.List<String> getAttachments() { return attachments; }
    public void setAttachments(java.util.List<String> attachments) { this.attachments = attachments; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }
    public MaintenancePriority getPriority() { return priority; }
    public void setPriority(MaintenancePriority priority) { this.priority = priority; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
