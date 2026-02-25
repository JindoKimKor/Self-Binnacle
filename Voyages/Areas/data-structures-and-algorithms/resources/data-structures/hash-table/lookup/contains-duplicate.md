# Contains Duplicate

## 1. Pattern Recognition

**Keywords:** "duplicate", "same value", "repeating"

**Requirements:** Return true if duplicate exists, false otherwise

**Key Insight:**
- No index needed (different from Two Sum)
- Only need to check "have I seen this value before?"
- Only existence matters

---

## 2. HashSet Data Structure

**Concept:** Collection of unique values (Set)

**Structure:** Value only (not Key-Value)

**Characteristics:**
- Check existence: O(1)
- Automatically removes duplicates (adding same value is ignored)
- No order guarantee

**Internal:** Uses Hash function similar to HashMap

**Java Syntax:**
```java
// Create
Set<Integer> set = new HashSet<>();

// Add
set.add(value);

// Check existence
set.contains(value);  // returns true/false

// Remove
set.remove(value);

// Size
set.size();

// Empty check
set.isEmpty();
```

---

## 3. HashMap vs HashSet

| Aspect | HashMap | HashSet |
|--------|---------|---------|
| Structure | Key → Value | Value only |
| Purpose | "What's the value of this key?" | "Does this value exist?" |
| Example | `{1 → "apple", 2 → "banana"}` | `{1, 2, 3, 4}` |
| Analogy | Phone book (name → number) | Attendance sheet (names only) |

**This problem:** Only need values → **HashSet**

---

## 4. Algorithm: Duplicate Detection

**Pattern Name:** Hash-based Duplicate Detection

**Core Idea:**
- Store seen values in Set
- Check if new value exists in Set
- If exists → duplicate → immediately true

**How it works:**
1. Iterate through each number
2. Check if in Set
3. If yes → duplicate found → `return true`
4. If no → add to Set
5. No duplicate until end → `return false`

---

## 5. Solution Strategies

### Brute Force (Inefficient)
- Compare all pairs
- Time: O(n²)
- Space: O(1)
- 2 loops

### Sorting (Medium)
- Sort, then compare adjacent
- Time: O(n log n)
- Space: O(1) or O(n)
- Modifies original array

### HashSet (Optimal)
- Check existence with Set
- Time: O(n)
- Space: O(n)
- 1 loop

---

## 6. Approach Order

1. **Understand problem:** Is there a duplicate?
2. **Required info:** No index needed, only existence
3. **Choose data structure:** Fast existence check → HashSet
4. **Implement:** Iterate → check → add

---

## 7. Edge Cases

| Case | Input | Output | Note |
|------|-------|--------|------|
| Empty array | `[]` | false | - |
| Size 1 | `[1]` | false | Nothing to compare |
| All duplicates | `[1,1,1,1]` | true | Found on first check |
| Duplicate at end | `[1,2,3,4,1]` | true | Found at last element |
| No duplicates | `[1,2,3,4]` | false | Iterate to end |

---

## 8. Java Syntax Points

```java
// Enhanced for loop
for (int num : nums)

// Early termination
return true;  // when duplicate found

// Interface type declaration (preferred over HashSet)
Set<Integer> set = new HashSet<>();
```

---

## 9. Set vs List vs Array

| Aspect | Array | List (ArrayList) | Set (HashSet) |
|--------|-------|------------------|---------------|
| Size | Fixed | Dynamic | Dynamic |
| Index access | O(1) | O(1) | N/A |
| Search | O(n) | O(n) | O(1) |
| Add | N/A | O(1) amortized | O(1) |
| Duplicates | Allowed | Allowed | **Not allowed** |

---

## 10. Coding Test Perspective

**Essence:** "How to quickly check for duplicates?"

**Pattern Comparison:**
| Problem | Need | Data Structure |
|---------|------|----------------|
| Two Sum | Key-Value | HashMap |
| Contains Duplicate | Existence only | HashSet |
| Valid Parentheses | Order matters | Stack |

**Generalization:** "Have I seen this before?" → Hash-based structure

---

## 11. Real-world Applications

| Use Case | Description |
|----------|-------------|
| Extract unique values | Remove duplicates from array |
| Membership check | Is user in this group? |
| Cache key management | Already processed request? |
| Data integrity | Detect duplicate data |
| Permission check | Is this action allowed? |

---

## 12. HashSet Internal

HashSet actually uses HashMap internally:

```java
// HashSet internal structure (simplified)
private HashMap<E, Object> map;
private static final Object PRESENT = new Object();

public boolean add(E e) {
    return map.put(e, PRESENT) == null;
}
```

- Dummy object in Value slot
- Only Key is actually used
- Leverages HashMap's Key characteristics
