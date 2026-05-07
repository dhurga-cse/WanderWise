package com.wanderwise.database;

import com.wanderwise.models.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseTable extends JpaRepository<Expense, Long> {
    List<Expense> findByTripIdOrderByCreatedAtDesc(Long tripId);
}
