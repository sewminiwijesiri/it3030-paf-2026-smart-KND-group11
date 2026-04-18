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
    private MaintenanceStatus status;
    private MaintenancePriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum MaintenanceStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
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
    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }
    public MaintenancePriority getPriority() { return priority; }
    public void setPriority(MaintenancePriority priority) { this.priority = priority; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
