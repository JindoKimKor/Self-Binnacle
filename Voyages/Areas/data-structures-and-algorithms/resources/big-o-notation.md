# Big O Notation

## What O Means

**O = Order**

- "Big O notation"
- Growth order relative to input size (n)
- Upper bound on worst-case performance

---

## Mathematical Background

```
f(n) = O(g(n))
```

"f(n) grows at the order of g(n)"

**Example:**
```
f(n) = 3n² + 5n + 2
Big O: O(n²)
```
- Keep only the largest order term
- Ignore constants (3, 5, 2)
- As n grows, n² dominates

---

## History

| Year | Person | Contribution |
|------|--------|--------------|
| 1894 | Paul Bachmann | German mathematician, used in number theory |
| 1976 | Donald Knuth | "The Art of Computer Programming", introduced to CS |

**Order Names:**
| Order | Notation | Name |
|-------|----------|------|
| 1st | O(n) | Linear |
| 2nd | O(n²) | Quadratic |
| 3rd | O(n³) | Cubic |
| log | O(log n) | Logarithmic |

---

## Big O Family

| Notation | Name | Meaning |
|----------|------|---------|
| O (Big O) | Upper bound | Worst case won't be worse than this |
| Ω (Big Omega) | Lower bound | Best case won't be better than this |
| Θ (Big Theta) | Tight bound | Average is exactly this |

**In practice, Big O is used almost exclusively** - worst case matters most

---

## Complexity Meanings

### O(1) - Constant
```
Input 10x → Time same
Input 100x → Time same
```
Independent of input size

### O(n) - Linear
```
Input 2x → Time 2x
Input 10x → Time 10x
```
Grows linearly

---

## Code Examples

```java
// O(1) - Constant
int x = arr[0];  // 1 operation regardless of n

// O(n) - Linear
for (int i = 0; i < n; i++)  // n iterations

// O(n²) - Quadratic
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)  // n × n iterations

// O(log n) - Logarithmic
while (n > 1) {
    n = n / 2;  // halves each time
}
```

---

## Why Ignore Constants?

```
Actual time: 3n² + 5n + 2

n = 10:    352
n = 1000:  3,005,002  ← n² dominates

When n is large: 3n² >> 5n >> 2
→ Only O(n²) matters
```

---

## Pronunciation

| Notation | Pronunciation | Academic |
|----------|---------------|----------|
| O(1) | "Oh one" | "Constant time" |
| O(n) | "Oh N" | "Linear time" |
| O(n²) | "Oh N squared" | "Quadratic time" |
| O(log n) | "Oh log N" | "Logarithmic time" |
| O(n log n) | "Oh N log N" | - |
| O(2^n) | "Oh two to the N" | "Exponential time" |

---

## Interview Examples

```
Interviewer: "What's the time complexity?"
You: "It's O N, we iterate through the array once."

Interviewer: "Can you optimize the space?"
You: "Yes, we can reduce it to O one by using two pointers."
```

---

## Practice Phrases

```
"The HashSet solution is O N time and O N space"
"Two pointers is O N time but O one space"
"This algorithm is linear, O N"
"The time complexity is O of N"
```
