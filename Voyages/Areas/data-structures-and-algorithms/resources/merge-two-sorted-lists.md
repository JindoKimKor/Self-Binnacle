# Merge Two Sorted Lists

## 1. Pattern Recognition

**Keywords:** "merge", "sorted", "two lists"

**Data Structure:** LinkedList (ListNode)

**Key Insight:**
- Already sorted
- Compare and connect starting from smallest
- Two Pointers to traverse each list

---

## 2. LinkedList Core Concept

**Structure:** Each node points to next node

**ListNode = Pointer (reference)**
- Not the node itself, but a reference
- Having first node gives access to entire list
- Connected, that's why it's a "list"

```
head → [1|next] → [2|next] → [3|null]
```

---

## 3. ListNode Structure

```java
public class ListNode {
    int val;           // value
    ListNode next;     // reference to next node
}
```

---

## 4. Dummy Node Pattern

**Purpose:** Simplify code

**Problem:** Determining first node is complex
- list1 might be smaller, or list2 might be
- Needs special handling

**Solution:** Create fake starting point

```java
ListNode dummy = new ListNode(0);  // fake start
ListNode pointer = dummy;

// Process all nodes the same way

return dummy.next;  // real first node
```

**Why return dummy.next?**
- dummy: start point (fixed)
- pointer: end position (moves)
- First node is dummy.next

---

## 5. Algorithm: Two-Pointer Merge

**Pattern Name:** Two-Pointer Merge / Merge Sort (partial)

**Core Idea:**
- Traverse both lists simultaneously
- Select smaller value and connect
- Move selected list's pointer

**How it works:**
1. Start with pointers to both lists
2. Compare values, select smaller
3. Move selected list's pointer
4. Move connection pointer too
5. When one ends, attach entire remainder

---

## 6. Complete Code

```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode pointer = dummy;

        // While both have nodes
        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                pointer.next = list1;
                list1 = list1.next;
            } else {
                pointer.next = list2;
                list2 = list2.next;
            }
            pointer = pointer.next;
        }

        // Handle remainder
        if (list1 != null) {
            pointer.next = list1;
        }
        if (list2 != null) {
            pointer.next = list2;
        }

        return dummy.next;
    }
}
```

---

## 7. Common Mistakes

### 1. Forgetting remainder handling
```java
// After while ends
if (list1 != null) {
    pointer.next = list1;  // Required!
}
if (list2 != null) {
    pointer.next = list2;  // Required!
}
```
- while ends when one is null
- Must attach remaining side
- LinkedList: connecting first node gets the rest

### 2. Understanding while termination
```java
while (list1 != null && list2 != null)
```
- Only when both are non-null
- Ends when either is null
- Not infinite loop (pointers keep moving)

### 3. pointer vs dummy
- dummy: fixed starting point
- pointer: keeps moving, final position
- Return dummy.next (first real node)

---

## 8. Complexity

**Time:** O(n + m)
- n = list1 length
- m = list2 length
- Each node visited once

**Space:** O(1)
- No new nodes created
- Reuse existing nodes
- Only 1 dummy node (constant)
- Just changing pointers

---

## 9. Visualization

```
Initial:
list1: 1 → 3 → 5
list2: 2 → 4
dummy: 0
pointer: dummy

Step 1: 1 < 2
dummy → 1
        ↑
     pointer
list1: 3 → 5
list2: 2 → 4

Step 2: 2 < 3
dummy → 1 → 2
             ↑
          pointer
list1: 3 → 5
list2: 4

Step 3: 3 < 4
dummy → 1 → 2 → 3
                 ↑
              pointer
list1: 5
list2: 4

Step 4: 4 < 5
dummy → 1 → 2 → 3 → 4
                     ↑
                  pointer
list1: 5
list2: null (terminates)

Handle remainder:
pointer.next = list1
dummy → 1 → 2 → 3 → 4 → 5

return dummy.next → 1 → 2 → 3 → 4 → 5
```

---

## 10. Edge Cases

| Case | Result |
|------|--------|
| Both null | Return null |
| One null | Return the other as-is |
| Same values | else selects list2 (order doesn't matter) |
| Different lengths | When shorter ends, attach entire longer |

---

## 11. Java Syntax Points

```java
// Move ListNode
list1 = list1.next;  // to next node

// Connect
pointer.next = list1;  // connect list1 node

// Null check
if (list1 != null)

// While condition
while (list1 != null && list2 != null)  // AND
```

---

## 12. Real-world Applications

| Use Case | Description |
|----------|-------------|
| Merge sorted data | Log files, time series |
| Merge Sort implementation | Divide and conquer |
| Priority Queue | Merge multiple streams |
| Database | Sorted merge join |
| File processing | Combine sorted files |

---

## 13. Why Common in Interviews

- **LinkedList basics:** Pointer manipulation
- **Two Pointers pattern:** Various applications
- **Maintain sorting:** Merge sort concept
- **In-place manipulation:** Space efficiency
- **Many edge cases:** Tests thoroughness

---

## 14. Generalized Pattern

**"Merge Two Sorted" pattern:**
- Combine two sorted structures
- Select from smallest value
- Move pointers
- O(n + m) time

**Similar problems:**
- Merge Sorted Array
- Merge K Sorted Lists
- Intersection of Two Arrays

---

## 15. Array vs LinkedList Review

| Aspect | Array | LinkedList |
|--------|-------|------------|
| Index access | O(1) | O(n) (traversal needed) |
| Mid insert/delete | O(n) (shift needed) | O(1) (just pointers) |
| Memory | Contiguous | Distributed |
| Size | Fixed | Dynamic |
| Overhead | None | Pointer overhead |

---

## 16. Key Concepts Summary

### ListNode = Pointer
- Just a reference
- Connected to form list
- First node accesses entire list

### Dummy Node = Trick
- Simplifies code
- No special handling for first node
- Return dummy.next at end

### Two Pointers
- Traverse two structures simultaneously
- Compare and process
- LinkedList version
