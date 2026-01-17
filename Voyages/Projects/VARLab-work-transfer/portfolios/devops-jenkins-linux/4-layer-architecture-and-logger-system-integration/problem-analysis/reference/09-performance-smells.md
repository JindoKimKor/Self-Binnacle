[← Overview](README.md)

# Performance Smells

* **Source:** Various (Practitioner Literature)

**Context:** Patterns known to degrade latency, throughput, or resource efficiency.

**References:**
* [Performance Anti-Patterns (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S2090447917300412)
* [Hacker News Discussion on Performance](https://news.ycombinator.com/item?id=34966137)
* [StackOverflow: Synchronization Costs](https://stackoverflow.com/questions/8316984/is-thread-time-spent-in-synchronization-too-high)

| Type | Description |
| :--- | :--- |
| **Resource Usage** | Excessive Object Creation, Memory Leak, Busy Waiting, Synchronous I/O in Main Thread, Unnecessary Synchronization, Temporary Object Abuse, Session Bloat, Image Bloat, Improper Caching. |

## Detailed Descriptions

* **Excessive Object Creation:** Creating unnecessary temporary objects (GC pressure).
* **Memory Leak:** Objects are retained longer than necessary.
* **Busy Waiting:** Loops that constantly check a condition, consuming CPU.
* **Synchronous I/O in Main Thread:** Blocking the UI or main thread for network/disk ops.
* **Unnecessary Synchronization:** Locking resources when not needed (contention).
* **Temporary Object Abuse:** Recreating heavy objects (e.g., DB connections) repeatedly.
* **Session Bloat:** Storing too much data in HTTP sessions.
* **Image Bloat:** Serving images larger than the display area.
* **Improper Caching:** Caching too much, too little, or failing to invalidate stale data.

---
[← Overview](README.md)
