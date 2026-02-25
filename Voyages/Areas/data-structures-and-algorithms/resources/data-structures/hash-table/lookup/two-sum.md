# Two Sum

## 1. Time Complexity

**Definition:** How much does the number of operations increase as input size (n) grows?

**Simple question:** "How many loops?"

| Notation | Name | Description |
|----------|------|-------------|
| O(1) | Constant | Same regardless of input size |
| O(n) | Linear | 1 loop |
| O(n²) | Quadratic | Nested loop |
| O(log n) | Logarithmic | Binary search |

---

## 2. Space Complexity

**Definition:** How much additional memory is needed as input size (n) grows?

| Notation | Description |
|----------|-------------|
| O(1) | Constant space (few variables) |
| O(n) | Linear space (HashMap, array size) |
| O(n²) | Quadratic space (2D array) |

---

## 3. Trade-off

- Reduce time → Use more memory
- Save memory → Takes more time
- **Usually time is more important** (memory is relatively cheap)

---

## 4. HashMap Data Structure

**Structure:** Key-Value pairs

**Internal:** Hash function calculates position → direct access

**Characteristics:**
- Find Value by Key: O(1)
- Keys are unique (duplicates overwrite)
- Use when "fast lookup" is needed

**Java Syntax:**
```java
// Create
Map<Integer, Integer> map = new HashMap<>();

// Store
map.put(key, value);

// Retrieve
map.get(key);

// Check existence
map.containsKey(key);
```

---

## 5. Algorithm: Hash Table Lookup

**Pattern Name:** Hash Table Lookup / Complement Pattern

**Core Idea:**
- "current value + needed value = target"
- Quickly find the needed value (complement) from previously seen values

**How it works:**
1. Calculate complement: `target - nums[i]`
2. Find complement in HashMap (O(1))
3. If found → return, if not → store current value
4. Move to next value

---

## 6. Two Sum Solutions

### Brute Force (Inefficient)
- Check all combinations
- Time: O(n²)
- Space: O(1)
- 2 loops

### Hash Table (Optimized)
- Store previous values in HashMap
- Time: O(n)
- Space: O(n)
- 1 loop

---

## 7. Approach Order

1. **Understand problem:** Find indices of two values
2. **Think Brute Force:** Check all combinations (O(n²))
3. **Consider optimization:** "How to reduce loops?"
4. **Choose data structure:** Need fast lookup → HashMap
5. **Implement:** Apply complement pattern

---

## 8. Edge Cases

- Array size 2 (minimum)
- Two same values: `[3, 3]`, target = 6
- Answer at end of array

---

## 9. Java Array Basics

- **Fixed size:** Cannot change after creation
- **Dynamic size needed:** Use ArrayList
- **Heap memory:** All arrays are created on heap
- **Practical approach:** Create when needed, return immediately

```java
return new int[]{map.get(complement), i};
```

---

## 10. Coding Test Perspective

- **Essence:** Testing "which data structure is faster?"
- **Real-world connection:** Won't use Two Sum directly, pattern recognition is key
- **Mindset:** Key to open the door, real skills shown in interview
