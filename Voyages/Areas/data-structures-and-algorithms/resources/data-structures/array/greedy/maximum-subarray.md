# Maximum Subarray (LC 53)

## Interview Approach

### 1. Input/Output

```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has sum = 6

Input: nums = [1]
Output: 1

Input: nums = [-1]
Output: -1
```

### 2. Keywords & Constraints

**Keywords:**
- "Maximum sum"
- "Contiguous subarray"
- "At each position: continue vs start fresh"

**Constraints:**
- Array contains at least one element
- Can contain negative numbers
- Need to find the maximum sum, not the subarray itself

### 3. Pattern + Why

**Pattern:** Greedy (Kadane's Algorithm)

**Why this pattern:**
At each position, we face a greedy choice: continue the current subarray or start fresh. If the current sum becomes negative, adding it to any future number makes it worse, so starting fresh is optimal. This local greedy choice leads to the global optimal solution.

**Data Structure:** None (just 2 variables)

### 4. Approach

**Core Idea:**
Maintain two values: current subarray sum ending at this position, and the maximum sum seen so far. At each element, greedily choose the better option.

**How it works:**
1. Initialize `currentSum = nums[0]` and `maxSum = nums[0]`
2. For each element from index 1:
   - Update `currentSum`: choose max of (current element alone, or currentSum + current element)
   - Update `maxSum`: choose max of (maxSum, currentSum)
3. Return `maxSum`

**Example Walkthrough:**

```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: currentSum = -2, maxSum = -2

i=1: currentSum = max(1, -2+1) = 1, maxSum = max(-2, 1) = 1

i=2: currentSum = max(-3, 1-3) = -2, maxSum = 1

i=3: currentSum = max(4, -2+4) = 4, maxSum = 4

i=4: currentSum = max(-1, 4-1) = 3, maxSum = 4

i=5: currentSum = max(2, 3+2) = 5, maxSum = 5

i=6: currentSum = max(1, 5+1) = 6, maxSum = 6

i=7: currentSum = max(-5, 6-5) = 1, maxSum = 6

i=8: currentSum = max(4, 1+4) = 5, maxSum = 6

Result: 6 (subarray [4,-1,2,1])
```

### 5. Code

```java
// "I'll go ahead and write the code."
class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // Greedy choice: continue or start fresh?
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }
}
```

---

## Deep Dive

### Complexity Analysis

**Time:** O(n)
- Single pass through the array
- Two constant-time operations per element
- Optimal for this problem

**Space:** O(1)
- Only uses 2 variables (currentSum, maxSum)
- Independent of input size
- True constant space

### Common Mistakes

1. **Wrong initialization**
   ```java
   int maxSum = 0;           // ✗ Fails for all-negative arrays
   int maxSum = nums[0];     // ✓ Handles negative numbers
   ```

2. **Starting loop from index 0**
   ```java
   for (int i = 0; ...)      // ✗ Reinitializes with nums[0]
   for (int i = 1; ...)      // ✓ Already initialized
   ```

3. **Using only one variable**
   ```java
   // Can't track both current and max with one variable
   // Lose previous maximum when current decreases
   ```

4. **Array length syntax**
   ```java
   nums.length()             // ✗ Not a method
   nums.length               // ✓ Field access
   ```

### Key Insights

- **Two variables serve different roles**:
  - `currentSum`: Best subarray ending at current position (can go up or down)
  - `maxSum`: Best seen so far (never decreases)

- **Why greedy works here**: If currentSum < 0, adding it makes any future sum worse. Starting fresh is always better. This local optimal choice leads to global optimal.

- **Subarray emerges automatically**: We don't explicitly track the subarray. By making optimal choices, the maximum sum represents the optimal subarray.

- **DP + Greedy combination**: It's both Dynamic Programming (optimal substructure) and Greedy (locally optimal choice).

### Alternative Approaches

**Approach 1: Kadane's Algorithm (Current) - Greedy/DP**
- Time: O(n), Space: O(1)
- ✓ Optimal
- ✓ Simple and elegant

**Approach 2: Brute Force**
```java
// Check all possible subarrays
int maxSum = Integer.MIN_VALUE;
for (int i = 0; i < nums.length; i++) {
    int sum = 0;
    for (int j = i; j < nums.length; j++) {
        sum += nums[j];
        maxSum = Math.max(maxSum, sum);
    }
}
```
- Time: O(n²), Space: O(1)
- ✗ Too slow for large inputs
- ✓ Easy to understand

**Approach 3: Divide and Conquer**
- Time: O(n log n), Space: O(log n)
- ✗ More complex, not optimal
- Educational value for learning recursion

---

## Extended Learning

### Visualization

```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

currentSum tracking (bold = included in current subarray):
[-2]              currentSum = -2
[1]               currentSum = 1  (started fresh)
[1, -3]           currentSum = -2
[4]               currentSum = 4  (started fresh)
[4, -1]           currentSum = 3
[4, -1, 2]        currentSum = 5
[4, -1, 2, 1]     currentSum = 6  ← maxSum = 6
[4, -1, 2, 1, -5] currentSum = 1
[4, -1, 2, 1, -5, 4] currentSum = 5

Maximum: 6 from subarray [4, -1, 2, 1]
```

### Real-World Applications

| Use Case | Description |
|----------|-------------|
| Stock trading | Find best period to hold stock for maximum profit |
| Time series analysis | Detect peak performance periods |
| Sensor data | Identify intervals of maximum activity |
| Performance metrics | Analyze periods of highest throughput |

### Related Problems

- [Best Time to Buy and Sell Stock](best-time-to-buy-and-sell-stock.md) - Similar greedy approach
- Maximum Product Subarray - Variation with multiplication
- Longest Increasing Subarray - Similar pattern recognition

### Pattern Generalization

**When to recognize Kadane's Algorithm / Greedy on arrays:**
- "Maximum/minimum subarray sum"
- At each step, choice between continuing or restarting
- Local optimal choice leads to global optimal
- Can make decision without looking ahead

**Signals this pattern fits:**
- Contiguous subarray required
- Looking for optimal sum/product
- O(n) time hint
- Keywords: "maximum", "contiguous", "subarray"

---

## References

- Strategy: [Greedy](../../../strategies/greedy.md)
- Concept: [Array](../overview.md)
