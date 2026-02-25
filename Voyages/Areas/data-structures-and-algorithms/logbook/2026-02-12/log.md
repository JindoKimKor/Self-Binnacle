---
date: 2026-02-12
---

## Log (Monitoring)

### What did I actually do?
-

### Blockers
-

### Reflection
-

### Next Steps
-

### References
-

### Notes
-

### Raw (AI: organize into sections above)
-

https://coderbyte.com/editor/First%20Factorial:Csharp
Coderbyte : First Factorial

Question: "How are you going to solve this problem? Explain your approach."
Framework:

Input/Output 설명
Keywords & Constraints
Pattern 판단 + 이유
Approach (base case, recursive case, 예시 흐름)
"I'll go ahead and write the code."

**1. input/output이 뭐지?**
- input: 정수 하나 (4, 8 등)
- output: 그 수의 factorial (24, 40320 등)

**2. 키워드와 제약조건이 뭐지?**
- 키워드: factorial
- 제약조건: 1~18 사이 정수만 들어옴

**3. 패턴은 뭐지?**
- Recursion
- 이유: factorial(n) = n × factorial(n-1)로 쪼갤 수 있으니까. 같은 함수가 더 작은 input으로 반복되는 구조.

**4. 이 패턴을 어떻게 적용하지?**
- base case: n이 1이면 1 리턴 (여기서 멈춤)
- recursive case: n × FirstFactorial(n - 1) 리턴
- 동작 흐름 (n=4):
  - FirstFactorial(4) → 4 × FirstFactorial(3)
  - FirstFactorial(3) → 3 × FirstFactorial(2)
  - FirstFactorial(2) → 2 × FirstFactorial(1)
  - FirstFactorial(1) → 1 (base case)
  - 거꾸로 올라감: 1 → 2 → 6 → 24

---

"This problem takes an integer and returns its factorial. When input is 4, output is 24. When input is 8, output is 40320.

The keyword is factorial, and the constraint is that input is always an integer between 1 and 18.

The pattern is recursion. Because factorial of n can be expressed as n times factorial of n minus 1. The same operation repeats with a smaller value each time.

For the approach, the base case is when n equals 1, we return 1. The recursive case returns n times FirstFactorial of n minus 1. For example, if n is 4, it calls 4 times FirstFactorial of 3, then 3 times FirstFactorial of 2, then 2 times FirstFactorial of 1, which returns 1. Then it goes back up: 2, 6, 24.

I'll go ahead and write the code."

---