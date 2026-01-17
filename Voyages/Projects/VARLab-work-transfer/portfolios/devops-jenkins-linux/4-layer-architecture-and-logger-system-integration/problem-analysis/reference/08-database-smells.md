[← Overview](README.md)

# Database Smells

* **Source:** Sharma's Taxonomy, "Smelly Relations"

**Context:** Poor RDBMS schema design and inefficient SQL queries.

**References:**
* [Smelly Relations: Database Schema Quality (Gatech)](https://faculty.cc.gatech.edu/~jarulraj/courses/8803-f18/papers/smelly_relations.pdf)
* [Database Smell Taxonomy (T. Sharma)](https://tusharma.in/smells/DMA.html)
* [SpeakerDeck: Smelly Relations](https://speakerdeck.com/tusharma/smelly-relations-measuring-and-understanding-database-schema-quality)

| Sub-Category | Types |
| :--- | :--- |
| **Schema** | Multi-purpose Column, Metadata as Data, Tables as Classes, Sturgeon's Law (90% unused), Ad-hoc TE (Type Extension), God Table. |
| **Query** | N+1 Select Problem, Fear of the Unknown (NULL handling), Index Abuse, Spaghetti Query. |

---

## Schema Smells

* **Multi-purpose Column:** A column storing different types of data depending on context.
* **Metadata as Data:** Storing metadata (e.g., version, type) as row data instead of schema structure.
* **Tables as Classes:** Mapping every class directly to a table (ignoring impedance mismatch).
* **Sturgeon's Law:** Tables with 90% "crud" or unused columns.
* **Ad-hoc TE (Type Extension):** Adding columns like `attribute1`, `attribute2` for flexibility.
* **God Table:** A table with too many columns or too many rows (central hub).

---

## Query Smells

* **N+1 Select Problem:** Executing N queries to fetch child records for N parent records.
* **Fear of the Unknown:** Inconsistent handling of NULL values.
* **Index Abuse:** Missing indexes on foreign keys/search columns, or too many unused indexes.
* **Spaghetti Query:** Extremely complex SQL queries that are hard to read/maintain.

---
[← Overview](README.md)
