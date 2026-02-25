# Linked List

## What is it?

A linear data structure where elements (nodes) are connected via pointers, not stored contiguously in memory.

---

## Core Concepts

### Structure

Each node contains:
- **Data**: The value stored
- **Next**: Pointer to next node

```java
class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
        this.next = null;
    }
}
```

### Types
- **Singly Linked List**: Each node points to next only
- **Doubly Linked List**: Each node points to both next and previous
- **Circular Linked List**: Last node points back to first

---

## Time Complexity

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Search | O(n) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1) | O(n) without tail, O(1) with tail |
| Delete | O(n) | O(1) if node known |

---

## Space Complexity

O(n) - but requires extra space for pointers

---

## When to Use

**Use LinkedList when:**
- Frequent insertions/deletions at beginning
- Don't need random access
- Size changes frequently
- Memory doesn't need to be contiguous

**Use Array when:**
- Need random access by index
- Mostly reading, few modifications
- Memory can be allocated contiguously

---

## Common Operations

### Traversal

```java
ListNode current = head;
while (current != null) {
    // Process current node
    current = current.next;
}
```

### Insert at Beginning

```java
ListNode newNode = new ListNode(val);
newNode.next = head;
head = newNode;
```

### Delete Node

```java
// Assuming prev is the node before the one to delete
prev.next = prev.next.next;
```

---

## Common Patterns

1. **[Dummy Node](../../strategies/dummy-node.md)**: Simplifies edge cases at head
2. **Two Pointers**: Fast/slow for cycle detection, finding middle
3. **Reversal**: Three pointers pattern
4. **Merge**: Compare and link nodes from multiple lists

---

## Common Mistakes

- **Losing references**: Save `next` before modifying pointers
- **Null pointer exceptions**: Always check `node != null` and `node.next != null`
- **Infinite loops**: In circular lists or when not updating pointers
- **Not handling head**: Special cases when modifying first node

---

## Visual Example

```
[1] → [2] → [3] → [4] → null
 ↑
head

Insert 0 at beginning:
[0] → [1] → [2] → [3] → [4] → null
 ↑
head

Delete node with value 2:
[0] → [1] → [3] → [4] → null
```

---

## Trade-offs

**Pros:**
- O(1) insertion/deletion at known position
- Dynamic size
- No memory waste from unused capacity

**Cons:**
- No random access
- Extra memory for pointers
- Poor cache locality

---

## Related Concepts

- [Array](array.md) - Contiguous alternative
- [Stack](stack.md) - Can implement with LinkedList
- Queue - Can implement with LinkedList
