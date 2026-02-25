# Two Pointers

## When to Use This Pattern

**Signals:**
- Array or LinkedList traversal
- Need to compare/process elements from both ends
- Need to detect cycles or find middle
- "Reverse", "Palindrome", "Cycle detection"

**Counter-signals:**
- Need to maintain order of elements
- Random access not available
- Problem requires maintaining state across all elements

---

## Core Mechanism

Two pointers move through the data structure with different speeds or directions:
1. **Both ends → center**: Start at beginning and end, move toward each other
2. **Fast/Slow (Floyd's)**: Two pointers at different speeds to detect cycles or find middle

---

## Template Code

### Variation 1: Both Ends → Center

```java
int left = 0;
int right = array.length - 1;

while (left < right) {
    // Process elements at both pointers
    // Move pointers based on condition
    if (condition) {
        left++;
    } else {
        right--;
    }
}
```

### Variation 2: Fast/Slow Pointers

```java
ListNode slow = head;
ListNode fast = head;

while (fast != null && fast.next != null) {
    slow = slow.next;      // Move 1 step
    fast = fast.next.next; // Move 2 steps

    if (slow == fast) {
        // Cycle detected
    }
}
```

---

## Variations

| Variation | When to Use | Key Difference |
|-----------|-------------|----------------|
| Both ends → center | Array problems, palindromes, reversals | Pointers move from opposite ends |
| Fast/Slow (Floyd's) | Cycle detection, find middle | Pointers move at different speeds |
| Same direction | Sliding window, subarray problems | Both move forward, different speeds |

---

## Problems Using This Pattern

| Problem | Data Structure | Technique | Difficulty |
|---------|---------------|-----------|------------|
| [Reverse String](../data-structures/array/two-pointers/reverse-string.md) | Array | Both ends → center | Easy |
| [Linked List Cycle](../data-structures/linked-list/two-pointers/linked-list-cycle.md) | LinkedList | Fast/Slow | Easy |

---

## Common Mistakes

- Off-by-one errors with `left < right` vs `left <= right`
- Forgetting to check `fast.next != null` in fast/slow pattern
- Moving both pointers when only one should move

---

## Related Patterns

- [Sliding Window](sliding-window.md) - Both pointers move in same direction
- [Binary Search](binary-search.md) - Similar halving approach but different logic
