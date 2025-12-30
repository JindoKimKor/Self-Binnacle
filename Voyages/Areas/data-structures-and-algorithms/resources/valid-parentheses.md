# Valid Parentheses

## 1. Pattern Recognition

**Keywords:** "order", "valid", "matching"

**Data Structure Selection:**
- Order related → Stack or Queue
- Process most recent first → LIFO → Stack

**Key Insight:**
- Closing bracket must match the most recent opening bracket
- Stack top is always the bracket that needs to be matched

---

## 2. Stack Data Structure

**Concept:** LIFO (Last In First Out)

**Visualization:** Stacking hamburgers - add and remove only from the top

**Time Complexity:**
| Operation | Complexity |
|-----------|------------|
| push | O(1) |
| pop | O(1) |
| peek | O(1) |

**Java Syntax:**
```java
// Create
Stack<Character> stack = new Stack<>();

// Add
stack.push(value);

// Remove and return
char c = stack.pop();  // removed

// View without removing
char c = stack.peek();  // not removed

// Check empty
stack.isEmpty();

// Size
stack.size();
```

---

## 3. Algorithm: Bracket Matching

**Pattern Name:** Bracket Matching / Parentheses Validation

**Core Idea:**
- Store opening brackets
- Compare closing brackets with most recent opening bracket

**How it works:**
1. Opening bracket `( [ {` → push to Stack
2. Closing bracket `) ] }` →
   - Stack empty? → false
   - Pop and check match → doesn't match? → false
3. After loop: Stack must be empty → true

---

## 4. Solution Strategy

- **Time Complexity:** O(n) - traverse string once
- **Space Complexity:** O(n) - worst case all pushed to Stack

**Approach:**
1. Create Stack
2. Convert string to char array
3. For each character:
   - Opening bracket → push
   - Closing bracket → check isEmpty, pop and match
4. Return `stack.isEmpty()`

---

## 5. Edge Cases

### Empty Stack pop
- Example: `"]"` - closing bracket without opening
- Solution: Check `isEmpty()` before pop

### Only opening brackets
- Example: `"((("` - never closed
- Solution: `return stack.isEmpty()` at end

### Wrong order
- Example: `"([)]"` - `[` opened but trying to close with `)`
- Solution: Match checking catches this automatically

---

## 6. Java Syntax Points

```java
// String to char array
s.toCharArray();

// Enhanced for loop
for (char c : chars)

// Condition check
if (c == '(' || c == '[' || c == '{')

// Early return (breaks loop)
return false;
```

---

## 7. Real-world Applications

| Use Case | Description |
|----------|-------------|
| Compiler | Bracket matching in code |
| HTML/XML Parser | Tag open/close validation |
| Calculator | Parentheses precedence |
| Function Call Stack | a→b→c call, c→b→a return |
| Undo/Redo | Cancel most recent action first |
| Browser Back Button | Page history management |

---

## 8. Stack vs Queue

| Stack (LIFO) | Queue (FIFO) |
|--------------|--------------|
| Last in, first out | First in, first out |
| Reverse order, most recent first | Sequential, waiting line |
| **This problem: Stack** | - |

---

## 9. Coding Test Perspective

**Essence:** "Can you recognize LIFO pattern?"

**Comparison with Two Sum:**
| Problem | Pattern | Data Structure |
|---------|---------|----------------|
| Two Sum | "Fast lookup" | HashMap |
| Valid Parentheses | "Reverse order" | Stack |

**Goal:** Ability to select appropriate data structure for each problem

---

## 10. Generalized Pattern

**Stack usage signals:**
- "most recent"
- "reverse order"
- "go back"
- "matching"
- "nested"

When you see these keywords → consider Stack
