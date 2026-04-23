package com.uniflow.system.catalogue.controller;

import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.model.ResourceStatus;
import com.uniflow.system.catalogue.model.ResourceType;
import com.uniflow.system.catalogue.service.ResourceService;
import com.smartcampus.booking.repository.BookingRepository;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.enums.BookingStatus;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.uniflow.system.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ResourceController {

    private final ResourceService resourceService;
    private final CloudinaryService cloudinaryService;
    private final BookingRepository bookingRepository;

    // Constructor Injection
    public ResourceController(ResourceService resourceService, CloudinaryService cloudinaryService, BookingRepository bookingRepository) {
        this.resourceService = resourceService;
        this.cloudinaryService = cloudinaryService;
        this.bookingRepository = bookingRepository;
    }

    // CREATE a new resource
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(
            @Valid @RequestPart("resource") Resource resource,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        if (file != null && !file.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(file);
            resource.setImageUrl(imageUrl);
        }
        
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
    @PutMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(
            @PathVariable String id,
            @Valid @RequestPart("resource") Resource resourceDetails,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        if (file != null && !file.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(file);
            resourceDetails.setImageUrl(imageUrl);
        }
        
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

    // GET busy slots for a resource on a specific date
    @GetMapping("/{id}/busy-slots")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'USER')")
    public ResponseEntity<List<java.util.Map<String, String>>> getBusySlots(
            @PathVariable("id") String resourceId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        
        List<Booking> bookings = bookingRepository.findByResourceIdAndBookingDateAndStatusIn(
                resourceId, date, List.of(BookingStatus.APPROVED.name(), BookingStatus.PENDING.name()));
        
        List<java.util.Map<String, String>> busySlots = bookings.stream().map(b -> {
            java.util.Map<String, String> map = new java.util.HashMap<>();
            map.put("startTime", b.getStartTime().toString());
            map.put("endTime", b.getEndTime().toString());
            return map;
        }).toList();
        
        return ResponseEntity.ok(busySlots);
    }
}
