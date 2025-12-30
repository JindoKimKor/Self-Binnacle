# Binary Search (LC 704)

## When to Use?

**Signals:**
- ✓ "sorted array" (정렬된 배열)
- ✓ "find target" (값 찾기)
- ✓ "O(log n)" requirement

**Counter-signals:**
- ✗ Unsorted array
- ✗ Need to find all occurrences
- ✗ Linked List (no random access)

---

## Core Idea

```
[1, 3, 5, 7, 9, 11, 13]
        ↑
       mid

target = 9
9 > 7 → search right half
```

**Each step:** Eliminate half the search space

---

## Template

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1;
    }
}
```

---

## Key Points

### 1. Mid Calculation
```java
// ✓ Overflow safe
int mid = left + (right - left) / 2;

// ✗ Can overflow
int mid = (left + right) / 2;
```

### 2. While Condition
```java
while (left <= right)  // ✓ Include equality
while (left < right)   // Different use case
```

### 3. Boundary Updates
```java
left = mid + 1;   // Exclude mid (already checked)
right = mid - 1;  // Exclude mid (already checked)
```

---

## Complexity

**Time: O(log n)**
- Half eliminated each iteration
- n → n/2 → n/4 → ... → 1
- log₂(n) iterations

**Space: O(1)**
- Only 3 variables (left, right, mid)

---

## Common Variations

| Problem | Modification |
|---------|--------------|
| First occurrence | Continue left after finding |
| Last occurrence | Continue right after finding |
| Insert position | Return left when not found |
| Rotated array | Compare with endpoints |

---

## Common Mistakes

### Off-by-one errors
```java
// Wrong: infinite loop possible
right = mid;
left = mid;

// Correct: always progress
right = mid - 1;
left = mid + 1;
```

### Wrong comparison
```java
// Be careful with direction
if (nums[mid] < target)  // target is bigger → go right
    left = mid + 1;
```

---

## One Sentence Summary

> "Binary Search: Repeatedly halve the search space by comparing middle element with target"
