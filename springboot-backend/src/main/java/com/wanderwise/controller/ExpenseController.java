package com.wanderwise.controller;

import com.wanderwise.dto.ExpenseDto;
import com.wanderwise.model.Expense;
import com.wanderwise.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<ExpenseDto.ExpenseResponse> getExpenses(@PathVariable Long tripId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(expenseService.getExpensesByTrip(tripId, userId));
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody ExpenseDto.CreateExpenseRequest request, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.status(201).body(expenseService.addExpense(request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteExpense(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        expenseService.deleteExpense(id, userId);
        return ResponseEntity.ok(Map.of("message", "Expense deleted successfully"));
    }
}
