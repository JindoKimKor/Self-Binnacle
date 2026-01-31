# C# Type Characteristics - Organized by Combination

---

## Generic - What are T, K, V?

`T`, `K`, `V` are **type parameters** that get replaced with actual types at usage time.

```csharp
List<int> intList = new List<int>();         // T = int
List<string> strList = new List<string>();   // T = string
Dictionary<string, int> dict;                // K = string, V = int
```

### Constraints

By default, any type is allowed, but you can add constraints.

| Done | Constraint | Meaning | Example |
|:---:|------------|---------|---------|
| ☐ | `where T : class` | Reference Type only | `string`, `class` OK / `int` NO |
| ☐ | `where T : struct` | Value Type only | `int`, `struct` OK / `string` NO |
| ☐ | `where T : new()` | Default constructor required | Must be able to call `new T()` |
| ☐ | `where T : interface` | Must implement interface | `where T : IComparable` |
| ☐ | `where T : class` | Must inherit from class | `where T : MyBaseClass` |
| ☐ | `where T : notnull` | Cannot be null | .NET 6+ |

```csharp
// No constraints
class Box<T> { }

// Reference Type only
class Box<T> where T : class { }

// Multiple constraints
class Box<T> where T : class, IComparable, new() { }
```

### C# Built-in Collection Constraints

| Done | Type | Constraint |
|:---:|------|------------|
| ☐ | `List<T>` | None |
| ☐ | `Dictionary<K,V>` | None (K internally uses `GetHashCode`) |
| ☐ | `HashSet<T>` | None (internally uses `GetHashCode`) |
| ☐ | `SortedSet<T>` | `T` must be `IComparable` or provide `Comparer` |
| ☐ | `SortedDictionary<K,V>` | `K` must be `IComparable` or provide `Comparer` |
| ☐ | `SortedList<K,V>` | `K` must be `IComparable` or provide `Comparer` |
| ☐ | `PriorityQueue<T,P>` | `P` must be `IComparable` or provide `Comparer` |

---

## Combination 1: Value + N/A + Fixed

**Why this combination?**
- Value stored directly on stack
- Single value, so Mutable/Immutable distinction is meaningless (just overwrite)
- Size fixed at compile time

| Done | Type | Alias | Size | Range/Notes |
|:---:|------|-------|------|-------------|
| ☐ | `System.Byte` | `byte` | 8-bit | 0 ~ 255 |
| ☐ | `System.Int16` | `short` | 16-bit | -32,768 ~ 32,767 |
| ☐ | `System.Int32` | `int` | 32-bit | ~±2.1 billion |
| ☐ | `System.Int64` | `long` | 64-bit | ~±9.2 quintillion |
| ☐ | `System.Single` | `float` | 32-bit | Precision 6-9 digits |
| ☐ | `System.Double` | `double` | 64-bit | Precision 15-17 digits |
| ☐ | `System.Decimal` | `decimal` | 128-bit | Precision 28-29 digits (financial) |
| ☐ | `System.Boolean` | `bool` | 1 byte | true / false |
| ☐ | `System.Char` | `char` | 16-bit | Single Unicode character |
| ☐ | `struct` (user-defined) | - | Sum of fields | Suitable for small, immutable data |

```csharp
int a = 1;
int b = a;  // Value copy (independent)
a = 2;
// b is still 1
```

**Struct Example:**

```csharp
// User-defined struct
public struct Point
{
    public int X;
    public int Y;

    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }
}

Point p1 = new Point(10, 20);
Point p2 = p1;  // Value copy (independent)
p1.X = 100;
// p2.X is still 10

// Structs are good for:
// - Small data (< 16 bytes recommended)
// - Frequently created/destroyed objects
// - Data that doesn't need inheritance
```

---

## Combination 2: Reference + Immutable + Variable (by content)

**Why this combination?**
- Object stored on heap, but content cannot change after creation
- "Modification" creates new object + changes reference
- Length varies per string (variable), but once created, that length is also fixed

