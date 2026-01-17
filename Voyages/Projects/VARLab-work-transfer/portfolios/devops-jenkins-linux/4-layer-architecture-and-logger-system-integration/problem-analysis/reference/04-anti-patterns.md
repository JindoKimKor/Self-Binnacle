[← Overview](README.md)

# Anti-patterns

* **Source:** Brown et al. (1998)

**Context:** Recurring "solutions" that generate negative consequences (Development, Architecture, Management).

**References:**
* [AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis (UVIC Lecture)](http://www.csc.uvic.ca/~hausi/480/lectures/antipatterns.pdf)
* [Software Engineering Management Anti-patterns (UVIC)](https://www.engr.uvic.ca/~seng371/lectures/L20-371-S13-col.pdf)

| Sub-Category | Types |
| :--- | :--- |
| **Development** | The Blob, Lava Flow, Functional Decomposition, Poltergeists, Boat Anchor, Golden Hammer, Dead End, Spaghetti Code, Input Kludge, Walking through a Minefield, Cut-and-Paste. |
| **Architecture** | Vendor Lock-in, Stovepipe Enterprise, Stovepipe System, Swiss Army Knife, Design by Committee, Reinventing the Wheel, Cover Your Assets. |
| **Management** | Death March, Analysis Paralysis, Viewgraph Engineering, Mushroom Management, Intellectual Violence, Fire Drill, The Feud, Email is Dangerous, Throw it over the Wall. |

---

## Development Anti-patterns

* **The Blob:** A God Class that monopolizes processing; other classes are just data holders.
* **Lava Flow:** Dead code or design artifacts that persist because no one remembers what they do or fears deleting them.
* **Functional Decomposition:** Designing OO software as a series of main routines and subroutines.
* **Poltergeists:** Short-lived objects that exist only to invoke methods in other classes.
* **Boat Anchor:** Code left in the system "just in case" it's needed later (but never is).
* **Golden Hammer:** Using a familiar technology/solution for every problem, regardless of suitability.
* **Dead End:** Reaching a point where a chosen technology or design prevents further progress.
* **Spaghetti Code:** Unstructured, difficult-to-follow control flow.
* **Input Kludge:** Ad-hoc handling of user input without proper validation or parsing.
* **Walking through a Minefield:** Using a technology that is buggy or poorly supported.
* **Cut-and-Paste Programming:** Reusing code by copying it rather than abstracting it.

---

## Architecture Anti-patterns

* **Vendor Lock-in:** Architecture heavily dependent on a specific vendor's proprietary features.
* **Stovepipe Enterprise:** Islands of automation; systems within an organization cannot interoperate.
* **Stovepipe System:** A system with ad-hoc integration, making it hard to maintain or modify.
* **Swiss Army Knife:** A component that attempts to do too many unrelated things.
* **Design by Committee:** A complex design resulting from satisfying too many stakeholders' conflicting views.
* **Reinventing the Wheel:** Building custom solutions for problems already solved by standard libraries/products.
* **Cover Your Assets:** Architecture decisions driven by risk avoidance rather than technical merit.

---

## Management Anti-patterns

* **Death March:** A project with impossible deadlines or constraints, doomed to fail.
* **Analysis Paralysis:** Spending too much time in the analysis phase, delaying implementation.
* **Viewgraph Engineering:** Relying on slides/diagrams rather than working software to track progress.
* **Mushroom Management:** Keeping developers in the dark and "feeding them manure" (lack of communication).
* **Intellectual Violence:** Using intimidation or arrogance to suppress technical dissent.
* **Fire Drill:** Constant shifting of priorities, treating everything as an emergency.
* **The Feud:** Inter-team or interpersonal conflict impeding progress.
* **Email is Dangerous:** Misusing email for sensitive or complex communications that require nuance.
* **Throw it over the Wall:** Passing work to the next team (e.g., Dev to QA) without communication or ownership.

---
[← Overview](README.md)
