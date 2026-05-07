package com.wanderwise.routes;

import com.wanderwise.database.ExpenseTable;
import com.wanderwise.database.TripTable;
import com.wanderwise.models.Expense;
import com.wanderwise.models.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseRoutes {

    @Autowired
    private ExpenseTable expenseTable;

    @Autowired
    private TripTable tripTable;

    // Get all expenses for a trip
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getExpenses(@PathVariable Long tripId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        Trip trip = tripTable.findByIdAndUserId(tripId, userId).orElse(null);
        if (trip == null) return ResponseEntity.status(404).body(Map.of("message", "Trip not found"));

        List<Expense> expenses = expenseTable.findByTripIdOrderByCreatedAtDesc(tripId);

        // Calculate totals per category
        Map<String, Double> categoryTotals = new HashMap<>();
        double totalExpense = 0;
        for (Expense expense : expenses) {
            String cat = expense.getCategory().name();
            categoryTotals.merge(cat, expense.getAmount(), Double::sum);
            totalExpense += expense.getAmount();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("expenses", expenses);
        result.put("categoryTotals", categoryTotals);
        result.put("totalExpense", totalExpense);
        result.put("remainingBudget", trip.getBudget() - totalExpense);

        return ResponseEntity.ok(result);
    }

    // Add new expense
    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody Map<String, Object> body, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Long tripId = Long.valueOf(body.get("tripId").toString());

        Trip trip = tripTable.findByIdAndUserId(tripId, userId).orElse(null);
        if (trip == null) return ResponseEntity.status(404).body(Map.of("message", "Trip not found"));

        Expense expense = new Expense();
        expense.setTripId(tripId);
        expense.setCategory(Expense.Category.valueOf((String) body.get("category")));
        expense.setAmount(((Number) body.get("amount")).doubleValue());
        expense.setNote((String) body.getOrDefault("note", ""));

        return ResponseEntity.status(201).body(expenseTable.save(expense));
    }

    // Delete expense
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        Expense expense = expenseTable.findById(id).orElse(null);
        if (expense == null) return ResponseEntity.status(404).body(Map.of("message", "Expense not found"));

        Trip trip = tripTable.findByIdAndUserId(expense.getTripId(), userId).orElse(null);
        if (trip == null) return ResponseEntity.status(403).body(Map.of("message", "Unauthorized"));

        expenseTable.delete(expense);
        return ResponseEntity.ok(Map.of("message", "Expense deleted successfully"));
    }
}