| Done | Type | Alias | Default | Notes |
|:---:|------|-------|---------|-------|
| ☐ | `System.String` | `string` | null | Creates new object on modification |
| ☐ | `Tuple<...>` | - | null | Read-only tuple |

**Why string is Immutable:**
- Thread-safe (safe to share across multiple threads)
- String Interning (same literals reuse same object)
- Security (content cannot be changed externally)

### `string` Time/Space Complexity

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Index access `str[i]` | O(1) | O(1) | O(1) | |
| ☐ | Length `str.Length` | O(1) | O(1) | O(1) | Returns stored value |
| ☐ | Concat `s1 + s2` | O(n+m) | O(n+m) | O(n+m) | Creates new string |
| ☐ | Repeated concat (loop) | O(n²) | O(n²) | O(n²) | New object each time → Use StringBuilder |
| ☐ | `Substring(i, len)` | O(len) | O(len) | O(len) | Creates new string |
| ☐ | `Contains(s)` | O(n×m) | O(n×m) | O(1) | n=source, m=search string |
| ☐ | `IndexOf(s)` | O(n×m) | O(n×m) | O(1) | |
| ☐ | `Replace(old, new)` | O(n) | O(n) | O(n) | Creates new string |
| ☐ | `Split(char)` | O(n) | O(n) | O(n) | Creates new array + strings |
| ☐ | `ToUpper/ToLower` | O(n) | O(n) | O(n) | Creates new string |
| ☐ | `Trim()` | O(n) | O(n) | O(n) | Creates new string |
| ☐ | `==` comparison | O(n) | O(n) | O(1) | Character-by-character |

```csharp
string s1 = "hello";
string s2 = s1;   // Same object reference
s1 = "world";     // O(n) creates new object, only s1 changes
// s2 is still "hello"

// Inefficient O(n²)
string result = "";
for (int i = 0; i < 1000; i++)
    result += i;  // New object each time

// Efficient O(n)
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
    sb.Append(i);
string result = sb.ToString();
```

**Tuple Example:**

```csharp
// Tuple - immutable, read-only
var tuple = Tuple.Create("Alice", 30, true);
// tuple.Item1 = "Bob";  // ERROR: Cannot modify

string name = tuple.Item1;   // "Alice"
int age = tuple.Item2;       // 30
bool active = tuple.Item3;   // true

// ValueTuple (C# 7+) - named elements, but still immutable reference behavior
var person = (Name: "Alice", Age: 30);
Console.WriteLine(person.Name);  // "Alice"

// Tuple is good for:
// - Returning multiple values from a method
// - Temporary grouping of values
// - When you don't want to create a full class
```

---

## Combination 3: Reference + Mutable + Fixed

**Why this combination?**
- Object stored on heap
- Element values can change (Mutable)
- But length is fixed at creation

**Why is it fast?**
- Contiguous memory allocation - elements stored side by side
- Index access O(1) - calculated as: start address + (index × element size)
- CPU cache efficiency - contiguous memory has high cache hit rate

| Done | Type | Default | Notes |
|:---:|------|---------|-------|
| ☐ | `T[]` (Array) | null | Length cannot change, elements can |
| ☐ | char[] | null | Used for string manipulation (also belongs to T[]) |

### `T[]` (Array) Time/Space Complexity

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Create `new T[n]` | O(n) | O(n) | O(n) | Allocate n memory + initialize defaults |
| ☐ | Index access `arr[i]` | O(1) | O(1) | O(1) | Direct address calculation |
| ☐ | Index modify `arr[i] = x` | O(1) | O(1) | O(1) | Direct address calculation |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |
| ☐ | Search (unsorted) | O(n) | O(n) | O(1) | Check from start to end |
| ☐ | Search (sorted, binary) | O(log n) | O(log n) | O(1) | Binary search |
| ☐ | Resize | N/A | N/A | - | Must create new array + copy |

```csharp
int[] arr = new int[3];  // Length fixed at 3
arr[0] = 100;            // O(1) element modification
// arr.Length cannot change - must create new array
```

