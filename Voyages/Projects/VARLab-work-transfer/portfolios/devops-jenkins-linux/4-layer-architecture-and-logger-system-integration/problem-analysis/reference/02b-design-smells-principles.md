[← Overview](README.md)

# Design Smells - Principle-Based

* **Source:** *Refactoring for Software Design Smells* (Suryanarayana et al., 2014)

**Context:** Violations of core OO design principles (Abstraction, Encapsulation, Modularization, Hierarchy).

**References:**
* [Refactoring for Software Design Smells (InfoQ)](https://www.infoq.com/articles/refactoring-for-design-smells-book-review/)
* [Smells in Software Design (ACM)](https://dl.acm.org/doi/pdf/10.1145/2723742.2723764)
* [Design Smells Taxonomy (Tushar Sharma)](https://tusharma.in/smells/)

## Summary Table

| Sub-Category | Type | Description | Applied for Jenkins/Procedecual |
| :--- | :--- | :--- | :---: |
| Abstraction | **Missing Abstraction** | Concepts are implemented using primitive types or data clumps instead of a dedicated class. | O |
| Abstraction | **Multifaceted Abstraction** | An abstraction has more than one responsibility (violates SRP). | O |
| Abstraction | **Unnecessary Abstraction** | An abstraction that is not needed (e.g., essentially empty). | O |
| Abstraction | **Unutilized Abstraction** | An abstraction that is declared but not used. | O |
| Abstraction | **Duplicate Abstraction** | Two or more abstractions have identical names or implementation. | O |
| Abstraction | **Imperative Abstraction** | An abstraction whose operations are procedural rather than object-oriented. | - |
| Abstraction | **Incomplete Abstraction** | An abstraction that does not support all complementary or expected operations. | - |
| Encapsulation | **Missing Encapsulation** | Variations are not encapsulated, leading to scattered logic. | O |
| Encapsulation | **Deficient Encapsulation** | Access modifiers are too permissive (e.g., everything is public). | - |
| Encapsulation | **Leaky Encapsulation** | An abstraction exposes implementation details through its interface. | - |
| Encapsulation | **Unexploited Encapsulation** | Client code uses explicit type checks (instanceof) instead of polymorphism. | - |
| Modularization | **Broken Modularization** | Data and/or methods that should be together are separated. | O |
| Modularization | **Insufficient Modularization** | An abstraction is too large or complex (e.g., God Class). | O |
| Modularization | **Cyclically-Dependent Modularization** | Two or more abstractions depend on each other directly or indirectly. | O |
| Modularization | **Hub-like Modularization** | An abstraction has dependencies with a large number of other abstractions. | O |
| Hierarchy | **Missing Hierarchy** | Use of conditional logic (if/else) instead of inheritance/polymorphism. | - |
| Hierarchy | **Unnecessary Hierarchy** | Inheritance is used where composition would be better, or no hierarchy is needed. | - |
| Hierarchy | **Unfactored Hierarchy** | Duplicate code exists among siblings in a hierarchy. | - |
| Hierarchy | **Wide Hierarchy** | A class has an excessive number of subclasses. | - |
| Hierarchy | **Speculative Hierarchy** | Hierarchy defined for future use that does not currently exist. | - |
| Hierarchy | **Deep Hierarchy** | Excessive inheritance levels (inheritance depth > threshold). | - |
| Hierarchy | **Rebellious Hierarchy** | A subclass rejects the contract of its superclass. | - |
| Hierarchy | **Broken Hierarchy** | The superclass and subclass relationship is not "is-a". | - |
| Hierarchy | **Multipath Hierarchy** | A subclass inherits from a superclass through multiple paths (Diamond problem). | - |
| Hierarchy | **Cyclic Hierarchy** | A superclass depends on one of its subclasses. | - |

> **Note:** This book assumes OOP-based design. Jenkins Pipeline (Groovy scripts) is procedural code without class/inheritance structures, so Hierarchy Smells and some Encapsulation Smells are not applicable. However, Abstraction and Modularization concepts can be interpreted at the file/function level.

## Jenkins/Procedural Application Examples

| Sub-Category | Type | Jenkins/Procedural Application |
| :--- | :--- | :--- |
| Abstraction | **Missing Abstraction** | Constants/settings hardcoded instead of abstracted into variables or config |
| Abstraction | **Multifaceted Abstraction** | Module/file/function has multiple responsibilities |
| Abstraction | **Unnecessary Abstraction** | Unnecessary function/file separation |
| Abstraction | **Unutilized Abstraction** | Declared but unused functions |
| Abstraction | **Duplicate Abstraction** | Duplicate implementations across files |
| Encapsulation | **Missing Encapsulation** | Variations scattered without encapsulation (e.g., same pattern repeated) |
| Modularization | **Broken Modularization** | Functions that should be together are separated across files |
| Modularization | **Insufficient Modularization** | File/module is too large (God File) |
| Modularization | **Cyclically-Dependent Modularization** | Circular dependencies between helper files |
| Modularization | **Hub-like Modularization** | One module has too many dependencies (e.g., generalHelper used by 5 pipelines) |

---
[← Overview](README.md)
