# Swap Pattern

## What is it?

A technique for exchanging the values or positions of two elements, commonly used in array manipulation and sorting algorithms.

---

## Core Concept

To swap two elements, you need a temporary variable to hold one value while you reassign:

```java
// Swap arr[i] and arr[j]
int temp = arr[i];
arr[i] = arr[j];
arr[j] = temp;
```

---

## When to Use

**Signals:**
- "Reverse" array or string
- "Rotate" elements
- Sorting algorithms
- Moving elements to different positions
- Partitioning array

**Keywords:**
- "Reverse"
- "Swap"
- "Rearrange"
- "In-place"

---

## Variations

### 1. Array Element Swap

```java
void swap(int[] arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

### 2. Two Pointers Swap (for reversal)

```java
void reverse(int[] arr) {
    int left = 0;
    int right = arr.length - 1;

    while (left < right) {
        // Swap elements at left and right
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        left++;
        right--;
    }
}
```

### 3. Character Array Swap (for strings)

```java
void swap(char[] chars, int i, int j) {
    char temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
}
```

---

## Why Temp Variable is Needed

Without temp variable:
```java
arr[i] = arr[j];  // arr[i] is now arr[j]
arr[j] = arr[i];  // arr[j] is still arr[j] (original arr[i] is lost!)
```

With temp variable:
```java
temp = arr[i];    // Save arr[i]
arr[i] = arr[j];  // Overwrite arr[i]
arr[j] = temp;    // Use saved value
```

---

## XOR Swap (No Temp Variable)

For integers only, using bitwise XOR:

```java
arr[i] = arr[i] ^ arr[j];
arr[j] = arr[i] ^ arr[j];  // Now arr[j] = original arr[i]
arr[i] = arr[i] ^ arr[j];  // Now arr[i] = original arr[j]
```

**Note**: Clever but less readable. Use temp variable in interviews for clarity.

---

## Visual Example

```
Before swap:
Index: 0   1   2   3   4
Value: [1] [2] [3] [4] [5]
        ↑           ↑
     swap i=0 and j=3

After swap:
Index: 0   1   2   3   4
Value: [4] [2] [3] [1] [5]
```

---

## Common Patterns

1. **Reverse array**: Swap from both ends moving toward center
2. **Partition**: Swap elements to group by condition
3. **Sort**: Bubble sort, selection sort use swaps
4. **Rotate**: Series of swaps to rotate array

---

## Common Mistakes

- **Forgetting temp variable**: Loses original value
- **Swapping same index**: `swap(i, i)` when `left == right`
- **Index out of bounds**: Not checking valid indices

---

## Problems Using This Pattern

- Reverse String
- Reverse Array
- Rotate Array
- Partition Array
- Two Sum (not swapping but similar pointer technique)

---

## Related Concepts

- [Two Pointers](two-pointers.md) - Often combined with swap
- [Array](../data-structures/array/overview.md) - Primary data structure for swaps
- In-place algorithms - Swap enables O(1) space solutions
