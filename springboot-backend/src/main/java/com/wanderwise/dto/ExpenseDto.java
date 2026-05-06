package com.wanderwise.dto;

import com.wanderwise.model.Expense;
import java.util.List;
import java.util.Map;

public class ExpenseDto {

    public static class CreateExpenseRequest {
        private Long tripId;
        private Expense.Category category;
        private Double amount;
        private String note;

        public Long getTripId() { return tripId; }
        public void setTripId(Long tripId) { this.tripId = tripId; }
        public Expense.Category getCategory() { return category; }
        public void setCategory(Expense.Category category) { this.category = category; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }

    public static class ExpenseResponse {
        private List<Expense> expenses;
        private Map<String, Double> categoryTotals;
        private Double totalExpense;
        private Double remainingBudget;

        public ExpenseResponse() {}
        public ExpenseResponse(List<Expense> expenses, Map<String, Double> categoryTotals,
                               Double totalExpense, Double remainingBudget) {
            this.expenses = expenses;
            this.categoryTotals = categoryTotals;
            this.totalExpense = totalExpense;
            this.remainingBudget = remainingBudget;
        }

        public List<Expense> getExpenses() { return expenses; }
        public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }
        public Map<String, Double> getCategoryTotals() { return categoryTotals; }
        public void setCategoryTotals(Map<String, Double> categoryTotals) { this.categoryTotals = categoryTotals; }
        public Double getTotalExpense() { return totalExpense; }
        public void setTotalExpense(Double totalExpense) { this.totalExpense = totalExpense; }
        public Double getRemainingBudget() { return remainingBudget; }
        public void setRemainingBudget(Double remainingBudget) { this.remainingBudget = remainingBudget; }
    }
}
