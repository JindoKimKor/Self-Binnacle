# Stairs (InterviewBit)

## Interview Approach

### 1. Problem Description ("What's the problem?")

> You are climbing a stair case and it takes A steps to reach to the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

### 2. Micro-Analysis ("What does each sentence tell me?")

> "You are climbing a stair case and it takes A steps to reach to the top."
- **Identify:** There is a stair case.
- **Question:** And takes A steps? What does "steps" mean here?
- **Reason:** Reach to the top. So there is a "top" — could be a parameter, could be a return value. Not sure yet.
- **Conclude:** "A steps" and "top" are the two key things. One is probably a parameter, the other could be a return value.
- **Confirm:** Function name is `climbStairs(int A)` — A is the input. Return type and what "top" means exactly — still unknown.

> "Each time you can either climb 1 or 2 steps."
- **Identify:** There are steps, and I can climb them — only 1 or 2 at a time. "Each time" means this repeats → some kind of loop.
- **Question:** Why only 1 or 2? And is the problem going to ask how many times I repeat this?
- **Reason:** 1 step and 2 steps are my only choices — these are something I need to use in the logic. At every point, I pick one or the other.
- **Conclude:** 1 and 2 are actions (choices I make), not static data. And now sentence 1 is clearer — `int A` is the total number of stairs to the top.
- **Confirm:** "Steps" has two meanings: A steps = total stairs (the size), 1 or 2 steps = movement per choice (the action).

> "In how many distinct ways can you climb to the top?"
- **Identify:** "How many distinct ways" — this is the return value. I'm counting something.
- **Question:** Counting what? Combinations (order doesn't matter) or permutations (order matters)? "Distinct ways" — does [1,2] = [2,1] or not?
- **Reason:** Can't tell from this sentence alone. Need to check the examples. 
- **Conclude:** Return type is `int` (a count of permutations). Now sentence 1 is fully resolved — `int climbStairs(int A)`. "Top" = step A (the destination), the return = number of ways to get there. This is a path-counting problem.
- **Confirm:** `int climbStairs(int A)` — full signature confirmed. But is it combinations or permutations? Need examples.

**Example Analysis:**

| | Input | Output | Explanation | Verify |
|---|---|---|---|---|
| Ex 1 | A = 2 | 2 | [1,1], [2] | 2 items listed = output 2 |
| Ex 2 | A = 3 | 3 | [1,1,1], [1,2], [2,1] | 3 items listed = output 3 |

- **Separate:** Split each example into Input / Output / Explanation.
- **Verify:** Does the count in Output match the items in Explanation? → Yes, both match.
- **Compare:** [1,2] and [2,1] are listed as separate ways → order matters → permutations, not combinations.

→ Open question resolved: this is a **permutation count**. Each distinct sequence is a different way.

**Consolidation:**

| SE Label | Value |
|----------|-------|
| **Function name** | `climbStairs` |
| **Input parameter** | `int A` (total stairs) |
| **Return type** | `int` (count of ways) |
| **Goal** | Reach step A |
| **Constraints** | Choices per move: {1, 2} |
| **Iteration** | Repeated choice until goal |
| **Counting rule** | Order matters — [1,2] ≠ [2,1] (confirmed by examples) |

→ `int climbStairs(int A)` — given A stairs, with choices {1, 2} at each step, return the count of distinct sequences that sum to A.

### 3. Pattern Discovery ("Is there a relationship between steps?")

**Pre-step — Look for a relationship:**
I have answers for small steps: ways(2) = 2, ways(3) = 3. Can I use smaller answers to build bigger ones? If yes, I don't need brute force — I just need the rule.

**Step 1 — Assume the result exists:**
I'm at step 5.

**Step 2 — Trace back: "What's the last thing that happened?"**
I either took 1 step from step 4, or 2 steps from step 3. There's no other way to arrive here.

**Step 3 — The rule reveals itself:**
Every way to reach step 5 = ways to reach step 4 (then +1) + ways to reach step 3 (then +2).

**Step 4 — Generalize:**
- **Assumption (natural):** This same logic applies to ANY step, not just step 5. Step 4 also came from step 3 or step 2. Step 3 came from step 2 or step 1.
- **Assumption (math):** ways(n) = ways(n-1) + ways(n-2)

**Overlap check:** ways(3) is needed by both ways(5) and ways(4) → subproblems overlap → DP confirmed.
