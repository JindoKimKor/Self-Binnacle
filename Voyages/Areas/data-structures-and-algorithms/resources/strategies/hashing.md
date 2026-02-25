# Hashing

## When to Use This Pattern

**Signals:**
- Need O(1) lookup time
- "Find pair that sums to target"
- "Check if duplicate exists"
- "Count frequency of elements"
- Need to store and retrieve elements quickly

**Counter-signals:**
- Need to maintain sorted order
- Memory is severely constrained
- Need to process elements in specific order

---

## Core Mechanism

Use hash table (HashMap/HashSet) for constant-time lookup:
1. **Complement lookup**: Store seen elements, check if complement exists
2. **Existence check**: Use HashSet to detect duplicates
3. **Frequency count**: Use HashMap to count occurrences

---

## Template Code

### Variation 1: Complement Lookup (Two Sum)

```java
Map<Integer, Integer> map = new HashMap<>();

for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];

    if (map.containsKey(complement)) {
        // Found the pair
        return new int[] {map.get(complement), i};
    }

    map.put(nums[i], i);
}
```

### Variation 2: Existence Check (Contains Duplicate)

```java
Set<Integer> seen = new HashSet<>();

for (int num : nums) {
    if (seen.contains(num)) {
        return true; // Duplicate found
    }
    seen.add(num);
}

return false;
```

### Variation 3: Frequency Count

```java
Map<Character, Integer> freq = new HashMap<>();

for (char c : s.toCharArray()) {
    freq.put(c, freq.getOrDefault(c, 0) + 1);
}
```

---

## Variations

| Variation | When to Use | Key Difference |
|-----------|-------------|----------------|
| Complement lookup | Finding pairs, "target sum" problems | Store value→index mapping |
| Existence check | Duplicate detection | Use HashSet for presence only |
| Frequency count | Anagram, character counting | Store value→count mapping |

---

## Problems Using This Pattern

| Problem | Data Structure | Technique | Difficulty |
|---------|---------------|-----------|------------|
| [Two Sum](../data-structures/hash-table/lookup/two-sum.md) | HashMap | Complement lookup | Easy |
| [Contains Duplicate](../data-structures/hash-table/lookup/contains-duplicate.md) | HashSet | Existence check | Easy |
| [Valid Anagram](../data-structures/array/frequency-count/valid-anagram.md) | HashMap/Array | Frequency count | Easy |

---

## Common Mistakes

- Not checking `containsKey()` before `get()`
- Using HashMap when HashSet is sufficient
- Forgetting to handle edge cases (null, empty array)
- Adding element to map before checking for complement

---

## Related Patterns

- Array manipulation - Hashing often replaces nested loops
- Sorting - Trade-off between time (hashing O(n)) vs space (sorting O(1))
