package com.uniflow.system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/technician")
public class TechnicianController {

    @GetMapping("/test")
    public String technicianTest() {
        return "Welcome TECHNICIAN!";
    }
}
