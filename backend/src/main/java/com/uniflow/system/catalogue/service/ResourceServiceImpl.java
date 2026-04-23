package com.uniflow.system.catalogue.service;

import com.uniflow.system.catalogue.exception.ResourceNotFoundException;
import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.model.ResourceStatus;
import com.uniflow.system.catalogue.model.ResourceType;
import com.uniflow.system.catalogue.repository.ResourceRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final MongoTemplate mongoTemplate;

    // Constructor Injection
    public ResourceServiceImpl(ResourceRepository resourceRepository, MongoTemplate mongoTemplate) {
        this.resourceRepository = resourceRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(String id, Resource resourceDetails) {
        Resource existingResource = getResourceById(id);
        
        existingResource.setName(resourceDetails.getName());
        existingResource.setType(resourceDetails.getType());
        existingResource.setCapacity(resourceDetails.getCapacity());
        existingResource.setLocation(resourceDetails.getLocation());
        existingResource.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
        existingResource.setStatus(resourceDetails.getStatus());
        
        if (resourceDetails.getImageUrl() != null && !resourceDetails.getImageUrl().isEmpty()) {
            existingResource.setImageUrl(resourceDetails.getImageUrl());
        }
        
        return resourceRepository.save(existingResource);
    }

    @Override
    public void deleteResource(String id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }

    @Override
    public List<Resource> filterResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (type != null) {
            criteriaList.add(Criteria.where("type").is(type));
        }
        
        if (minCapacity != null) {
            criteriaList.add(Criteria.where("capacity").gte(minCapacity));
        }
        
        if (location != null && !location.isBlank()) {
            criteriaList.add(Criteria.where("location").regex(location, "i")); // "i" for case-insensitive
        }
        
        if (status != null) {
            criteriaList.add(Criteria.where("status").is(status));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Resource.class);
    }
}
