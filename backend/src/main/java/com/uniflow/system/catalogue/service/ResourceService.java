package com.uniflow.system.catalogue.service;

import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.model.ResourceStatus;
import com.uniflow.system.catalogue.model.ResourceType;

import java.util.List;

public interface ResourceService {
    Resource createResource(Resource resource);
    
    List<Resource> getAllResources();
    
    Resource getResourceById(String id);
    
    Resource updateResource(String id, Resource resource);
    
    void deleteResource(String id);
    
    List<Resource> filterResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status);
}
