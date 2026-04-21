package com.uniflow.system.controller;

import com.uniflow.system.model.Comment;
import com.uniflow.system.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance/{ticketId}/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable String ticketId,
            @RequestBody Comment comment,
            Authentication authentication) {
        comment.setTicketId(ticketId);
        comment.setAuthorEmail(authentication.getName());
        // In a real app, authorName would be fetched from user service
        return ResponseEntity.ok(commentService.addComment(comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id, Authentication authentication) {
        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