---

## Combination 4: Reference + Mutable + Variable

**Why this combination?**
- Object stored on heap
- Content can be modified (Mutable)
- Size can change dynamically (Variable)
- Used for most cases requiring flexibility

| Done | Type | Default | Notes |
|:---:|------|---------|-------|
| ☐ | `List<T>` | null | Dynamic array, Add/Remove supported |
| ☐ | `Dictionary<K,V>` | null | Key-Value pairs, add/delete supported |
| ☐ | `HashSet<T>` | null | No duplicates set |
| ☐ | `Stack<T>` | null | LIFO |
| ☐ | `Queue<T>` | null | FIFO |
| ☐ | `PriorityQueue<T,P>` | null | Priority queue (.NET 6+) |
| ☐ | `LinkedList<T>` | null | Doubly linked list |
| ☐ | `SortedList<K,V>` | null | Sorted Key-Value, array-based |
| ☐ | `SortedDictionary<K,V>` | null | Sorted Key-Value, tree-based |
| ☐ | `SortedSet<T>` | null | Sorted no-duplicate set |
| ☐ | `StringBuilder` | null | For repeated string manipulation |
| ☐ | `ConcurrentDictionary<K,V>` | null | Thread-safe Dictionary |
| ☐ | `ConcurrentQueue<T>` | null | Thread-safe Queue |
| ☐ | `ConcurrentStack<T>` | null | Thread-safe Stack |
| ☐ | `ConcurrentBag<T>` | null | Thread-safe unordered collection |
| ☐ | `BlockingCollection<T>` | null | For Producer-Consumer pattern |

### `List<T>` Time/Space Complexity

Internally uses array, reallocates to 2x size when capacity exceeded.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Index access `list[i]` | O(1) | O(1) | O(1) | Internal array access |
| ☐ | Index modify `list[i] = x` | O(1) | O(1) | O(1) | Internal array modify |
| ☐ | Add at end `Add(x)` | O(1) | **O(n)** | O(1) | Worst: reallocation on capacity overflow |
| ☐ | Insert middle `Insert(i, x)` | O(n) | O(n) | O(1) | Must shift trailing elements |
| ☐ | Remove from end `RemoveAt(n-1)` | O(1) | O(1) | O(1) | Remove last element |
| ☐ | Remove middle `RemoveAt(i)` | O(n) | O(n) | O(1) | Must shift trailing elements |
| ☐ | Remove by value `Remove(x)` | O(n) | O(n) | O(1) | Search + shift |
| ☐ | Search `Contains(x)` | O(n) | O(n) | O(1) | Sequential search |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |

### `Dictionary<K,V>` Time/Space Complexity

Hash table based, performance degrades on hash collision.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Add(k, v)` | O(1) | **O(n)** | O(1) | Worst: hash collision |
| ☐ | Access `dict[k]` | O(1) | **O(n)** | O(1) | Find bucket by hash |
| ☐ | Modify `dict[k] = v` | O(1) | **O(n)** | O(1) | Find bucket by hash |
| ☐ | Remove `Remove(k)` | O(1) | **O(n)** | O(1) | Find bucket by hash |
| ☐ | Key search `ContainsKey(k)` | O(1) | **O(n)** | O(1) | Find bucket by hash |
| ☐ | Value search `ContainsValue(v)` | O(n) | O(n) | O(1) | Full traversal required |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all pairs |

### `HashSet<T>` Time/Space Complexity

Similar to Dictionary, stores only keys.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Add(x)` | O(1) | **O(n)** | O(1) | Returns false if duplicate |
| ☐ | Remove `Remove(x)` | O(1) | **O(n)** | O(1) | |
| ☐ | Search `Contains(x)` | O(1) | **O(n)** | O(1) | |
| ☐ | Union `UnionWith` | O(m) | O(m) | O(m) | m = other size |
| ☐ | Intersection `IntersectWith` | O(n) | O(n) | O(1) | n = this size |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |

### `Stack<T>` Time/Space Complexity

