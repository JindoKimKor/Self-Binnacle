# Stack

## What is it?

A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end (top).

---

## Core Concepts

### LIFO Principle
- **Last In, First Out**
- Like a stack of plates: add to top, remove from top
- Most recently added element is first to be removed

### Operations
- **Push**: Add element to top - O(1)
- **Pop**: Remove element from top - O(1)
- **Peek**: View top element without removing - O(1)

---

## Time Complexity

| Operation | Time |
|-----------|------|
| Push | O(1) |
| Pop | O(1) |
| Peek | O(1) |
| Search | O(n) |

---

## Space Complexity

O(n) - where n is number of elements stored

---

## When to Use

**Signals:**
- Need to reverse order
- Matching/pairing problems (parentheses, brackets)
- Tracking most recent items
- Undo functionality
- Depth-First Search (DFS)

**Keywords:**
- "Valid parentheses"
- "Nested structure"
- "Most recent"
- "Backtrack"

---

## Java Syntax

```java
// Create
Stack<Integer> stack = new Stack<>();

// Push (add to top)
stack.push(value);

// Pop (remove from top)
int value = stack.pop();

// Peek (view top without removing)
int top = stack.peek();

// Check if empty
if (stack.isEmpty()) { }

// Size
int size = stack.size();
```

---

## Common Patterns

1. **Matching**: Push opening symbols, pop on closing (parentheses validation)
2. **Reversal**: Push all elements, then pop to reverse order
3. **Tracking state**: Keep track of previous states for backtracking

---

## Stack vs Queue

| Aspect | Stack | Queue |
|--------|-------|-------|
| Order | LIFO (Last In, First Out) | FIFO (First In, First Out) |
| Operations | Push/Pop from same end | Enqueue one end, Dequeue other end |
| Use case | Undo, DFS, matching | BFS, scheduling, ordering |

---

## Visual Example

```
Push(1): [1]
Push(2): [1, 2]
Push(3): [1, 2, 3] ← top
Pop():   [1, 2]     (returns 3)
Peek():  [1, 2]     (returns 2, doesn't remove)
Pop():   [1]        (returns 2)
```

---

## Trade-offs

**Pros:**
- Simple O(1) operations
- Natural fit for certain problems
- Efficient memory usage

**Cons:**
- Only access to top element
- No random access
- Different order from input

---

## Related Concepts

- Queue - FIFO alternative
- [Linked List](linked-list.md) - Can implement stack using LinkedList
- Recursion - Call stack uses Stack structure
