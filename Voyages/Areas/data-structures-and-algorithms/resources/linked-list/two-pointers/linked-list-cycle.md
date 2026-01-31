# Linked List Cycle (LC 141)

## Problem

Check if LinkedList has a cycle (if any node's next points to a previous node)

**Input/Output:**
```
Input:
3 → 2 → 0 → -4
    ↑________|
Output: true

Input:
1 → 2 → null
Output: false
```

---

## Pattern Recognition

- "Cycle detection"
- "Infinite loop check"
- "Visit same node again"
- → Two Pointers (Fast/Slow) or HashSet

**Data Structure:** None (just 2 pointers)
**Algorithm:** Floyd's Cycle Detection (Fast/Slow Pointers)

---

## Core Idea

**Running Track Analogy:**
- Slow runner (slow): 1 step at a time
- Fast runner (fast): 2 steps at a time

**If cycle exists:**
→ Fast runner catches up to slow runner (meet on track)

**If no cycle:**
→ Fast runner reaches end (null)

**Mathematical Principle:**
```
Inside cycle:
- Relative distance closes by 1 each step
- Cycle size = C
- Meet after at most C steps
→ O(n) time
```

---

## Solution (Two Pointers - Optimal)

```java
class Solution {
    public boolean hasCycle(ListNode head) {
        // Edge case
        if (head == null) return false;

        ListNode slow = head;
        ListNode fast = head;

        // Until fast reaches end
        while (fast != null && fast.next != null) {
            slow = slow.next;       // 1 step
            fast = fast.next.next;  // 2 steps

            // If they meet = cycle
            if (slow == fast) {
                return true;
            }
        }

        // fast reached end = no cycle
        return false;
    }
}
```

---

## Alternative Solution (HashSet)

```java
class Solution {
    public boolean hasCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<>();

        ListNode curr = head;
        while (curr != null) {
            // Already seen = cycle
            if (seen.contains(curr)) {
                return true;
            }
            seen.add(curr);
            curr = curr.next;
        }

        return false;
    }
}
```

---

## Comparison

| Method | Time | Space | Implementation | Interview |
|--------|------|-------|----------------|-----------|
| HashSet | O(n) | O(n) | Easy | Pass |
| Two Pointers | O(n) | O(1) | Medium | Impressive |

---

## Complexity (Two Pointers)

**Time: O(n)**
- No cycle: fast reaches end → n/2 steps
- Cycle exists: slow enters cycle, fast catches up → max cycle size → O(n)

**Space: O(1)**
- Only 2 variables (slow, fast)
- Independent of input size
- n = 10 → 2 variables
- n = 1,000,000 → 2 variables

---

## Key Learnings

### 1. Two Pointers - Fast/Slow Pattern
```java
slow = slow.next;       // 1 step
fast = fast.next.next;  // 2 steps
```

### 2. Short-circuit Evaluation
```java
// ❌ Wrong
while (fast.next != null && fast != null)

// ✓ Correct
while (fast != null && fast.next != null)
```
- Evaluates left to right
- Safe condition first (null check → field access)

### 3. Null Check Order
More basic check first:
```
node → node.next → node.next.next
```

### 4. Memory vs Complexity Trade-off
| Approach | Memory | Implementation |
|----------|--------|----------------|
| HashSet | Uses memory | Easy |
| Two Pointers | No extra memory | Mathematical |

### 5. Space Complexity Understanding
- HashSet: Store all nodes → O(n)
- Two Pointers: Just 2 variables → O(1)
- O(1) = Constant regardless of input size

### 6. Mathematical Thinking
Solve with logic, not memory:
- Speed difference → Inevitable meeting
- Cycle = Circular track

---

## Common Mistakes

### While condition order
```java
fast != null && fast.next != null
// Wrong order = NullPointerException
```

### Edge case
```java
if (head == null) return false;
```

### fast.next.next access
```java
// Need fast.next null check too
// Otherwise error
```

---

## Real-world Applications

| Use Case | Description |
|----------|-------------|
| Infinite loop detection | Runtime monitoring |
| Circular data validation | Data structure verification |
| Memory leak detection | Reference cycle finding |
| Recursive call cycle | Circular reference detection |

---

## Interview Strategy

### Phase 1: Solve First (HashSet)
```java
// Quick implementation
Set<ListNode> seen = new HashSet<>();
```

### Phase 2: Suggest Optimization
```
Interviewer: "Can you reduce space?"
You: "Two Pointers can do O(1)."
```

### Phase 3: Explain Trade-off
- HashSet: Easy to implement, intuitive
- Two Pointers: Memory efficient, mathematical
