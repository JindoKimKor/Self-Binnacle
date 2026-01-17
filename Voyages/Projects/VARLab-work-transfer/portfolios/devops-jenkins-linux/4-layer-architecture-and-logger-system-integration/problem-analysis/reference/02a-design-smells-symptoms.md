[← Overview](README.md)

# Design Smells - Symptom-Based

* **Source:** *Principles and Patterns* (Robert C. Martin, 2000)

**Context:** Observable symptoms that indicate software is rotting - focusing on how design problems manifest rather than which principle is violated.

**References:**
* [Design Principles and Design Patterns (UTU)](https://staff.cs.utu.fi/~jounsmed/doos_06/material/DesignPrinciplesAndPatterns.pdf)
* [Agile Software Development (Book)](https://www.amazon.com/Software-Development-Principles-Patterns-Practices/dp/0135974445)

## Extended Definitions

| Type | Definition | Symptom / Criteria | Example |
| :--- | :--- | :--- | :--- |
| **Rigidity** | Changing one place requires cascading changes to other places. | "What I thought was a simple change turned out to be much more complex." / Higher rigidity = more modules need to be modified. | Modifying a parameter block requires changes to all 5 files. |
| **Fragility** | Modifying one place breaks conceptually unrelated places. | "Why does touching this break that?" / Developers refer to certain code as "danger zones." | Modifying a Git function breaks Bitbucket reporting. |
| **Immobility** | Useful parts are difficult to extract and reuse in other systems/modules. | Extracting code brings too many other dependencies. / Cost of separation > cost of rewriting. | Trying to extract only Git functions from generalHelper, but too many other dependencies. |
| **Viscosity** | Doing the right thing (preserving design) is harder than hacking. | "Doing it properly takes too long, let's just do it this way for now." / Maintaining design is more difficult than breaking it. | Copy-paste is faster than creating a common function. |
| **Needless Complexity** | Over-engineering for features not currently needed. | YAGNI violation / Code exists because "we might need it later." | Unused abstraction layers, unused parameters. |
| **Needless Repetition** | Code that could be unified through abstraction is duplicated in multiple places. | DRY violation / Similar code exists in slightly different forms across multiple locations. | Same post block repeated in 5 pipelines. |
| **Opacity** | Code is hard to understand and intent is unclear. | "What does this code do?" / Code becomes harder to understand over time. | Unclear variable names, no comments, complex logic. |

---
[← Overview](README.md)
