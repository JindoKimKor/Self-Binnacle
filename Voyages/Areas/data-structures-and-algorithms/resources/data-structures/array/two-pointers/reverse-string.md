# Reverse String (LC 344)

## Interview Approach

### 1. Input/Output

```
Input: s = ['h', 'e', 'l', 'l', 'o']
Output: ['o', 'l', 'l', 'e', 'h']

Input: s = ['H', 'a', 'n', 'n', 'a', 'h']
Output: ['h', 'a', 'n', 'n', 'a', 'H']
```

### 2. Keywords & Constraints

**Keywords:**
- "reverse"
- "in-place"
- "O(1) extra memory"

**Constraints:**
- Must modify the input array directly
- Cannot allocate extra array
- Must use O(1) space

### 3. Pattern + Why

**Pattern:** Two Pointers

**Why this pattern:**
Need to reverse array in-place means swapping elements from both ends. Two pointers starting from opposite ends can meet in the middle, swapping as they go. This achieves reversal in a single pass without extra space.

**Data Structure:** Array (char[])

### 4. Approach

**Core Idea:**
Start with pointers at both ends, swap elements, move pointers toward center until they meet.

**How it works:**
1. Initialize `left = 0`, `right = length - 1`
2. While `left < right`:
   - Swap elements at `left` and `right` using temp variable
   - Move `left` forward (`left++`)
   - Move `right` backward (`right--`)
3. Stop when pointers meet or cross

**Example Walkthrough:**

```
Input: ['h', 'e', 'l', 'l', 'o']

Step 1: left=0, right=4
['h', 'e', 'l', 'l', 'o']
  ↑                   ↑
Swap h ↔ o

Step 2: left=1, right=3
['o', 'e', 'l', 'l', 'h']
       ↑         ↑
Swap e ↔ l

Step 3: left=2, right=2 (left >= right, stop)
['o', 'l', 'l', 'e', 'h']
            ↑

Result: ['o', 'l', 'l', 'e', 'h']
```

### 5. Code

```java
// "I'll go ahead and write the code."
class Solution {
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;

        while (left < right) {
            // Swap using temp variable
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;

            // Move pointers
            left++;
            right--;
        }
    }
}
```

---

## Deep Dive

### Complexity Analysis

**Time:** O(n)
- Single pass through half the array
- Each element swapped once
- More precisely O(n/2), but simplifies to O(n)

**Space:** O(1)
- Only uses one temp variable
- No additional data structures
- True in-place algorithm

### Common Mistakes

1. **Wrong termination condition**
   ```java
   while (left <= right)  // ✗ Unnecessary swap when left == right
   while (left < right)   // ✓ Stop when they meet
   ```

2. **Index out of bounds**
   ```java
   int right = s.length;      // ✗ Index 5 for length 5 (out of bounds)
   int right = s.length - 1;  // ✓ Index 4 (last element)
   ```

3. **Forgetting temp variable**
   ```java
   s[left] = s[right];   // ✗ Lost original s[left] value
   s[right] = s[left];   // ✗ Both become s[right]
   ```

4. **Wrong pointer direction**
   ```java
   right++;  // ✗ Moves away from left
   right--;  // ✓ Moves toward left
   ```

### Key Insights

- **In-place modification**: Void return type signals modification of input, not creating new array
- **Temp variable necessity**: Swapping requires temporary storage to avoid losing values
- **Two pointers both ends**: Different from fast/slow variant, both move toward center
- **Single pass efficiency**: Only need to traverse half the array

### Alternative Approaches

**Approach 1: Two Pointers (Current)**
- Time: O(n), Space: O(1)
- ✓ Optimal space
- ✓ Simple logic

**Approach 2: Recursion**
```java
void reverseHelper(char[] s, int left, int right) {
    if (left >= right) return;
    // Swap
    char temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    // Recursive call
    reverseHelper(s, left + 1, right - 1);
}
```
- Time: O(n), Space: O(n) due to call stack
- ✗ Worse space complexity
- Less practical for this problem

---

## Extended Learning

### Visualization

```
Initial state:
Index: 0   1   2   3   4
Value: [h] [e] [l] [l] [o]
        ↑               ↑
      left           right

After swap 1:
Index: 0   1   2   3   4
Value: [o] [e] [l] [l] [h]
            ↑       ↑
          left   right

After swap 2:
Index: 0   1   2   3   4
Value: [o] [l] [l] [e] [h]
                ↑
           left=right (stop)

Final: [o] [l] [l] [e] [h]
```

### Real-World Applications

| Use Case | Description |
|----------|-------------|
| String reversal | Text processing, display formatting |
| Palindrome check | Compare both ends moving inward |
| Array rotation | Combined with reversal technique |
| Data structure reversal | Lists, stacks, queues |

### Related Problems

- Valid Palindrome - Two pointers from both ends
- [Linked List Cycle](../../linked-list/two-pointers/linked-list-cycle.md) - Two pointers (fast/slow variant)

- Reverse Words in String - Apply same technique per word

### Pattern Generalization

**When to recognize Two Pointers (Both Ends):**
- Need to work from both sides toward center
- In-place modification required
- Comparing/swapping elements from opposite ends
- Keywords: "reverse", "palindrome", "two sum in sorted array"

**Signals this pattern fits:**
- Array or string input
- O(1) space requirement
- Need to process pairs of elements
- Can reduce problem by processing from edges

---

## References

- Strategy: [Two Pointers](../../../strategies/two-pointers.md)
- Concept: [Array](../overview.md)
- Technique: [Swap Pattern](../../../strategies/swap-pattern.md)
