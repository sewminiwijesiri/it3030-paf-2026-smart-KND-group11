package com.uniflow.system.catalogue.repository;

import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.model.ResourceStatus;
import com.uniflow.system.catalogue.model.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    List<Resource> findByType(ResourceType type);
    
    List<Resource> findByStatus(ResourceStatus status);
    
    List<Resource> findByCapacityGreaterThanEqual(Integer minCapacity);
    
    List<Resource> findByLocationContainingIgnoreCase(String location);
}
