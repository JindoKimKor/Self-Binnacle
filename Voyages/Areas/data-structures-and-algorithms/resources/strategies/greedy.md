# Greedy

## When to Use This Pattern

**Signals:**
- "Maximum/minimum" in problem statement
- Can make locally optimal choice at each step
- Problem has optimal substructure
- "Best time to buy/sell", "maximum subarray"
- No need to backtrack or reconsider decisions

**Counter-signals:**
- Need to explore all possibilities
- Local optimum doesn't lead to global optimum
- Problem requires looking ahead

---

## Core Mechanism

Make the best choice at each step without reconsidering:
1. **Min/Max tracking**: Track running minimum/maximum
2. **Kadane's Algorithm**: Choose between continuing or starting fresh
3. **Interval selection**: Choose best interval at each step

---

## Template Code

### Variation 1: Min Tracking (Best Time to Buy/Sell Stock)

```java
int minPrice = Integer.MAX_VALUE;
int maxProfit = 0;

for (int price : prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
}

return maxProfit;
```

### Variation 2: Kadane's Algorithm (Maximum Subarray)

```java
int currentSum = nums[0];
int maxSum = nums[0];

for (int i = 1; i < nums.length; i++) {
    // Greedy choice: continue or start fresh?
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
}

return maxSum;
```

---

## Variations

| Variation | When to Use | Key Difference |
|-----------|-------------|----------------|
| Min/Max tracking | Single pass optimization | Track best seen so far |
| Kadane's Algorithm | Maximum subarray problems | Choose between continue/restart |
| Interval selection | Scheduling, interval problems | Choose best non-overlapping intervals |

---

## Problems Using This Pattern

| Problem | Data Structure | Technique | Difficulty |
|---------|---------------|-----------|------------|
| [Maximum Subarray](../data-structures/array/greedy/maximum-subarray.md) | Array | Kadane's Algorithm | Medium |
| [Best Time to Buy and Sell Stock](../data-structures/array/greedy/best-time-to-buy-and-sell-stock.md) | Array | Min tracking | Easy |

---

## Common Mistakes

- Trying to use greedy when problem requires exploring all options
- Not proving that greedy choice leads to optimal solution
- Forgetting to update tracking variables
- In Kadane's: not considering single element as potential answer

---

## Related Patterns

- [Dynamic Programming](dynamic-programming/overview.md) - Greedy is simpler but only works when local optimum = global optimum
- Two Pointers - Sometimes combined with greedy choices
