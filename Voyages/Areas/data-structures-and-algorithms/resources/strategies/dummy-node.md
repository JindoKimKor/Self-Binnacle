# Dummy Node Technique

## What is it?

A technique for simplifying LinkedList operations by creating a temporary "dummy" node before the actual head, avoiding special cases for head modifications.

---

## Problem It Solves

Without dummy node:
- Need special handling when head changes
- More conditionals and edge case logic
- Harder to reason about code

With dummy node:
- Treat head like any other node
- Consistent logic throughout
- Fewer edge cases

---

## Core Concept

```java
// Create dummy node pointing to head
ListNode dummy = new ListNode(0);
dummy.next = head;

// Work with nodes starting from dummy
ListNode current = dummy;

// At the end, return the new head
return dummy.next;
```

---

## When to Use

**Signals:**
- Building new LinkedList
- Merging LinkedLists
- Modifying head of LinkedList
- Removing nodes (including possibly the head)
- Inserting nodes in sorted LinkedList

**Keywords in problem:**
- "Merge"
- "Remove elements"
- "Insert in sorted order"
- "Build new list"

---

## Pattern Template

```java
public ListNode operation(ListNode head) {
    // Step 1: Create dummy node
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    // Step 2: Work with nodes
    ListNode current = dummy;
    while (condition) {
        // Modify current.next as needed
        // Move current pointer
    }

    // Step 3: Return new head
    return dummy.next;
}
```

---

## Example: Merge Two Sorted Lists

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;

    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }

    // Attach remaining nodes
    current.next = (l1 != null) ? l1 : l2;

    return dummy.next; // Return new head
}
```

---

## Why It Works

1. **Dummy is always there**: Even if list becomes empty, dummy still exists
2. **Consistent operations**: No special case for first node
3. **Easy return**: `dummy.next` is always the correct head

---

## Visual Example

```
Without dummy (special case for head):
if (head == null) {
    head = newNode;
} else {
    // different logic for other nodes
}

With dummy (consistent logic):
dummy → [head] → [node1] → [node2]
  ↑
current

dummy → [newNode] → [head] → [node1] → [node2]
         ↑
    dummy.next becomes new head
```

---

## Common Mistakes

- **Forgetting to return dummy.next**: Returning dummy instead of dummy.next
- **Not initializing dummy.next**: Should point to head if starting from existing list
- **Modifying dummy**: Should only modify dummy.next, never dummy itself

---

## Problems Using This Technique

- Merge Two Sorted Lists
- Remove LinkedList Elements
- Partition List
- Insertion Sort List

---

## Related Concepts

- [Linked List](../data-structures/linked-list/overview.md) - Core data structure
- Pointer manipulation - Essential LinkedList skill
