---
title: "[Area] Data Structures and Algorithms"
created: 2024-07-14
---

## Why
- Technical interview preparation
- Software engineering fundamentals

## What
Continuous study of data structures and algorithms for technical interviews and software engineering fundamentals.

## How

### Learning Approach
1. Understand basic data structures - when to use each
2. Pattern recognition - "This is a two pointer problem"
3. Complexity analysis habit - always think Big O
4. Optimization thinking - "Is there a better way?"

> LeetCode's real value is internalizing this thought process. Understanding 30 problems deeply is better than solving 100 superficially.

### Interview Approach Framework Workflow

**For each problem:**
1. Read problem → Think (don't code yet!)
2. Write explanation using [Interview Approach Framework](interview-approach-framework.md):
   - Input/Output
   - Keywords & Constraints
   - Pattern + Why
   - Approach (with example walkthrough)
   - "I'll go ahead and write the code"
3. Code the solution
4. Log in today's passage: problem name, pattern, explanation quality

**Weekly:**
- Review all problems solved
- Identify weak explanations
- Update pattern library in resources/

**Resources:**
- Framework reference: [interview-approach-framework.md](interview-approach-framework.md)
- Pattern library: [resources/patterns/](resources/patterns/)

---

## Sailing Orders

### Plotted (Underway)

### Plotted Courses

> | Deadline | Created | Order | Purpose |
> |----------|---------|-------|---------|
> | - | 2026-01-30 | Decide learning approach for C# Type Characteristics | Maximize learning effectiveness |
>
> <details>
> <summary>Details</summary>
>
> **Options to consider:**
> 1. **Fill-in-the-blank approach** - Use table format as-is but leave Big O notation blank, fill in while solving problems
> 2. **Story-based approach** - Solve Coderbyte problems and document story-style ("I used Dictionary here because O(1) lookup...") + track in Progress Tracker
>
> </details>
<br>

> | Deadline | Created | Order | Purpose |
> |----------|---------|-------|---------|
> | - | 2026-01-30 | Plan how to deepen understanding of real-world DS/Algo applications | Connect theory to industry practice |
>
> <details>
> <summary>Details</summary>
>
> **Context:** Professor's PROG3330 material maps data structures to real companies (Google, Amazon, Netflix, etc.)
>
> **Potential directions:**
> - Deep dive into one company's stack (e.g., Redis: Skip List, Bloom Filter)
> - Pick one data structure and research all its real-world uses
> - Build mini-projects that simulate real-world use cases
> - Interview prep angle: "Why would you use X over Y?"
>
> </details>
<br>

### Plotted (Reached)

---

## Progress Tracker

| Problem | Data Structure | Pattern | Technique | Time | Space | Note |
|---------|---------------|---------|-----------|------|-------|------|
| [Best Time to Buy/Sell Stock](resources/array/greedy/best-time-to-buy-and-sell-stock.md) | Array | Greedy | Min Tracking | O(n) | O(1) | Track minimum |
| [Maximum Subarray](resources/array/greedy/maximum-subarray.md) | Array | DP / Greedy | Kadane's Algorithm | O(n) | O(1) | Continue vs restart |
| [Reverse String](resources/array/two-pointers/reverse-string.md) | Array | Two Pointers | Swap | O(n) | O(1) | In-place swap |
| [Valid Anagram](resources/array/frequency-count/valid-anagram.md) | Array (int[26]) | - | Frequency Count | O(n) | O(1) | Character counting |
| [Binary Search](resources/array/binary-search/binary-search.md) | Array (Sorted) | Binary Search | Halving | O(log n) | O(1) | Halve each step |
| [Two Sum](resources/hash/lookup/two-sum.md) | HashMap | Hashing | Complement Lookup | O(n) | O(n) | O(n²)→O(n) with Hash |
| [Contains Duplicate](resources/hash/lookup/contains-duplicate.md) | HashSet | Hashing | Existence Check | O(n) | O(n) | Set for duplicates |
| [Linked List Cycle](resources/linked-list/two-pointers/linked-list-cycle.md) | LinkedList | Two Pointers | Fast/Slow (Floyd's) | O(n) | O(1) | Tortoise and hare |
| [Merge Two Sorted Lists](resources/linked-list/manipulation/merge-two-sorted-lists.md) | LinkedList | - | Dummy Node | O(n+m) | O(1) | Dummy node pattern |
| [Reverse Linked List](resources/linked-list/manipulation/reverse-linked-list.md) | LinkedList | - | Three Pointers | O(n) | O(1) | Pointer manipulation |
| [Valid Parentheses](resources/stack/matching/valid-parentheses.md) | Stack | - | LIFO Matching | O(n) | O(n) | Bracket pairing |

**Total: 11 problems**

---

## Data Structures

### Linear
- Array, Linked List, Stack, Queue, Deque

### Non-linear
- Tree (Binary Tree, BST, Heap), Graph

### Hashing
- HashMap, HashSet

### Advanced
- Trie, Union-Find, Segment Tree

---

## Algorithm Patterns
- Two Pointers
- Sliding Window
- Binary Search
- DFS/BFS
- Dynamic Programming
- Greedy
- Backtracking

---

## Complexity Analysis
- Time: O(1), O(log n), O(n), O(n log n), O(n²)
- Space: Additional memory usage
- Trade-offs: Time vs Space, Readability vs Performance

---

## Notes
- [Big-O Notation](resources/big-o-notation.md) - Big-O basics
- [Real-World Applications](resources/real-world-applications.md) - Real-world use cases (PROG3330)
- [C# Type Characteristics](resources/Csharp-type-chracteristics.md) - Type combinations & complexity

### Practice Platforms
| Platform | Purpose |
|----------|---------|
| [Coderbyte](https://coderbyte.com/challenges) | Get familiar with actual test environment (free challenges) |
| [LeetCode](https://leetcode.com/) | Increase Easy/Medium problem volume |
| [HackerRank](https://www.hackerrank.com/domains/tutorials/10-days-of-csharp) | C# specific track available |

### Learning Resources

**Books:**
- "Introduction to Algorithms" by Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein
- "Data Structures and Algorithms in Java" by Robert Lafore
- "Algorithms" by Robert Sedgewick and Kevin Wayne
- "The Algorithm Design Manual" by Steven Skiena

**Websites:**
- GeeksforGeeks: https://www.geeksforgeeks.org/
- HackerRank: https://www.hackerrank.com/domains/data-structures
- Topcoder: https://www.topcoder.com/community/data-science/data-science-tutorials/
- LeetCode: https://leetcode.com/
- Tech Interview Handbook - Grind 75: https://www.techinterviewhandbook.org/grind75/

**YouTube Channels:**
- MIT OpenCourseWare: https://www.youtube.com/channel/UCEBb1b_L6zDS3xTUrIALZOw
- Abdul Bari: https://www.youtube.com/channel/UCZCFT11CWBi3MHNlGf019nw
- Back To Back SWE: https://www.youtube.com/channel/UCmJz2DV1a3yfgrR7GqRtUUA

---

## Reflection
### Outcome
- actual:

### Learn
- actual:

### Harvest
- actual:

https://deepmind.google/blog/alphadev-discovers-faster-sorting-algorithms/

https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/
