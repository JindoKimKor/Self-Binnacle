# Interview Approach Framework

## Question: "How are you going to solve this problem? Explain your approach."

### Framework

1. **Problem Description**: Read the full problem statement
2. **Micro-Analysis**: Break down each sentence:
   - **Analysis** — What does this sentence tell me?
   - **Assumption (natural)** — What can I reason in plain words?
   - **Assumption (math)** — How does that translate to a formula?
3. **Pattern Discovery**: Find the rule (strategy-specific process)
4. **Solution Design**: Why this pattern + how to build it (what to store, how to iterate, edge cases)
5. **Approach**: Example walkthrough to verify the design
6. **"I'll go ahead and write the code."**

---

## Example: First Factorial

**Problem Description:**
> Given an integer n, return the factorial of n. Input is always between 1 and 18.

**Micro-Analysis:**

> "Given an integer n"
- **Analysis:** Input is a single integer. Simple — one variable to work with.
- **Assumption:** Positive integer based on context (confirmed by constraint below).

> "return the factorial of n"
- **Analysis:** Output is a single integer. The keyword **factorial** means n × (n-1) × (n-2) × ... × 1.
- **Assumption:** This is the same operation repeating with a smaller value each time → recursion candidate.

> "Input is always between 1 and 18"
- **Analysis:** Constraint — no edge case for 0 or negatives.
- **Assumption:** 18! = 6,402,373,705,728,000 which fits in a long. No overflow concern.

**Solution Design:**
Recursion. The same operation repeats with a smaller input → factorial(n) = n × factorial(n-1).
- **Base case:** n = 1, return 1
- **Recursive case:** return n × factorial(n-1)
- **Edge cases:** Constraint says n >= 1, so no need for n = 0

**Approach:**
factorial(4) → 4 × factorial(3) → 3 × factorial(2) → 2 × factorial(1) → 1. Then it unwinds: 2, 6, 24.

**"I'll go ahead and write the code."**

---

## Example: Stairs (InterviewBit)

**Problem Description:**
> You are climbing a stair case and it takes A steps to reach to the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Micro-Analysis:**

> "You are climbing a stair case and it takes A steps to reach to the top."
- **Analysis:** Input is a single integer A. We go from step 0 to step A. Output will be a single integer.
- **Assumption:** Each step is sequential (step 1, 2, 3...). We start at the bottom (step 0).

> "Each time you can either climb 1 or 2 steps."
- **Analysis:** At every point, we have **2 choices**. Choices that branch = subproblems.
- **Assumption (natural):** If I'm standing on step 5, how did I get here? I either jumped 1 from step 4, or jumped 2 from step 3. There's no other way. So every way to reach step 5 is either "a way to reach step 4 + one more step" or "a way to reach step 3 + two more steps."
- **Assumption (math):** ways(5) = ways(4) + ways(3). Generalized: ways(n) = ways(n-1) + ways(n-2).

> "In how many distinct ways can you climb to the top?"
- **Analysis:** **"How many distinct ways"** = counting problem. This is a classic DP signal.
- **Assumption:** Order matters — [1,2] and [2,1] are counted as two different ways, not one.

**Solution Design:**
Dynamic Programming. Subproblems overlap (ways(3) needed by both ways(5) and ways(4)) → DP confirmed.
- **What to store:** Only need previous 2 values → 2 variables (not an array)
- **Direction:** Bottom-up (build from small to large, no recursion overhead)
- **Base cases:** dp[1] = 1 (only [1]), dp[2] = 2 ([1,1] or [2])
- **Iteration:** Loop from i = 3 to A
- **Edge cases:** A <= 2 → return A directly (loop wouldn't execute correctly)

**Approach:**
A = 5: dp[3] = 2+1 = 3, dp[4] = 3+2 = 5, dp[5] = 5+3 = 8.

**"I'll go ahead and write the code."**
