# Best Time to Buy and Sell Stock

## 1. Pattern Recognition

**Keywords:** "maximum profit", "buy and sell", "future date"

**Constraint:** Buy day must be before sell day

**Key Insight:**
- Buy on cheapest day, sell on most expensive day after that
- Track "minimum so far" while calculating difference with current value
- Can't go back in time (sequential processing)

---

## 2. Algorithm: Greedy (One Pass)

**Pattern Name:** Single Pass / Greedy Algorithm

**Core Idea:**
- Track minimum price so far
- Calculate profit if selling at current price
- Update maximum profit

**How it works:**
1. `min = first day's price`
2. For each day:
   - If current price < min → update min
   - current price - min = profit if selling today
   - Update max profit

---

## 3. Complexity

- **Time:** O(n) - traverse array once
- **Space:** O(1) - only 2 variables (min, profit)
- **Feature:** No additional data structure needed

---

## 4. Solution Strategies

### Brute Force (Inefficient)
- Check all (buy day, sell day) combinations
- Time: O(n²)
- 2 loops

### Greedy (Optimal)
- Single pass tracking minimum
- Time: O(n)
- 1 loop

---

## 5. Common Mistakes

### 1. Initial value setup
```java
int min = 0;           // ✗ Wrong
int min = prices[0];   // ✓ Initialize with first array value
```
Must start with actual array value, not 0 or arbitrary value

### 2. Comparison target
```java
if (prices[i] < prices[i-1])  // ✗ Compare with previous
if (prices[i] < min)          // ✓ Compare with min so far
```
Compare with minimum so far, not previous value

### 3. Profit update
```java
profit = prices[i] - min;                      // ✗ Overwrites
profit = Math.max(profit, prices[i] - min);   // ✓ Keep maximum
```
Calculate each time but only store maximum

### 4. Unnecessary else
```java
// Simpler to check both every time
min = Math.min(min, prices[i]);
profit = Math.max(profit, prices[i] - min);
```

---

## 6. Clean Solution

```java
class Solution {
    public int maxProfit(int[] prices) {
        int min = prices[0];
        int profit = 0;

        for (int i = 1; i < prices.length; i++) {
            min = Math.min(min, prices[i]);
            profit = Math.max(profit, prices[i] - min);
        }
        return profit;
    }
}
```

---

## 7. Edge Cases

| Case | Input | Output | Note |
|------|-------|--------|------|
| Always decreasing | `[7,6,4,3,1]` | 0 | No profit possible |
| Always increasing | `[1,2,3,4,5]` | 4 | Buy at 1, sell at 5 |
| Size 1 | `[5]` | 0 | Can't trade |
| Min at end | `[5,4,3,2,1]` | 0 | - |
| Max at end | `[1,2,3,4,5]` | 4 | - |

---

## 8. Variable Trace Example

```
prices = [7, 1, 5, 3, 6, 4]

Initial: min = 7, profit = 0

i=1: prices[1]=1
  min = Math.min(7, 1) = 1
  profit = Math.max(0, 1-1) = 0

i=2: prices[2]=5
  min = Math.min(1, 5) = 1
  profit = Math.max(0, 5-1) = 4

i=3: prices[3]=3
  min = Math.min(1, 3) = 1
  profit = Math.max(4, 3-1) = 4

i=4: prices[4]=6
  min = Math.min(1, 6) = 1
  profit = Math.max(4, 6-1) = 5

i=5: prices[5]=4
  min = Math.min(1, 4) = 1
  profit = Math.max(5, 4-1) = 5

Answer: 5
```

---

## 9. Java Syntax Points

```java
// Access first array element
prices[0]

// Math.min/max
Math.min(a, b)
Math.max(a, b)

// Variable initialization: meaningful value (not 0)
int min = prices[0];

// Loop start: i = 1 (first value already used as min)
for (int i = 1; i < prices.length; i++)
```

---

## 10. Real-world Applications

| Use Case | Description |
|----------|-------------|
| Time series analysis | Find lowest-to-highest points |
| Performance monitoring | Max response time after minimum |
| Price tracking | Current discount rate vs lowest price |
| Metric analysis | Peak value vs baseline |

---

## 11. Generalized Pattern

**"Minimum/Maximum so far" pattern:**
- Track cumulative min/max while traversing
- Compare with current value to calculate result
- O(1) space, O(n) time

**Other problems using this pattern:**
- Minimum/Maximum subarray
- Water container
- Trapping rain water

---

## 12. Coding Test Perspective

- **New pattern:** Greedy (optimal choice at each step)
- **No data structure:** Solved with just variables
- **Single pass:** O(n) optimization
- **Real-world relevance:** High (min/max tracking commonly used)

---

## 13. Greedy Algorithm Concept

**Definition:** Make the best choice at each step

**Characteristics:**
- Don't reverse past decisions
- Local optimum leads to global optimum
- Fast and simple

**This problem:** Always remember "minimum so far"