LIFO, internally uses array.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Push(x)` | O(1) | **O(n)** | O(1) | Worst: reallocation on capacity overflow |
| ☐ | Remove `Pop()` | O(1) | O(1) | O(1) | Remove + return top |
| ☐ | Peek `Peek()` | O(1) | O(1) | O(1) | View top only |
| ☐ | Search `Contains(x)` | O(n) | O(n) | O(1) | Full traversal |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |

### `Queue<T>` Time/Space Complexity

FIFO, internally uses circular array.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Enqueue(x)` | O(1) | **O(n)** | O(1) | Worst: reallocation on capacity overflow |
| ☐ | Remove `Dequeue()` | O(1) | O(1) | O(1) | Remove + return front |
| ☐ | Peek `Peek()` | O(1) | O(1) | O(1) | View front only |
| ☐ | Search `Contains(x)` | O(n) | O(n) | O(1) | Full traversal |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |

### `PriorityQueue<T,P>` Time/Space Complexity

Heap-based, highest priority first.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Enqueue(x, p)` | O(log n) | O(log n) | O(1) | Heap reorder |
| ☐ | Remove `Dequeue()` | O(log n) | O(log n) | O(1) | Remove top + heap reorder |
| ☐ | Peek `Peek()` | O(1) | O(1) | O(1) | View top only |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all (order not guaranteed) |

### `LinkedList<T>` Time/Space Complexity

Doubly linked list, each node has prev/next pointers.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add front/back `AddFirst/AddLast` | O(1) | O(1) | O(1) | Just pointer linking |
| ☐ | Insert middle (with node) | O(1) | O(1) | O(1) | Just pointer linking |
| ☐ | Insert middle (find by value) | O(n) | O(n) | O(1) | Search O(n) + insert O(1) |
| ☐ | Delete (with node) | O(1) | O(1) | O(1) | Just pointer linking |
| ☐ | Delete (find by value) | O(n) | O(n) | O(1) | Search O(n) + delete O(1) |
| ☐ | Search `Contains(x)` | O(n) | O(n) | O(1) | Sequential search |
| ☐ | Index access | O(n) | O(n) | O(1) | Must traverse from start |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |

### `SortedDictionary<K,V>` Time/Space Complexity

Red-Black Tree based, maintains key order.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Add(k, v)` | O(log n) | O(log n) | O(1) | Tree insert |
| ☐ | Access `dict[k]` | O(log n) | O(log n) | O(1) | Tree search |
| ☐ | Remove `Remove(k)` | O(log n) | O(log n) | O(1) | Tree delete |
| ☐ | Search `ContainsKey(k)` | O(log n) | O(log n) | O(1) | Tree search |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit in sorted order |

### `SortedList<K,V>` Time/Space Complexity

