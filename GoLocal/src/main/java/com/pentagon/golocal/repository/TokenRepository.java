package com.pentagon.golocal.repository;

import com.pentagon.golocal.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    @Query("""
            select t from Token t inner join User u 
            on t.user.username = u.username 
            where t.user.username = :userId and t.isLoggedOut = false
            """)
    List<Token> findAllTokenByUser(String userId);

    Optional<Token> findByToken(String token);
}
