# DSA Resources Organization

## Folder Structure

```
resources/
├── patterns/           # Algorithm patterns for interview prep
├── concepts/           # Foundational data structures & techniques
├── problems/           # Problem solutions (organized by data structure)
├── big-o-notation.md
├── real-world-applications.md
└── Csharp-type-chracteristics.md
```

---

## 📂 patterns/

**Purpose:** Cross-cutting algorithm patterns

**When to use:**
- "What pattern does this problem fit?"
- Need template code for a pattern
- Want to see all problems using a pattern

**Files:**
- `two-pointers.md` - Both ends, fast/slow pointers
- `hashing.md` - O(1) lookup, frequency counting
- `greedy.md` - Kadane's algorithm, min/max tracking
- `binary-search.md` - Halving search space

---

## 📂 concepts/

**Purpose:** Deep dives into fundamentals

**When to use:**
- "How does HashMap work internally?"
- Forgot syntax for data structure operations
- Need to understand time/space complexity

**Organization:**
- `data-structures/` - Array, LinkedList, Stack, Hash Table
- `techniques/` - Dummy Node, Swap Pattern

---

## 📂 problems/

**Purpose:** Individual problem solutions

**Organization:** `{data-structure}/{pattern}/{problem}.md`

**Examples:**
- `array/two-pointers/reverse-string.md`
- `hash/lookup/two-sum.md`
- `linked-list/manipulation/merge-two-sorted-lists.md`

**File format:**
Each problem has 3 sections:
1. **Interview Approach** - 5-step framework (Input/Output, Keywords, Pattern+Why, Approach, Code)
2. **Deep Dive** - Complexity, mistakes, insights, alternatives
3. **Extended Learning** - Visualizations, real-world apps, related problems

---

## Navigation Paths

**By Pattern:**
1. Start at `patterns/{pattern}.md`
2. See "Problems Using This Pattern" table
3. Click problem link

**By Data Structure:**
1. Browse `problems/{data-structure}/`
2. Navigate to pattern subfolder
3. Open problem file

**By Concept:**
1. Start at `concepts/data-structures/` or `concepts/techniques/`
2. Learn fundamentals
3. See "Related Concepts" links at bottom
