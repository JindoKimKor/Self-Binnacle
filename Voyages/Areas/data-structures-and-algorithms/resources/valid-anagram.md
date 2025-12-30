# Valid Anagram (LC 242)

## Problem

Check if two strings are anagrams (have same characters with same counts)

**Input/Output:**
```
Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false
```

---

## Pattern Recognition

- **Keyword:** "count occurrences"
- Count how many times each character appears
- → HashMap (character frequency)

**Data Structure:** HashMap
**Algorithm:** Frequency Counting

---

## Core Idea

1. Traverse s: increment each character count (store in map)
2. Traverse t: decrement each character count (same map)
3. If all values are 0 → anagram

**Why it works:**
- Same characters, same counts → increment/decrement = 0
- Different characters or counts → non-zero values remain

---

## Solution

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        // Edge case: different lengths = false
        if (s.length() != t.length()) return false;

        // HashMap: character → count
        Map<Character, Integer> map = new HashMap<>();

        // Traverse s: increment count
        for (char c : s.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }

        // Traverse t: decrement count
        for (char c : t.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) - 1);
        }

        // Check all values are 0
        for (int count : map.values()) {
            if (count != 0) return false;
        }

        return true;
    }
}
```

---

## Complexity

- **Time:** O(n) - traverse s + traverse t + check map
- **Space:** O(k) - k = unique characters (max 26 for alphabet)

---

## Key Learnings

### 1. Frequency Counting Pattern
```java
Map<Character, Integer> freq = new HashMap<>();
freq.put(c, freq.getOrDefault(c, 0) + 1);
```

### 2. getOrDefault()
```java
map.getOrDefault(key, defaultValue)
// key exists: return that value
// key doesn't exist: return defaultValue
```

### 3. HashMap Applications
| Problem | Usage |
|---------|-------|
| Two Sum | value → index |
| Contains Duplicate | HashSet (values only) |
| Valid Anagram | character → count |

### 4. Increment/Decrement Trick
- Same HashMap for increment/decrement
- Check if final values are 0

### 5. String Methods
```java
s.length()           // length (method)
s.toCharArray()      // convert to char[]
```

---

## Alternative: Array Approach

For alphabet-only strings:

```java
int[] count = new int[26];

// Traverse s
for (char c : s.toCharArray()) {
    count[c - 'a']++;  // character → 0~25 index
}

// Traverse t
for (char c : t.toCharArray()) {
    count[c - 'a']--;
}

// Check
for (int n : count) {
    if (n != 0) return false;
}
return true;
```

**Comparison:**
| Approach | Pros |
|----------|------|
| HashMap | Universal, any characters |
| Array | Alphabet only, slightly faster |

---

## Common Mistakes

```java
s.length   // ✗ Wrong
s.length() // ✓ Correct (it's a method)
```

- Null check (usually problem states no null)
- **Edge case:** Check length first

---

## Real-world Applications

| Use Case | Description |
|----------|-------------|
| Text analysis | Character frequency |
| Duplicate document detection | Compare documents |
| Word games | Scrabble, etc. |
| Data integrity check | Verify data consistency |
