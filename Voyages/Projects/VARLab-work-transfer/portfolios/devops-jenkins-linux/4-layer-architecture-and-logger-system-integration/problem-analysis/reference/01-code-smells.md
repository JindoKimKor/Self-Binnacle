[← Overview](README.md)

# Code Smells

> **Source:** Fowler, M. & Beck, K. (1999). *Refactoring: Improving the Design of Existing Code*
>
> **Context:** Visible signs that code may need refactoring (intra-class or method level).
>
> **References:**
> - [Refactoring.guru Catalog](https://refactoring.guru/refactoring/catalog)
> - [Code Smells Answer Table (Scribd)](https://www.scribd.com/doc/222690574/Code-Smells-Answer-Table)
> - [Coding Horror: Code Smells](https://blog.codinghorror.com/code-smells/)
> - [Industrial Logic: Smells to Refactorings](https://www.industriallogic.com/img/blog/2005/09/smellstorefactorings.pdf)

---

## 1. Bloaters

> Code that has grown too large and becomes difficult to work with.

| Smell | Description |
|-------|-------------|
| **Long Method** | A method contains too many lines of code or does too much. |
| **Large Class** | A class has too many fields/methods/lines of code. |
| **Long Parameter List** | A method has too many parameters, making it hard to read/call. |
| **Primitive Obsession** | Using primitives instead of small objects for simple tasks (e.g., currency, ranges). |
| **Data Clumps** | Data items that like to hang around together (e.g., fields, parameters). |

---

## 2. Object-Orientation Abusers

> Incorrect or incomplete application of object-oriented principles.

| Smell | Description |
|-------|-------------|
| **Switch Statements** | Complex switch statements or type codes that should be polymorphism. |
| **Parallel Inheritance Hierarchies** | Every time you make a subclass of one class, you have to make a subclass of another. |
| **Temporary Field** | Instance variables that are set only in certain circumstances. |
| **Refused Bequest** | Subclasses usually use only a little of what their parents give them. |
| **Alternative Classes with Different Interfaces** | Classes that do the same thing but have different method names/signatures. |

---

## 3. Change Preventers

> Code that makes modifications difficult, requiring changes in many places.

| Smell | Description |
|-------|-------------|
| **Divergent Change** | You have to change the same class in different ways for different reasons. |
| **Shotgun Surgery** | A single change requires making many small changes to many different classes. |
| **Parallel Inheritance Hierarchies** | Every time you make a subclass of one class, you have to make a subclass of another. |

---

## 4. Dispensables

> Code that is unnecessary and should be removed.

| Smell | Description |
|-------|-------------|
| **Lazy Class** | A class that doesn't do enough to justify its existence. |
| **Speculative Generality** | Code created "just in case" to support anticipated future features. |
| **Data Class** | Classes that have fields, getters and setters, and nothing else. |
| **Duplicated Code** | Identical or very similar code exists in more than one location. |
| **Dead Code** | Code that is no longer used or executed. |
| **Comments** | Used to hide bad code (the "deodorant" for other smells). |

---

## 5. Couplers

> Code that creates excessive coupling between classes.

| Smell | Description |
|-------|-------------|
| **Feature Envy** | A method seems more interested in a class other than the one it is in. |
| **Inappropriate Intimacy** | Classes know too much about each other's private parts. |
| **Message Chains** | A client asks one object for another object, which asks for another, etc. |
| **Middle Man** | A class that delegates all its work to another class. |
| **Incomplete Library Class** | A library class that doesn't provide the functionality you need. |

---

## Classification Notes

- **Parallel Inheritance Hierarchies** appears in both *Object-Orientation Abusers* and *Change Preventers* as it exhibits characteristics of both categories.
- **Dead Code** is sometimes listed separately but is categorized under *Dispensables* in most references.

---

[← Overview](README.md)