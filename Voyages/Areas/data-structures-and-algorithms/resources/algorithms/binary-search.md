# Binary Search

## When to Use This Pattern

**Signals:**
- Array is sorted (or can be sorted)
- "Search in sorted array"
- Need O(log n) time complexity
- Can eliminate half of search space each step
- "Find target", "Find first/last occurrence"

**Counter-signals:**
- Array is not sorted and can't be sorted
- Need to examine every element
- Search space can't be divided logically

---

## Core Mechanism

Repeatedly halve the search space by comparing with middle element:
1. Find middle element
2. Compare with target
3. Eliminate half of remaining elements
4. Repeat until found or space exhausted

---

## Template Code

```java
int left = 0;
int right = array.length - 1;

while (left <= right) {
    int mid = left + (right - left) / 2; // Avoid overflow

    if (array[mid] == target) {
        return mid; // Found
    } else if (array[mid] < target) {
        left = mid + 1; // Search right half
    } else {
        right = mid - 1; // Search left half
    }
}

return -1; // Not found
```

---

## Variations

| Variation | When to Use | Key Difference |
|-----------|-------------|----------------|
| Standard search | Find exact target | Return when found |
| Find first occurrence | Multiple targets | Continue left even after finding |
| Find last occurrence | Multiple targets | Continue right even after finding |
| Search insert position | Target may not exist | Return `left` at end |

---

## Problems Using This Pattern

| Problem | Data Structure | Technique | Difficulty |
|---------|---------------|-----------|------------|
| [Binary Search](../data-structures/array/binary-search/binary-search.md) | Array (Sorted) | Standard search | Easy |

---

## Common Mistakes

- Using `(left + right) / 2` instead of `left + (right - left) / 2` (overflow)
- Wrong loop condition: `left < right` vs `left <= right`
- Off-by-one errors when updating `left` or `right`
- Not considering empty array or single element
- Infinite loop when updating pointers incorrectly

---

## Related Patterns

- [Two Pointers](two-pointers.md) - Similar approach but different logic
- Modified binary search - Used in rotated arrays, search in 2D matrix
