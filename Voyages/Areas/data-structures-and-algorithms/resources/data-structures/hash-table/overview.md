# Hash Table (HashMap / HashSet)

## What is it?

A data structure that stores key-value pairs and provides O(1) average-case lookup, insertion, and deletion.

---

## Core Concepts

### Structure
- **HashMap**: Stores key-value pairs
- **HashSet**: Stores unique values only (keys without values)

### Internal Mechanism
- Uses hash function to compute index from key
- Stores data at computed index for direct access
- Handles collisions (multiple keys mapping to same index)

---

## Time Complexity

| Operation | Average Case | Worst Case |
|-----------|-------------|------------|
| Lookup | O(1) | O(n) |
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |

---

## Space Complexity

O(n) - where n is number of elements stored

---

## When to Use

**Use HashMap when:**
- Need fast lookup by key
- Storing key-value relationships
- Counting frequency of elements

**Use HashSet when:**
- Only care about existence, not values
- Need to check for duplicates
- Set operations (union, intersection)

---

## Java Syntax

### HashMap

```java
// Create
Map<Integer, Integer> map = new HashMap<>();

// Insert/Update
map.put(key, value);

// Retrieve
int value = map.get(key);

// Check existence
if (map.containsKey(key)) { }

// Get with default
int value = map.getOrDefault(key, 0);

// Remove
map.remove(key);

// Size
int size = map.size();

// Iterate
for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
    int key = entry.getKey();
    int value = entry.getValue();
}
```

### HashSet

```java
// Create
Set<Integer> set = new HashSet<>();

// Add
set.add(value);

// Check existence
if (set.contains(value)) { }

// Remove
set.remove(value);

// Size
int size = set.size();
```

---

## Common Patterns

1. **Complement lookup**: Store seen values, check if complement exists
2. **Existence check**: Detect duplicates
3. **Frequency count**: Count occurrences of each element

---

## Trade-offs

**Pros:**
- Very fast O(1) lookup
- Flexible key types
- Easy to use

**Cons:**
- No ordering of elements
- Extra space overhead O(n)
- Worst case O(n) if many collisions

---

## Related Concepts

- [Array](array.md) - Trade O(1) space for O(n) lookup
- Sorting - Alternative to hashing for some problems
