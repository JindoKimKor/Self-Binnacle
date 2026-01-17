[← Overview](README.md)

# Test Smells

* **Source:** Meszaros (xUnit Patterns) & Others

**Context:** Issues reducing test maintainability, reliability (flakiness), and speed.

**References:**
* [xUnit Patterns (Meszaros)](http://xunitpatterns.com/)
* [Survey on Test Smells (T. Sharma)](https://www.tusharma.in/preprints/saner2022.pdf)

| Sub-Category | Types |
| :--- | :--- |
| **Code/Behavior** | Assertion Roulette, Eager Test, Lazy Test, Mystery Guest, General Fixture, Test Maverick, Obscure Test, Conditional Test Logic, Test Logic in Production, Hard-coded Test Data. |
| **Project/Process** | Fragile Test, Flaky Test, Slow Tests, Erratic Test. |

---

## Code/Behavior Smells

* **Assertion Roulette:** Multiple assertions in a test without messages; hard to tell which failed.
* **Eager Test:** A test verifying too much functionality (multiple scenarios).
* **Lazy Test:** Multiple tests checking the same method using the same fixture (could be consolidated).
* **Mystery Guest:** The test relies on external resources (files, DB) not visible within the test code.
* **General Fixture:** The test setup creates a fixture much larger than what the test actually needs.
* **Test Maverick:** A test that sets up its own environment differently from the standard suite.
* **Obscure Test:** The test is hard to understand (documentation smell).
* **Conditional Test Logic:** Tests containing `if` or loops (tests should be linear).
* **Test Logic in Production:** Production code contains logic specifically for tests (e.g., `if (TEST_MODE)...`).
* **Hard-coded Test Data:** Data embedded in tests making them brittle to change.

---

## Project/Process Smells

* **Fragile Test:** Tests that break easily when the SUT (System Under Test) changes slightly.
* **Flaky Test:** Tests that pass or fail intermittently without code changes.
* **Slow Tests:** Tests that take too long, discouraging frequent execution.
* **Erratic Test:** Tests that behave inconsistently due to concurrency or shared state.

---
[← Overview](README.md)
