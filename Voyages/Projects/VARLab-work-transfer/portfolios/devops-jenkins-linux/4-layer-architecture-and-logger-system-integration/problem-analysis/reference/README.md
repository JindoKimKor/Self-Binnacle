# Software Smells & Anti-Patterns Taxonomy

This document provides a comprehensive classification of software smells and anti-patterns, organized by category, source/perspective, and specific types. It integrates classic definitions with modern research taxonomies (e.g., Sharma et al., Suryanarayana et al.).

## Summary Table

| Category | Primary Source / Perspective | Scope & Description |
| :--- | :--- | :--- |
| **[Code Smell](01-code-smells.md)** | Fowler/Beck (1999) | **Scope:** Intra-class or method level.<br>**Focus:** Refactoring targets to improve maintainability and readability. |
| **[Design Smell - Symptoms](02a-design-smells-symptoms.md)** | Robert C. Martin (2000) | **Scope:** Inter-class or component relationships.<br>**Focus:** Symptom-based: Observable signs of rotting design (Rigidity, Fragility, etc.). |
| **[Design Smell - Principles](02b-design-smells-principles.md)** | Suryanarayana et al. (2014) | **Scope:** Inter-class or component relationships.<br>**Focus:** Principle-based: Violations of OO principles (Abstraction, Encapsulation, Modularization, Hierarchy). |
| **[Architecture Smell](03-architecture-smells.md)** | Garcia et al. (2009), Lippert & Roock, Sharma | **Scope:** System-level structure.<br>**Focus:** High-level structural issues affecting system evolution, deployment, and scalability. |
| **[Anti-pattern](04-anti-patterns.md)** | Brown et al. (1998) | **Scope:** Development, Architecture, and Project Management.<br>**Focus:** Common solutions to recurring problems that generate negative consequences. |
| **[Implementation Smell](05-implementation-smells.md)** | Sharma's Taxonomy | **Scope:** Statement/Method level.<br>**Focus:** Specific coding constructs that indicate poor implementation choices (subset of code smells). |
| **[Test Smell](06-test-smells.md)** | Meszaros (xUnit Patterns) & Others | **Scope:** Test Code.<br>**Focus:** Issues reducing test maintainability, reliability (flakiness), and execution speed. |
| **[Configuration Smell](07-configuration-smells.md)** | Sharma's Taxonomy | **Scope:** Configuration Files (IaC, XML, JSON, YAML).<br>**Focus:** Security risks, deployment fragility, and environmental inconsistencies. |
| **[Database Smell](08-database-smells.md)** | Sharma's Taxonomy, Arulraj et al. | **Scope:** Database Schema & Queries.<br>**Focus:** Poor schema design, inefficient queries, and misuse of database features. |
| **[Performance Smell](09-performance-smells.md)** | Various Sources | **Scope:** Runtime Behavior.<br>**Focus:** Patterns known to degrade system latency, throughput, or resource efficiency. |
| **[Grammar Smell](10-grammar-smells.md)** | Sharma's Taxonomy | **Scope:** DSLs & Parsers.<br>**Focus:** Issues in language grammar definitions affecting parsing efficiency and ambiguity. |

## Quick Navigation

| # | Category | Types Count |
|---|----------|-------------|
| 1 | [Code Smells](01-code-smells.md) | 22 |
| 2a | [Design Smells - Symptoms](02a-design-smells-symptoms.md) | 7 |
| 2b | [Design Smells - Principles](02b-design-smells-principles.md) | 27 |
| 3 | [Architecture Smells](03-architecture-smells.md) | 9 |
| 4 | [Anti-patterns](04-anti-patterns.md) | 27 (Dev: 11, Arch: 7, Mgmt: 9) |
| 5 | [Implementation Smells](05-implementation-smells.md) | 10 |
| 6 | [Test Smells](06-test-smells.md) | 14 |
| 7 | [Configuration Smells](07-configuration-smells.md) | 7 |
| 8 | [Database Smells](08-database-smells.md) | 10 (Schema: 6, Query: 4) |
| 9 | [Performance Smells](09-performance-smells.md) | 9 |
| 10 | [Grammar Smells](10-grammar-smells.md) | 7 |
