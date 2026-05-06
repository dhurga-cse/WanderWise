package com.wanderwise.service;

import com.wanderwise.dto.ExpenseDto;
import com.wanderwise.model.Expense;
import com.wanderwise.model.Trip;
import com.wanderwise.repository.ExpenseRepository;
import com.wanderwise.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private TripRepository tripRepository;

    public ExpenseDto.ExpenseResponse getExpensesByTrip(Long tripId, Long userId) {
        // Verify trip belongs to user
        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        List<Expense> expenses = expenseRepository.findByTripIdOrderByCreatedAtDesc(tripId);

        // Calculate category totals
        Map<String, Double> categoryTotals = new HashMap<>();
        double totalExpense = 0;
        for (Expense expense : expenses) {
            String cat = expense.getCategory().name();
            categoryTotals.merge(cat, expense.getAmount(), Double::sum);
            totalExpense += expense.getAmount();
        }

        double remainingBudget = trip.getBudget() - totalExpense;
        return new ExpenseDto.ExpenseResponse(expenses, categoryTotals, totalExpense, remainingBudget);
    }

    public Expense addExpense(ExpenseDto.CreateExpenseRequest request, Long userId) {
        // Verify trip belongs to user
        tripRepository.findByIdAndUserId(request.getTripId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        Expense expense = new Expense();
        expense.setTripId(request.getTripId());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setNote(request.getNote());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long expenseId, Long userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));

        // Verify trip belongs to user
        tripRepository.findByIdAndUserId(expense.getTripId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized"));

        expenseRepository.delete(expense);
    }
}
