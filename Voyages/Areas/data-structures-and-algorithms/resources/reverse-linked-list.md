# Reverse Linked List (LC 206) - Learning Review

## Problem

```
Input: 1 → 2 → 3 → 4 → 5 → null
Output: 5 → 4 → 3 → 2 → 1 → null
```

---

## My First Approach: Stack

**Initial idea:**
"Follow val until null, use stack to push, then pop one by one adding next"

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        Stack<Integer> stack = new Stack<>();
        ListNode curr = head;
        while(curr != null){
            stack.push(curr.val);
            curr = curr.next;
        }
        ListNode dummy = new ListNode(0);
        ListNode pointer = dummy;
        while(!stack.isEmpty()){
            pointer.next = new ListNode(stack.pop());
            pointer = pointer.next;
        }
        return dummy.next;
    }
}
```

**Result:** 2ms, works
**Complexity:** Time O(n), Space O(n)

---

## Three Pointer Method - Struggle Points

### Struggle 1: Variable Understanding
"I don't understand... surely prev and curr aren't built-in functions..."

### Struggle 2: ListNode Structure
"So ListNode has not just val + next pointer, but its own pointer exists?"

### Struggle 3: Variable Names Don't Explain Role
"The variable names prev, curr, next aren't clear about their roles"

---

## Solution: Rename Variables

| Convention | My Name | Role |
|------------|---------|------|
| prev | reversed | Reversed part (completed) |
| curr | working | Node currently working on |
| next | remaining | Not done yet (temp storage) |

**Why it mattered:**
- prev, curr, next only tell position
- reversed, working, remaining tell the role
- Clear roles → Understanding

---

## Solution: Draw a Table

**Why table helped:**
"Seeing all 3 nodes' properties at once, I could see the entire change per command at a glance"

| Step | reversed | working | remaining |
|------|----------|---------|-----------|
| Start | null | Node=1, Val=1, Next=2 | null |
| remaining = working.next | | | Node=2, Val=2, Next=3 |
| working.next = reversed | | Node=1, Val=1, Next=null | |
| reversed = working | Node=1, Val=1, Next=null | | |
| working = remaining | | Node=2, Val=2, Next=3 | |
| remaining = working.next | | | Node=3, Val=3, Next=null |
| working.next = reversed | | Node=2, Val=2, Next=1 | |
| reversed = working | Node=2, Val=2, Next=1 | | |
| working = remaining | | Node=3, Val=3, Next=null | |
| remaining = working.next | | | null |
| working.next = reversed | | Node=3, Val=3, Next=2 | |
| reversed = working | Node=3, Val=3, Next=2 | | |
| working = remaining | | null | |

---

## Mistakes (Time Limit Exceeded)

### Mistake 1: Infinite Loop
```java
while (head != null){
    reversed = head.next;
    reversed.next = head;
}
// head never changes → infinite loop
```

### Mistake 2: Circular Reference
```java
reversed = working.next;     // reversed = 2
reversed.next = working;     // 2.next = 1
working = working.next;      // working.next is what? 2, and 2.next = 1...
                             // 1 ↔ 2 circular!
```

### Fix: Order Matters
```java
remaining = working.next;    // 1. Save first!
working.next = reversed;     // 2. Then change connection
reversed = working;          // 3. Move reversed
working = remaining;         // 4. Move working
```

---

## Final Code

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode reversed = null;
        ListNode remaining = new ListNode();
        ListNode working = head;

        while(working != null){
            remaining = working.next;
            working.next = reversed;
            reversed = working;
            working = remaining;
        }

        return reversed;
    }
}
```

**Result:** 0ms, Beats 100%
**Complexity:** Time O(n), Space O(1)

---

## Concepts Learned

### 1. Singly Linked List
```java
public class ListNode {
    int val;          // value
    ListNode next;    // reference to next node
}
```
- Only val + next
- Same in all languages (Java, Python, C, C++, JavaScript)

### 2. Java Reference = Pointer
```java
ListNode reversed = working.next;  // New data created ❌
                                   // Pointer to same node ✓

ListNode newNode = new ListNode(working.val);  // New data created ✓ (new keyword!)
```
That's why O(1) space: No new data, just manipulating pointers

### 3. Read vs Write
```java
curr = curr.next;        // Only curr variable moves (read)
curr.next = someNode;    // Changes list connection (write)
```

### 4. LinkedList Types (mentioned)
- Singly Linked List (one-way) ← learned this time
- Doubly Linked List (two-way)
- Circular Linked List

---

## Comparison

| Aspect | Stack | 3 Pointers |
|--------|-------|------------|
| Time | O(n) | O(n) |
| Space | O(n) | O(1) |
| Traversal | 2 times | 1 time |
| Performance | 2ms | 0ms (100%) |

---

## One Sentence Summary

> "Reverse Linked List tests complex order of memory read/write operations"

---

## Key Lessons

1. **Variable names aid understanding:** prev/curr/next → reversed/working/remaining

2. **Draw tables:** When mental simulation fails, visualize

3. **Order matters:** Save next node first, then change connection

4. **Understand Java references:** New object creation vs pointing to same object
