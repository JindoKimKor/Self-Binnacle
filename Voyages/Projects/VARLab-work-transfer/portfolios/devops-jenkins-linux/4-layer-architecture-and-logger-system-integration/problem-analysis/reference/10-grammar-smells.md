[← Overview](README.md)

# Grammar Smells

* **Source:** Sharma's Taxonomy

**Context:** Issues in DSL definitions and parser rules.

**References:**
* [Grammar Smells (T. Sharma)](https://tusharma.in/smells/)

| Type | Description |
| :--- | :--- |
| **DSL/Parser** | Ambiguous Grammar, Left Recursion, Common Prefix, Useless Rule, Unreachable Rule, Missing Semicolon/Separator Issues, Indentation Hell. |

## Detailed Descriptions

* **Ambiguous Grammar:** A grammar where a string can be parsed in multiple ways.
* **Left Recursion:** Grammar rules that recurse on the left side (issues for LL parsers).
* **Common Prefix:** Rules sharing the same start (requires backtracking or factoring).
* **Useless Rule:** A rule that is defined but never referenced.
* **Unreachable Rule:** A rule that can never be matched.
* **Missing Semicolon/Separator Issues:** Ambiguities arising from optional delimiters.
* **Indentation Hell:** Complex indentation-based block structures (if not handled carefully).

---
[← Overview](README.md)
