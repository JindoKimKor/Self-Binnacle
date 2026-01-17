[← Overview](README.md)

# Implementation Smells

* **Source:** Sharma's Taxonomy

**Context:** Statement/Method level constructs indicating poor implementation.

**References:**
* [IJMEMS: Code Smell Detection & Classification](https://ijmems.in/cms/storage/app/public/uploads/volumes/25-IJMEMS-23-0476-9-3-472-498-2024.pdf)
* [Luzkan's Smell Catalog](https://luzkan.github.io/smells/)

| Type | Description |
| :--- | :--- |
| **Logic/Flow** | Magic Number, Magic String, Complex Condition, Empty Catch Block, Long Statement, Deeply Nested Code, Missing Default in Switch. |
| **Organization** | Hardcoded Reference, Duplicate String Literal, Unused Import/Variable. |

## Detailed Descriptions

* **Magic Number:** Unexplained numeric literals in code.
* **Magic String:** Unexplained string literals in code.
* **Complex Condition:** Overly complicated boolean expressions in `if/while`.
* **Empty Catch Block:** Catching an exception and doing nothing (swallowing errors).
* **Long Statement:** A single line of code that is excessively long or complex.
* **Deeply Nested Code:** Excessive nesting of loops and conditionals (Arrow Anti-pattern).
* **Missing Default in Switch:** Switch statements that do not handle the default case.
* **Hardcoded Reference:** Hardcoding paths or URLs.
* **Duplicate String Literal:** Using the same string literal multiple times without a constant.
* **Unused Import/Variable:** Cluttering code with unnecessary declarations.

---
[← Overview](README.md)
