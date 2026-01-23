# Runtime Comparison: Source to Hardware

## Core Insight
> "All code eventually becomes system calls"

No matter the language or runtime, all operations that interact with hardware (file I/O, network, memory) must go through OS system calls. This is why understanding the execution pipeline matters - it reveals what's actually happening beneath your code.

## Why This Matters
- Understanding how code executes from source to hardware
- Foundation for system-level thinking (data flow across network, memory, disk)
- Explains performance characteristics of each language

## Execution Pipeline

```mermaid
flowchart TB
    subgraph Java["Java"]
        J1[".java source code"]
        J2["javac compiler"]
        J3[".class bytecode"]
        J4["JVM"]
        J5["JIT compiler"]
        J6["Native machine code"]
        J1 --> J2 --> J3 --> J4 --> J5 --> J6
    end

    subgraph CSharp["C#"]
        C1[".cs source code"]
        C2["csc compiler"]
        C3[".dll/.exe (IL/MSIL)"]
        C4["CLR (.NET Runtime)"]
        C5["JIT compiler"]
        C6["Native machine code"]
        C1 --> C2 --> C3 --> C4 --> C5 --> C6
    end

    subgraph Python["Python"]
        P1[".py source code"]
        P2["Python interpreter"]
        P3[".pyc bytecode (internal cache)"]
        P4["PVM (Python VM)"]
        P1 --> P2 --> P3 --> P4
    end

    subgraph Node["Node.js"]
        N1[".js source code"]
        N2["V8 engine"]
        N3["JIT compiler"]
        N4["Native machine code"]
        N1 --> N2 --> N3 --> N4
    end

    subgraph OS["Operating System"]
        OS1["System Calls"]
        OS2["Hardware"]
        OS1 --> OS2
    end

    J6 --> OS1
    C6 --> OS1
    P4 --> OS1
    N4 --> OS1
```

## Key Insights

| Language | Compilation | Runtime | Characteristic |
|----------|-------------|---------|----------------|
| Java | AOT → Bytecode | JVM + JIT | Write once, run anywhere |
| C# | AOT → IL | CLR + JIT | .NET ecosystem integration |
| Python | None (interpreted) | PVM | Rapid development, slower execution |
| Node.js | None | V8 + JIT | Event-driven, non-blocking I/O |

## Key Concepts

- **AOT (Ahead-of-Time)**: Compiled before execution
- **JIT (Just-in-Time)**: Compiled during execution for optimization
- **Bytecode**: Intermediate representation between source and machine code
- **VM (Virtual Machine)**: Abstracts hardware, enables portability
