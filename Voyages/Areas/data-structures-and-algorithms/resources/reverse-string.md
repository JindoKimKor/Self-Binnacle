# Reverse String

## 1. Pattern Recognition

**Keywords:** "reverse", "in-place", "O(1) extra memory"

**Constraint:** Modify original, don't create new array

**Key Insight:**
- Modify array itself, not output
- Swap values from both ends moving toward center
- Two Pointers pattern

---

## 2. Two Pointers Pattern

**Concept:** Start from both ends, narrow toward center

**When to use:**
- Working from both ends of array/string
- Finding pairs in sorted array
- Palindrome check
- In-place modification

**Advantages:**
- No extra space: O(1)
- Single traversal: O(n)

---

## 3. Swap Concept (Important!)

**Problem:** One value disappears when exchanging

```java
s[left] = s[right];   // left value gone
s[right] = s[left];   // can't recover
```

**Solution:** Use temporary storage

```java
char temp = s[left];     // 1. Save temporarily
s[left] = s[right];      // 2. Copy value
s[right] = temp;         // 3. Copy temp value
```

**Space complexity:** 1 temp variable = O(1)

---

## 4. Two Pointers Operation

### Initial setup
```java
int left = 0;              // start
int right = s.length - 1;  // end (note: not length!)
```

### Movement direction
```java
left++;   // front to back →
right--;  // back to front ←
```

### Termination condition
```java
while (left < right)  // stop when they meet
```

---

## 5. Common Mistakes

### Mistake 1: Incrementing right
```java
right++;  // ✗ Goes further out (out of bounds)
right--;  // ✓ Should come forward
```

### Mistake 2: Concept confusion
- "Output" vs "Modify array"
- void return = modify original
- Creating new array = O(n) space

### Mistake 3: Index range
```java
int right = s.length;      // ✗ 5 (out of bounds)
int right = s.length - 1;  // ✓ 4 (last index)
```

---

## 6. Complete Code

```java
class Solution {
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;

        while (left < right) {
            // Swap
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;

            // Move
            left++;   // →
            right--;  // ←
        }
    }
}
```

---

## 7. Visualization

```
Step 0:
['h', 'e', 'l', 'l', 'o']
  ↑                   ↑
 L=0               R=4

Swap h ↔ o

Step 1:
['o', 'e', 'l', 'l', 'h']
       ↑         ↑
      L=1      R=3

Swap e ↔ l

Step 2:
['o', 'l', 'l', 'e', 'h']
            ↑
          L=2=R

Done (left >= right)
```

---

## 8. Complexity

- **Time:** O(n/2) = O(n) - traverse half
- **Space:** O(1) - only 1 temp variable
- **In-place:** Directly modify original array

---

## 9. Edge Cases

| Case | Input | Note |
|------|-------|------|
| Size 1 | `['a']` | No swap |
| Size 2 | `['a','b']` | 1 swap → `['b','a']` |
| Odd length | `['a','b','c']` | Middle stays |
| Even length | `['a','b','c','d']` | All values swap |

---

## 10. Java Basics

### Array length
```java
s.length     // length (5)
s.length - 1 // last index (4)
```

### Variable increment/decrement
```java
left++   // left = left + 1
right--  // right = right - 1
```

### while vs for
```java
// Two Pointers is more natural with while
while (left < right) {
    // move both sides
}
```

---

## 11. In-place Concept

- **Definition:** Work on original without extra array/collection
- **Advantage:** Memory efficient
- **Disadvantage:** Original lost (copy first if needed)
- **Space:** O(1) - just a few variables

---

## 12. Real-world Applications

| Use Case | Description |
|----------|-------------|
| String reversal | Actually used often |
| Palindrome check | Compare both ends |
| Array sort verification | Check with two pointers |
| Duplicate removal | Two pointers after sorting |

---

## 13. Coding Test Perspective

- **New pattern:** Two Pointers
- **Basics test:** Swap, index management
- **Constraint understanding:** O(1) space = in-place
- **Easy to mistake:** Direction, termination condition

---

## 14. Two Pointers General Patterns

### Pattern 1: Both ends toward center
```java
int left = 0, right = arr.length - 1;
while (left < right) {
    // work
    left++;
    right--;
}
```

### Pattern 2: Same direction (fast/slow)
```java
int slow = 0, fast = 0;
while (fast < arr.length) {
    // work
    slow++;
    fast++;
}
```
