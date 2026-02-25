# Best Time to Buy and Sell Stock (LC 121)

## Interview Approach

### 1. Input/Output

```
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price=1), sell on day 5 (price=6), profit = 6-1 = 5

Input: prices = [7,6,4,3,1]
Output: 0
Explanation: No profitable transaction possible (prices always decreasing)
```

### 2. Keywords & Constraints

**Keywords:**
- "maximum profit"
- "buy and sell"
- "future date"

**Constraints:**
- Must buy before selling (can't go back in time)
- Can only complete one transaction (one buy + one sell)
- If no profit possible, return 0

### 3. Pattern + Why

**Pattern:** Greedy (Min Tracking)

**Why this pattern:**
To maximize profit, we need to buy at the lowest price and sell at the highest price after that. By tracking the minimum price seen so far while traversing, we can calculate the best profit at each day. The greedy choice (always remembering the minimum) leads to the optimal solution.

**Data Structure:** None (just 2 variables)

### 4. Approach

**Core Idea:**
Track the minimum price seen so far, and at each day, calculate profit if we sell today. Keep the maximum profit.

**How it works:**
1. Initialize `min = prices[0]`, `maxProfit = 0`
2. For each day from index 1:
   - Update `min` = minimum of (current min, today's price)
   - Calculate profit = today's price - min
   - Update `maxProfit` = maximum of (current maxProfit, profit)
3. Return `maxProfit`

**Example Walkthrough:**

```
prices = [7, 1, 5, 3, 6, 4]

Initial: min = 7, maxProfit = 0

i=1 (price=1):
  min = min(7, 1) = 1
  profit = 1 - 1 = 0
  maxProfit = max(0, 0) = 0

i=2 (price=5):
  min = min(1, 5) = 1
  profit = 5 - 1 = 4
  maxProfit = max(0, 4) = 4

i=3 (price=3):
  min = min(1, 3) = 1
  profit = 3 - 1 = 2
  maxProfit = max(4, 2) = 4

i=4 (price=6):
  min = min(1, 6) = 1
  profit = 6 - 1 = 5
  maxProfit = max(4, 5) = 5

i=5 (price=4):
  min = min(1, 4) = 1
  profit = 4 - 1 = 3
  maxProfit = max(5, 3) = 5

Result: 5 (buy at 1, sell at 6)
```

### 5. Code

```java
// "I'll go ahead and write the code."
class Solution {
    public int maxProfit(int[] prices) {
        int min = prices[0];
        int maxProfit = 0;

        for (int i = 1; i < prices.length; i++) {
            min = Math.min(min, prices[i]);
            maxProfit = Math.max(maxProfit, prices[i] - min);
        }

        return maxProfit;
    }
}
```

---

## Deep Dive

### Complexity Analysis

**Time:** O(n)
- Single pass through the array
- Constant-time operations at each step
- Optimal for this problem

**Space:** O(1)
- Only uses 2 variables (min, maxProfit)
- Independent of input size

### Common Mistakes

1. **Wrong initialization**
   ```java
   int min = 0;              // ✗ Should use actual price
   int min = prices[0];      // ✓ Use first day's price
   ```

2. **Comparing with wrong value**
   ```java
   if (prices[i] < prices[i-1])  // ✗ Compare with previous
   if (prices[i] < min)          // ✓ Compare with minimum so far
   ```

3. **Overwriting profit instead of keeping max**
   ```java
   profit = prices[i] - min;                     // ✗ Loses previous max
   profit = Math.max(profit, prices[i] - min);   // ✓ Keeps maximum
   ```

4. **Forgetting loop starts at index 1**
   ```java
   for (int i = 0; ...)      // ✗ Redundant, already initialized
   for (int i = 1; ...)      // ✓ First price already used
   ```

### Key Insights

- **Greedy works**: Tracking minimum price is sufficient. We don't need to remember which day we bought—just the lowest price seen.

- **Why no lookback needed**: At each day, `min` represents the best buy opportunity so far. We can calculate profit immediately.

- **Two variables, two roles**:
  - `min`: Best buying price (lowest so far)
  - `maxProfit`: Best selling decision (highest profit so far)

- **Similar to Kadane's**: Like Maximum Subarray, this tracks a running optimal value while traversing once.

### Alternative Approaches

**Approach 1: Greedy Min Tracking (Current)**
- Time: O(n), Space: O(1)
- ✓ Optimal
- ✓ Simple and elegant

**Approach 2: Brute Force**
```java
int maxProfit = 0;
for (int i = 0; i < prices.length; i++) {
    for (int j = i + 1; j < prices.length; j++) {
        maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
    }
}
```
- Time: O(n²), Space: O(1)
- ✗ Too slow for large inputs
- ✓ Easy to understand

**Approach 3: Dynamic Programming**
- Time: O(n), Space: O(n) with DP array
- ✗ Unnecessary space
- Same logic as greedy but with array

---

## Extended Learning

### Visualization

```
prices = [7, 1, 5, 3, 6, 4]

Day:     0   1   2   3   4   5
Price:   7   1   5   3   6   4
         ↓
       (min tracked)

i=0: min=7, profit=0
i=1: min=1, profit=0  (1-1=0)
i=2: min=1, profit=4  (5-1=4) ← first profitable day
i=3: min=1, profit=4  (3-1=2, but keep 4)
i=4: min=1, profit=5  (6-1=5) ← best profit
i=5: min=1, profit=5  (4-1=3, but keep 5)

Best: Buy at day 1 (price 1), Sell at day 4 (price 6) = profit 5
```

### Real-World Applications

| Use Case | Description |
|----------|-------------|
| Stock trading | Identify best single buy/sell opportunity |
| Price tracking | Calculate maximum discount vs historical low |
| Performance metrics | Peak performance vs baseline |
| Time series analysis | Find lowest-to-highest value pairs |

### Related Problems

- [Maximum Subarray](maximum-subarray.md) - Similar greedy tracking pattern
- Best Time to Buy and Sell Stock II - Multiple transactions allowed
- Best Time to Buy and Sell Stock with Cooldown - State machine variation

### Pattern Generalization

**When to recognize "Min/Max Tracking" greedy pattern:**
- Need to find optimal pair (min, max) with order constraint
- "Buy low, sell high" type problems
- Can make decision by tracking running min/max
- Single pass solution possible

**Signals this pattern fits:**
- Keywords: "maximum profit", "minimum/maximum so far"
- Order matters (past → future)
- O(n) time hint
- Can't look back or rearrange

---

## References

- Strategy: [Greedy](../../../strategies/greedy.md)
- Concept: [Array](../overview.md)
