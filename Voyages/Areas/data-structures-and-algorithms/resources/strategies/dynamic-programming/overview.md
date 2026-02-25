# Dynamic Programming

## What It Is

DP is not an algorithm or a data structure. It's a **strategy** — a way of thinking:

> "If you're solving the same subproblem more than once, solve it once and reuse the answer."

---

## When to Use This Pattern

**Signals:**
- "How many ways" / "Count distinct ways"
- "Minimum/maximum number of steps"
- Problem breaks into smaller versions of itself
- Subproblems overlap (same question asked more than once)
- Optimal substructure (optimal solution uses optimal sub-solutions)

**Counter-signals:**
- Each subproblem is unique (no overlap) → use Divide & Conquer instead
- A local greedy choice always works → use Greedy instead
- No clear recurrence relation

**Quick check:** "Am I solving the same thing more than once?" → If yes, DP.

### How to Spot DP: Stairs Example

Here's the actual thought process when reading a problem:

**Step 1 — Read the question and find the signal words:**
> "In how many **distinct ways** can you climb to the top?"

"How many distinct ways" → this is a **counting** problem. Counting is a classic DP signal.

**Step 2 — Identify the choices:**
> "Each time you can either climb **1 or 2** steps."

At every point, you have **2 choices**. Choices that branch = subproblems.

**Step 3 — Try to decompose (the key moment):**

Ask yourself: "Can I express the answer for step n using answers from smaller steps?"

```
To reach step 5:
  → I took 1 step from step 4  (how many ways to reach step 4?)
  → I took 2 steps from step 3 (how many ways to reach step 3?)
  → ways(5) = ways(4) + ways(3)
```

Yes — same question, smaller input. This is the **recurrence**.

**Step 4 — Check for overlap (confirms DP):**

```
ways(5) needs ways(4) and ways(3)
ways(4) needs ways(3) and ways(2)
                  ↑
          ways(3) asked TWICE → overlapping subproblems → DP confirmed
```

If subproblems didn't overlap, it would be Divide & Conquer instead.

**Summary — the 3 checkboxes:**

| Check | Question | Stairs |
|-------|----------|--------|
| Signal words | "How many ways / min / max"? | "How many distinct ways" |
| Recurrence | Can answer(n) use answer(smaller)? | ways(n) = ways(n-1) + ways(n-2) |
| Overlap | Is the same subproblem solved twice? | ways(3) needed by both ways(5) and ways(4) |

All three checked → DP.

---

## Core Mechanism

1. **Define the subproblem**: What does `dp[i]` represent?
2. **Find the recurrence**: How does `dp[i]` relate to smaller subproblems?
3. **Identify base cases**: What are the smallest subproblems you can answer directly?
4. **Build up** (bottom-up) or **recurse down** (top-down with memoization)

---

## Two Approaches

### Bottom-Up (Tabulation)
Build from base cases upward. Usually preferred — no recursion overhead.

```java
// Climbing Stairs example
int prev2 = 1, prev1 = 2;
for (int i = 3; i <= n; i++) {
    int current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
}
return prev1;
```

### Top-Down (Memoization)
Recurse naturally, cache results. Easier to think about but has stack overhead.

```java
int[] memo = new int[n + 1];
int solve(int n) {
    if (n <= 2) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = solve(n - 1) + solve(n - 2);
    return memo[n];
}
```

---

## Variations

| Variation | When to Use | Example |
|-----------|-------------|---------|
| 1D DP | State depends on previous 1-2 values | Climbing Stairs, Fibonacci |
| 2D DP | Two dimensions of state (grid, two sequences) | Unique Paths, Edit Distance |
| Knapsack | Choose items with weight/value tradeoff | 0/1 Knapsack, Coin Change |
| Interval DP | Optimal over ranges | Matrix Chain Multiplication |

---

## Problems Using This Pattern

| Problem | Data Structure | Variation | Difficulty |
|---------|---------------|-----------|------------|
| [Stairs](path-counting/stairs.md) | Array | Path Counting | Easy |

---

## Common Mistakes

- Using naive recursion without memoization → O(2^n) instead of O(n)
- Wrong base cases (off-by-one errors)
- Forgetting edge cases for small inputs (n=0, n=1)
- Using O(n) space when only previous 1-2 values are needed (can optimize to O(1))

---

## DP vs Greedy

| | Dynamic Programming | Greedy |
|---|---|---|
| **Explores** | All subproblems | Only locally optimal choice |
| **Guarantees** | Global optimum (always) | Global optimum (only when proven) |
| **Speed** | Usually O(n) or O(n²) | Usually O(n) |
| **Use when** | Greedy doesn't work, overlapping subproblems | Local optimal = global optimal |

---

## Related Patterns

- [Greedy](greedy.md) - Simpler, but only works when local optimum = global optimum
- Divide & Conquer - Similar decomposition, but subproblems don't overlap
