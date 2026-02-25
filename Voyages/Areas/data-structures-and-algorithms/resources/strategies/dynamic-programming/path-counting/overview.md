# Path Counting (DP Sub-category)

## What It Is

Path counting problems ask: **"How many distinct ways to get from A to B?"**

This is a sub-category of Dynamic Programming where the core question is about counting routes, combinations, or sequences.

---

## Pattern Discovery

The core skill in path-counting is **discovering the recurrence** — the rule that connects each step to smaller steps. Here's how:

### Step 1: Assume the result exists

Pick a concrete goal state. Don't solve it — just **stand there**.

```
"I'm at step 5."
```

### Step 2: Trace back — what must have happened right before?

Ask: **"What's the last thing that happened before I got here?"**

```
"I either took 1 step from step 4, or 2 steps from step 3.
 There's no other way to arrive at step 5."
```

### Step 3: The rule reveals itself

The previous states you identified ARE the recurrence:

```
Every way to reach step 5 =
  ways to reach step 4 (then take 1 more)
  + ways to reach step 3 (then take 2 more)
```

### Step 4: Generalize

Replace the concrete number with n:

```
ways(n) = ways(n-1) + ways(n-2)
```

That's the pattern. You didn't need to trace all paths — you just asked one question about the destination and the rule appeared.

### Why This Works

- **Forward** = "Let me try all possible paths" → brute force, branches explode
- **Pattern discovery** = "Assume I'm at the goal, what came before?" → reveals the rule in one step

The rule repeats at every step, so you build up from base cases and the answer assembles itself.

### The Math Connection: Induction

This is the same thinking as **mathematical induction**:

| Induction | Path Counting DP |
|---|---|
| Base case: prove for n=1 | Base case: dp[1] = 1 |
| Assume it works for k | Assume I know the answer for smaller steps |
| Prove it works for k+1 | Compute this step using smaller answers |

DP is induction with a cache.

---

## When to Recognize Path Counting

**Signal words:**
- "How many ways"
- "Count distinct ways"
- "Number of paths"
- "How many combinations" (where order matters)

**Structure:**
- You move from a start to an end
- At each point you have a **fixed set of choices** (1 or 2 steps, up or right, etc.)
- You're counting, not optimizing

---

## The Approach

1. **Define the state:** What does dp[i] mean? (usually: "number of ways to reach state i")
2. **Pattern discovery:** Assume you're at the goal. "What's the last thing that happened?" → find the recurrence
3. **Write the recurrence:** dp[i] = sum of dp[previous states]
4. **Find base cases:** What are the smallest states you can answer directly?
5. **Build up:** Compute from base cases to the target

---

## Problems

| Problem | Choices | Recurrence | Difficulty |
|---------|---------|------------|------------|
| [Stairs](stairs.md) | 1 or 2 steps | dp[n] = dp[n-1] + dp[n-2] | Easy |

---

## Mathematical Foundation

Path counting DP is built on concepts from mathematics. Understanding these connections helps recognize the pattern faster.

| Concept | What It Is | Connection to Path Counting |
|---------|-----------|----------------------------|
| **Fibonacci Sequence** | F(n) = F(n-1) + F(n-2) | Stairs is Fibonacci with different base cases |
| **Mathematical Induction** | Prove base case, then "if k works → k+1 works" | Same logic: assume smaller is solved, build up |
| **Recurrence Relation** | a(n) defined in terms of a(n-1), a(n-2), ... | Every path counting problem IS a recurrence relation |
| **Pascal's Triangle** | C(n,k) = C(n-1,k-1) + C(n-1,k) | Each cell = sum of previous cells — same principle |

### Key Insight

The "pattern discovery" process (assume result → trace back → find the rule) is exactly how you derive a **recurrence relation** in math. The only difference:

- In math class: you write the formula on paper
- In DP: you **code** the formula and let the computer build up from base cases

---

## Related

- Parent: [Dynamic Programming](../overview.md)
- Related problems (not yet documented): Unique Paths, Decode Ways, Coin Change (counting version)
