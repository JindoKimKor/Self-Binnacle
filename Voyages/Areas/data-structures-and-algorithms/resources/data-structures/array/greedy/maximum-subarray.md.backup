# Maximum Subarray (LC 53)

## Problem

Find maximum sum of contiguous subarray in an integer array

**Input/Output:**
```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] = 6

Input: nums = [1]
Output: 1

Input: nums = [-1]
Output: -1
```

---

## Pattern Recognition

- "Maximum sum"
- "Contiguous subarray"
- "At each position: continue vs start fresh"
- → Kadane's Algorithm (DP/Greedy)

**Data Structure:** None (just 2 variables)
**Algorithm:** Kadane's Algorithm (Dynamic Programming)

---

## Core Idea

**Two variables:**
- `currentSum`: Max subarray sum ending at current position
- `maxSum`: Overall maximum seen so far

**At each index:**
1. Update currentSum:
   - Option A: Current value only (start fresh)
   - Option B: currentSum + current value (continue)
   - Choose larger one

2. Update maxSum:
   - currentSum vs maxSum
   - Choose larger one

**Why it works:**
```
If currentSum < 0:
→ negative + current < current
→ Starting fresh is better

If currentSum ≥ 0:
→ positive + current > current
→ Continuing is better
```

---

## Solution

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // Continue vs start fresh
            if (nums[i] > currentSum + nums[i]) {
                currentSum = nums[i];
            } else {
                currentSum = currentSum + nums[i];
            }

            // Update maximum
            if (currentSum > maxSum) {
                maxSum = currentSum;
            }
        }

        return maxSum;
    }
}
```

**Simplified (Math.max):**
```java
class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }
}
```

---

## Complexity

**Time: O(n)**
- Single array traversal
- O(1) operation per step

**Space: O(1)**
- Only 2 variables (currentSum, maxSum)
- Independent of input size

---

## Key Learnings

### 1. Role of Two Variables

**currentSum (working):**
- Best including current position
- Keeps changing (better or worse)

**maxSum (storage):**
- Best seen so far
- Never decreases
- Once up, stays up

### 2. Four Cases

| currentSum | Current Value | Action |
|------------|---------------|--------|
| Negative | Positive | Current only |
| Negative | Negative | Current only (less bad) |
| Positive | Positive | Add |
| Positive | Negative | Add (usually) |

**Simplified:**
- current < 0 → Current value only
- current ≥ 0 → Add

### 3. Subarray is Automatic
- Not "finding" subarray
- Making optimal choices
- Optimal subarray emerges naturally

### 4. Greedy + DP
- **Greedy:** Best choice at each step
- **DP:** Optimal sub-solution leads to optimal solution

### 5. Array vs String
```java
array: arr.length   // field
String: s.length()  // method
```

---

## Common Mistakes

### Initial values
```java
maxSum = nums[0];      // First value
currentSum = nums[0];
```

### Loop start
```java
for (int i = 1; ...)  // Start from index 1
```

### Array length
```java
nums.length  // No parentheses
```

### Two variables required
- Using only 1 loses previous maximum

---

## Interview Strategy

### Phase 1: Mention Brute Force
"Checking all subarrays is O(n²)"

### Phase 2: Optimization
"Kadane's Algorithm does O(n)"

### Phase 3: Explanation
"At each position, choose between continuing or starting fresh - whichever is better"

---

## Real-world Applications

| Use Case | Description |
|----------|-------------|
| Time series max interval | Peak period detection |
| Stock profit max period | Best trading window |
| Performance metrics | Analyze metrics data |
| Sensor data | Anomaly interval detection |

---

## Performance

- **Runtime:** 1ms (Beats 99.45%!)
- **Memory:** 77.38 MB (Beats 8.50%)

---

## Key Insights (Discovered)

### "Always add both" is wrong
- Actually compare then choose
- If negative, don't add (discard)

### "How to maintain max?"
- Store in separate variable
- Never decreases

### "Not finding subarray"
- Calculation result IS the subarray
- Optimal solution found automatically
