# Array

## What is it?

A contiguous block of memory that stores elements of the same type, accessible by index in O(1) time.

---

## Core Concepts

### Structure
- Elements stored sequentially in memory
- Fixed size (in most languages)
- Zero-based indexing: first element at index 0

### Access
```java
int[] arr = new int[5];  // Create array of size 5
arr[0] = 10;             // Set first element
int value = arr[2];      // Get element at index 2
```

---

## Time Complexity

| Operation | Time |
|-----------|------|
| Access by index | O(1) |
| Search (unsorted) | O(n) |
| Search (sorted) | O(log n) with binary search |
| Insert at end | O(1) if space available |
| Insert at middle | O(n) - need to shift elements |
| Delete | O(n) - need to shift elements |

---

## Space Complexity

O(n) - where n is the number of elements

---

## When to Use

**Use Array when:**
- Need random access by index
- Mostly reading data
- Size is known or doesn't change much
- Want cache-friendly memory layout

**Avoid Array when:**
- Frequent insertions/deletions in middle
- Size changes dramatically
- Need dynamic resizing often

---

## Common Patterns with Arrays

1. **Two Pointers**: Process from both ends or track ranges
2. **Sliding Window**: Maintain a window of elements
3. **Binary Search**: On sorted arrays for O(log n) search
4. **Frequency Count**: Use array as counter for limited range
5. **In-place modification**: Swap or reverse without extra space

---

## Java Syntax

```java
// Declaration
int[] arr = new int[5];              // Size 5, default values (0)
int[] arr = {1, 2, 3, 4, 5};        // Initialize with values
int[] arr = new int[] {1, 2, 3};    // Explicit initialization

// Access
int value = arr[0];                  // Get element
arr[0] = 10;                        // Set element

// Properties
int length = arr.length;            // Array length (not a method!)

// Iteration
for (int i = 0; i < arr.length; i++) {
    // Use arr[i]
}

for (int num : arr) {
    // Use num
}
```

---

## Array vs ArrayList (Java)

| Aspect | Array | ArrayList |
|--------|-------|-----------|
| Size | Fixed | Dynamic |
| Type | Primitive or Object | Objects only |
| Syntax | `arr[i]` | `list.get(i)` |
| Performance | Slightly faster | Minimal overhead |

---

## Common Mistakes

- **Off-by-one errors**: Using `i <= arr.length` instead of `i < arr.length`
- **Index out of bounds**: Accessing index < 0 or >= length
- **Null arrays**: Not checking if array is null before access
- **Modifying during iteration**: Can cause unexpected behavior

---

## Visual Example

```
Index:  0   1   2   3   4
Value: [1] [3] [5] [7] [9]
        ↑               ↑
      arr[0]        arr[4]
```

---

## Trade-offs

**Pros:**
- O(1) random access
- Cache-friendly (contiguous memory)
- Simple and fast
- Low overhead

**Cons:**
- Fixed size (can't grow/shrink easily)
- O(n) insertion/deletion in middle
- Wasted space if not fully used

---

## Related Concepts

- [Linked List](linked-list.md) - Dynamic alternative
- ArrayList/Vector - Dynamic array implementations
- [Hash Table](hash-table.md) - For O(1) lookup by key instead of index