Array-based, maintains key order.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Add(k, v)` | O(n) | O(n) | O(1) | Shift elements after insert position |
| ☐ | Access `dict[k]` | O(log n) | O(log n) | O(1) | Binary search |
| ☐ | Index access `GetKeyAtIndex(i)` | O(1) | O(1) | O(1) | Array access |
| ☐ | Remove `Remove(k)` | O(n) | O(n) | O(1) | Shift elements after delete position |
| ☐ | Search `ContainsKey(k)` | O(log n) | O(log n) | O(1) | Binary search |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit in sorted order |

### `SortedSet<T>` Time/Space Complexity

Red-Black Tree based, maintains sorted order.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Add `Add(x)` | O(log n) | O(log n) | O(1) | Tree insert |
| ☐ | Remove `Remove(x)` | O(log n) | O(log n) | O(1) | Tree delete |
| ☐ | Search `Contains(x)` | O(log n) | O(log n) | O(1) | Tree search |
| ☐ | Min `Min` | O(log n) | O(log n) | O(1) | Leftmost of tree |
| ☐ | Max `Max` | O(log n) | O(log n) | O(1) | Rightmost of tree |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit in sorted order |

### `StringBuilder` Time/Space Complexity

Internal char array, expands when capacity exceeded.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Append `Append(s)` | O(k) | **O(n+k)** | O(1) | k=append length, worst: capacity overflow |
| ☐ | Insert `Insert(i, s)` | O(n) | O(n) | O(1) | Shift trailing chars |
| ☐ | Remove `Remove(i, len)` | O(n) | O(n) | O(1) | Shift trailing chars |
| ☐ | Index access `sb[i]` | O(1) | O(1) | O(1) | Array access |
| ☐ | To string `ToString()` | O(n) | O(n) | O(n) | Creates new string |

```csharp
List<int> list = new List<int>();
list.Add(1);      // O(1) size increases
list.Add(2);
list[0] = 100;    // O(1) element modification
list.RemoveAt(0); // O(n) size decreases + shift
```

---

## Combination 5: Reference + Immutable + Variable

**Why this combination?**
- Object stored on heap
- Content cannot change after creation (Thread-safe)
- Size determined at creation but varies per object
- "Modification" returns new collection

| Done | Type | Default | Notes |
|:---:|------|---------|-------|
| ☐ | `ImmutableArray<T>` | - | Immutable array |
| ☐ | `ImmutableList<T>` | - | Immutable list |
| ☐ | `ImmutableDictionary<K,V>` | - | Immutable dictionary |
| ☐ | `ImmutableHashSet<T>` | - | Immutable hash set |
| ☐ | `ImmutableStack<T>` | - | Immutable stack |
| ☐ | `ImmutableQueue<T>` | - | Immutable queue |
| ☐ | `ImmutableSortedDictionary<K,V>` | - | Immutable sorted dictionary |
| ☐ | `ImmutableSortedSet<T>` | - | Immutable sorted set |
| ☐ | `ReadOnlyCollection<T>` | null | Read-only wrapper for existing collection |
| ☐ | `ReadOnlyDictionary<K,V>` | null | Read-only wrapper for existing dictionary |

### `ImmutableArray<T>` Time/Space Complexity

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Index access `arr[i]` | O(1) | O(1) | O(1) | |
| ☐ | Add `Add(x)` | O(n) | O(n) | O(n) | Creates new array + full copy |
| ☐ | Remove `Remove(x)` | O(n) | O(n) | O(n) | Creates new array + full copy |
| ☐ | Search `Contains(x)` | O(n) | O(n) | O(1) | Sequential search |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |

### `ImmutableList<T>` Time/Space Complexity

Tree-based, minimizes copying through structural sharing.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Index access `list[i]` | O(log n) | O(log n) | O(1) | Tree traversal |
| ☐ | Add `Add(x)` | O(log n) | O(log n) | O(log n) | Only creates new path |
| ☐ | Remove `Remove(x)` | O(log n) | O(log n) | O(log n) | Only creates new path |
| ☐ | Search `Contains(x)` | O(n) | O(n) | O(1) | Sequential search |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all elements |

### `ImmutableDictionary<K,V>` Time/Space Complexity

Tree-based, structural sharing.

| Done | Operation | Time (Avg) | Time (Worst) | Space | Notes |
|:---:|-----------|:----------:|:------------:|:-----:|-------|
| ☐ | Access `dict[k]` | O(log n) | O(log n) | O(1) | Tree traversal |
| ☐ | Add `Add(k, v)` | O(log n) | O(log n) | O(log n) | Only creates new path |
| ☐ | Remove `Remove(k)` | O(log n) | O(log n) | O(log n) | Only creates new path |
| ☐ | Search `ContainsKey(k)` | O(log n) | O(log n) | O(1) | Tree traversal |
| ☐ | Traverse `foreach` | O(n) | O(n) | O(1) | Visit all pairs |

```csharp
// Requires System.Collections.Immutable namespace
var list1 = ImmutableList.Create(1, 2, 3);
var list2 = list1.Add(4);  // O(log n), list1 unchanged, returns new list
// list1: [1, 2, 3]
// list2: [1, 2, 3, 4]
```

---

**Last Updated**: 2026-01-31
