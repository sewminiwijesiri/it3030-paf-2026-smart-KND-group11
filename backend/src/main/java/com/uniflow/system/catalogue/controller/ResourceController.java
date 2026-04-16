package com.uniflow.system.catalogue.controller;

import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.model.ResourceStatus;
import com.uniflow.system.catalogue.model.ResourceType;
import com.uniflow.system.catalogue.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ResourceController {

    private final ResourceService resourceService;

    // Constructor Injection
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // CREATE a new resource
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        Resource savedResource = resourceService.createResource(resource);
        return new ResponseEntity<>(savedResource, HttpStatus.CREATED);
    }

    // GET all resources OR Filtered resources
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'USER')")
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status) {
        
        List<Resource> resources;
        
        // If any filter is provided, use the filtering service
        if (type != null || minCapacity != null || (location != null && !location.isBlank()) || status != null) {
            resources = resourceService.filterResources(type, minCapacity, location, status);
        } else {
            resources = resourceService.getAllResources();
        }
        
        return ResponseEntity.ok(resources);
    }

    // GET resource by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'USER')")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    // UPDATE a resource
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(
            @PathVariable String id,
            @Valid @RequestBody Resource resourceDetails) {
        Resource updatedResource = resourceService.updateResource(id, resourceDetails);
        return ResponseEntity.ok(updatedResource);
    }

    // DELETE a resource
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
