[← Overview](README.md)

# Architecture Smells

* **Source:** Garcia et al., Lippert & Roock, Sharma

**Context:** System-level structural issues affecting maintainability, evolution, and deployment.

**References:**
* [Architecture Smells (T. Sharma Preprint)](https://www.tusharma.in/preprints/architecture_smells.pdf)
* [Does your Architecture Smell? (Designite)](https://www.designite-tools.com/blog/does-your-architecture-smell)
* [Architectural Technical Debt Identification (Uni-Hamburg)](https://www.edit.fis.uni-hamburg.de/ws/files/45000699/APSEC2023.pdf)
* [Architecture Smells Impact Analysis (DiVA Portal)](https://www.diva-portal.org/smash/get/diva2:1786267/FULLTEXT01.pdf)

## Summary Table (Issue Type)

| Type | Description |
| :--- | :--- |
| **Dependency Issues** | Cyclic Dependency, Unstable Dependency, Hub-like Dependency (God Component), Implicit Cross-module Dependency. |
| **Structure Issues** | Scattered Functionality, Ambiguous Interface, Connector Envy, Extraneous Connector, Dense Structure. |

## By Source

### Garcia et al. (Connector/Component Perspective)

| Type | Issue Type | Description |
| :--- | :--- | :--- |
| **Connector Envy** | Structure | Components handle communication/connection logic that should be in a dedicated connector. |
| **Extraneous Connector** | Structure | Two components communicate through a connector when a direct call would suffice. |
| **Ambiguous Interface** | Structure | The interface of a component offers only a single, overly general entry point (e.g., `execute(Map params)`). |

### Lippert & Roock (Symptom-Based)

| Type | Issue Type | Description |
| :--- | :--- | :--- |
| **Cyclic Dependency** | Dependency | Components/Packages form a dependency cycle. |
| **Unstable Dependency** | Dependency | A stable component depends on a less stable component. |

### Sharma (Dependency Perspective)

| Type | Issue Type | Description |
| :--- | :--- | :--- |
| **Hub-like Dependency (God Component)** | Dependency | A component that is central to the system, with too many incoming/outgoing dependencies. |
| **Scattered Functionality** | Structure | A single concern is implemented across multiple components. |
| **Dense Structure** | Structure | The dependency graph is too dense (high average degree). |
| **Implicit Cross-module Dependency** | Dependency | Hidden dependencies not visible in the architecture (e.g., shared database tables). |

---
[← Overview](README.md)
