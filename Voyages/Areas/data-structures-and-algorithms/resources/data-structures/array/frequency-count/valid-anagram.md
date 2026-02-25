# Valid Anagram (LC 242)

## Interview Approach

### 1. Input/Output

```
Input: s = "anagram", t = "nagaram"
Output: true
Explanation: 't' is an anagram of 's' (same letters, rearranged)

Input: s = "rat", t = "car"
Output: false
Explanation: Different letters
```

### 2. Keywords & Constraints

**Keywords:**
- "anagram"
- "same characters"
- "count occurrences"

**Constraints:**
- Strings contain only lowercase English letters
- Need to check if same characters with same frequencies
- Order doesn't matter

### 3. Pattern + Why

**Pattern:** Hashing (Frequency Count)

**Why this pattern:**
An anagram means same characters with same counts, just rearranged. By counting frequency of each character in both strings and comparing, we can determine if they're anagrams. HashMap provides O(1) lookup for counting.

**Data Structure:** HashMap (or int array for alphabet-only)

### 4. Approach

**Core Idea:**
Count character frequencies in first string (increment), then subtract frequencies using second string (decrement). If all counts end at zero, they're anagrams.

**How it works:**
1. Check lengths - if different, not anagrams
2. Create HashMap for character → count
3. Traverse string `s`: increment count for each character
4. Traverse string `t`: decrement count for each character
5. Check if all counts are 0
6. Return true if all zero, false otherwise

**Example Walkthrough:**

```
s = "anagram", t = "nagaram"

After counting s:
{'a': 3, 'n': 1, 'g': 1, 'r': 1, 'm': 1}

After decrementing with t:
{'a': 3-3=0, 'n': 1-1=0, 'g': 1-1=0, 'r': 1-1=0, 'm': 1-1=0}

All zeros → true (anagram)

---

s = "rat", t = "car"

After counting s:
{'r': 1, 'a': 1, 't': 1}

After decrementing with t:
{'r': 1-1=0, 'a': 1-1=0, 't': 1, 'c': 0-1=-1}

Has non-zero values → false (not anagram)
```

### 5. Code

```java
// "I'll go ahead and write the code."
class Solution {
    public boolean isAnagram(String s, String t) {
        // Different lengths = not anagram
        if (s.length() != t.length()) return false;

        // Character frequency map
        Map<Character, Integer> map = new HashMap<>();

        // Count characters in s (increment)
        for (char c : s.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }

        // Subtract characters in t (decrement)
        for (char c : t.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) - 1);
        }

        // Check if all counts are zero
        for (int count : map.values()) {
            if (count != 0) return false;
        }

        return true;
    }
}
```

---

## Deep Dive

### Complexity Analysis

**Time:** O(n)
- O(n) to traverse s
- O(n) to traverse t
- O(k) to check map values (k = unique characters, max 26 for alphabet)
- Total: O(n + n + k) = O(n)

**Space:** O(k)
- HashMap stores at most k unique characters
- For lowercase English letters, k ≤ 26 (constant)
- Effectively O(1) for alphabet-only

### Common Mistakes

1. **String length syntax**
   ```java
   s.length   // ✗ Not a field
   s.length() // ✓ String length is a method
   ```

2. **Not checking lengths first**
   ```java
   // If lengths differ, immediately return false
   // Saves unnecessary processing
   if (s.length() != t.length()) return false;
   ```

3. **Forgetting getOrDefault**
   ```java
   map.put(c, map.get(c) + 1);           // ✗ NullPointerException if key missing
   map.put(c, map.getOrDefault(c, 0) + 1); // ✓ Returns 0 if key missing
   ```

4. **Creating separate maps**
   ```java
   // Can use same map for increment and decrement
   // More efficient than creating two maps
   ```

### Key Insights

- **Increment/Decrement trick**: Same map for both operations eliminates need for explicit comparison

- **Early termination**: Length check can immediately return false, avoiding unnecessary processing

- **getOrDefault pattern**: Essential for frequency counting when key might not exist yet

- **Space optimization**: For limited character sets (like alphabet), array is more space-efficient than HashMap

### Alternative Approaches

**Approach 1: HashMap (Current)**
- Time: O(n), Space: O(k)
- ✓ Works for any characters (Unicode, symbols, etc.)
- ✓ Clean and readable

**Approach 2: Array (Alphabet-only)**
```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;

    int[] count = new int[26];

    for (char c : s.toCharArray()) {
        count[c - 'a']++;  // Map 'a'-'z' to 0-25
    }

    for (char c : t.toCharArray()) {
        count[c - 'a']--;
    }

    for (int n : count) {
        if (n != 0) return false;
    }

    return true;
}
```
- Time: O(n), Space: O(1) - fixed size 26
- ✓ Slightly faster (array access vs HashMap)
- ✗ Only works for lowercase English letters

**Approach 3: Sorting**
```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;

    char[] sArr = s.toCharArray();
    char[] tArr = t.toCharArray();

    Arrays.sort(sArr);
    Arrays.sort(tArr);

    return Arrays.equals(sArr, tArr);
}
```
- Time: O(n log n), Space: O(1) if not counting sort space
- ✗ Slower than O(n) approaches
- ✓ Very simple and intuitive

---

## Extended Learning

### Visualization

```
s = "anagram"    t = "nagaram"

Frequency count:
a: |||  →  |||    (3 → 3-3 = 0)
n: |    →  |      (1 → 1-1 = 0)
g: |    →  |      (1 → 1-1 = 0)
r: |    →  |      (1 → 1-1 = 0)
m: |    →  |      (1 → 1-1 = 0)

All balanced → Anagram ✓

---

s = "rat"        t = "car"

Frequency count:
r: |    →  |      (1 → 1-1 = 0)
a: |    →  |      (1 → 1-1 = 0)
t: |    →  |      (1 → 1-0 = 1) ✗
c: -    →  |      (0 → 0-1 = -1) ✗

Unbalanced → Not anagram ✗
```

### Real-World Applications

| Use Case | Description |
|----------|-------------|
| Word games | Scrabble, anagram puzzles |
| Plagiarism detection | Compare document character distributions |
| Data deduplication | Identify similar text content |
| Spell checkers | Suggest anagram alternatives |

### Related Problems

- [Two Sum](../../hash-table/lookup/two-sum.md) - HashMap for O(1) lookup
- [Contains Duplicate](../../hash-table/lookup/contains-duplicate.md) - HashSet for existence check
- Group Anagrams - Extension using sorted strings as keys

### Pattern Generalization

**When to recognize Frequency Count pattern:**
- Need to count occurrences of elements
- "Same characters/elements with same counts"
- Can use HashMap (char/element → count)
- Keywords: "anagram", "frequency", "count", "distribution"

**Signals this pattern fits:**
- Comparing collections by element frequency
- Order doesn't matter
- Need O(1) lookup for counts
- Limited or unlimited element types

---

## References

- Strategy: [Hashing](../../../strategies/hashing.md)
- Concept: [Hash Table](../../hash-table/overview.md)
