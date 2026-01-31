# Real-World Applications of Data Structures & Algorithms

> Source: PROG3330 - Pedro Miranda

## By Company/Domain

| Company | Data Structure/Algorithm | Use Case |
|---------|-------------------------|----------|
| Google / Bing | Inverted Index, Trie, DAWG | Autocomplete, search indexing |
| Google | Graph (PageRank) | Link analysis, search ranking |
| Amazon | Consistent Hashing | Distributed key-value storage |
| Amazon | LSM Tree | Key-value systems |
| Amazon | Heap, Top-K | Trending, recommendations |
| Oracle / PostgreSQL / MySQL | B+-Tree | Point/range lookups O(log n) |
| PostgreSQL | GIN, GiST | Full-text, geometric queries |
| Redis | Hash Table, Skip List | Sorted sets |
| Redis | HyperLogLog, Bloom Filter | Distinct counts, membership checks |
| Netflix / YouTube / Instagram | Priority Queue | Feed ranking |
| Netflix / YouTube / Instagram | Fenwick Tree, Segment Tree | Real-time metrics, streaming aggregates |
| Uber / Lyft / DoorDash | Dijkstra, A* | Routing, ETA |
| Uber / Lyft / DoorDash | Bipartite Matching | Dispatch optimization |
| Stripe / Cloudflare | Bloom Filter, Count-Min Sketch | Fraud/abuse detection at scale |

## By Problem Pattern

| Problem | Data Structure | Improvement |
|---------|---------------|-------------|
| Slow O(n) scans | BST, B-Tree, B+-Tree | O(log n) lookups |
| Prefix search / Autocomplete | Trie, Ternary Search Tree | O(k) where k = key length |
| Rolling "last N minutes" analytics | Deque, Sliding Window | O(1) - O(log n) per update |
| Connectivity problems | Union-Find (DSU) | Near O(1) amortized |
| Memory-efficient membership | Bloom Filter | Probabilistic, very low memory |
| Approximate counting | HyperLogLog | ~1.6KB for billions of items |

## Key Takeaways

1. **O(n) → O(log n)**: Binary search trees, B-trees for indexed lookups
2. **Prefix/Autocomplete**: Tries and ternary search trees
3. **Sliding Window**: Deques for rolling analytics
4. **Connectivity**: Union-Find for near-constant time
5. **Trade-offs**: Time vs Space, Readability vs Performance, Cache friendliness

## Reference

- Book: [Algorithms 4th Edition - Sedgewick & Wayne](https://algs4.cs.princeton.edu)
