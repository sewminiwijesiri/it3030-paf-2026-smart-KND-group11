package com.uniflow.system.repository;

import com.uniflow.system.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);
}
