# Big O Notation

## O의 의미

**O = Order (차수)**

- "Big O notation"
- 입력 크기(n)에 대한 증가 차수
- 최악의 경우 성능 상한선

---

## 수학적 배경

```
f(n) = O(g(n))
```

"f(n)은 g(n)의 차수로 증가한다"

**예시:**
```
f(n) = 3n² + 5n + 2
Big O: O(n²)
```
- 가장 큰 차수만 남김
- 상수는 무시 (3, 5, 2)
- n이 커지면 n²이 지배적

---

## 역사

| Year | Person | Contribution |
|------|--------|--------------|
| 1894 | Paul Bachmann | 독일 수학자, 수론에서 사용 |
| 1976 | Donald Knuth | "The Art of Computer Programming", 컴퓨터 과학에 도입 |

**차수 명칭:**
| 차수 | 표기 | 이름 |
|------|------|------|
| 1차 | O(n) | Linear |
| 2차 | O(n²) | Quadratic |
| 3차 | O(n³) | Cubic |
| log차 | O(log n) | Logarithmic |

---

## Big O Family

| 표기 | 이름 | 의미 |
|------|------|------|
| O (Big O) | 상한선 | 최악의 경우 이것보다 안 나빠 |
| Ω (Big Omega) | 하한선 | 최선의 경우 이것보다 안 좋아 |
| Θ (Big Theta) | 정확한 차수 | 평균적으로 정확히 이것 |

**실전에서는 거의 Big O만 씀** - 최악의 경우가 가장 중요하기 때문

---

## 복잡도별 의미

### O(1) - Constant
```
입력이 10배 → 시간 동일
입력이 100배 → 시간 동일
```
입력 크기와 무관

### O(n) - Linear
```
입력이 2배 → 시간도 2배
입력이 10배 → 시간도 10배
```
선형적으로 증가

---

## 코드 예시

```java
// O(1) - Constant
int x = arr[0];  // n이 뭐든 1번만

// O(n) - Linear
for (int i = 0; i < n; i++)  // n번 반복

// O(n²) - Quadratic
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)  // n × n번

// O(log n) - Logarithmic
while (n > 1) {
    n = n / 2;  // 반씩 줄어듦
}
```

---

## 왜 상수 무시?

```
실제 시간: 3n² + 5n + 2

n = 10:    352
n = 1000:  3,005,002  ← n²이 지배적

n이 크면: 3n² >> 5n >> 2
→ O(n²)만 표기
```

---

## 발음

### English
| 표기 | 발음 | 학술적 |
|------|------|--------|
| O(1) | "Oh one" | "Constant time" |
| O(n) | "Oh N" | "Linear time" |
| O(n²) | "Oh N squared" | "Quadratic time" |
| O(log n) | "Oh log N" | "Logarithmic time" |
| O(n log n) | "Oh N log N" | - |
| O(2^n) | "Oh two to the N" | "Exponential time" |

### Korean
| 표기 | 발음 |
|------|------|
| O(1) | "오원" / "빅오원" |
| O(n) | "오엔" / "빅오엔" |
| O(n²) | "오엔제곱" / "오엔스퀘어" |
| O(log n) | "오로그엔" |

---

## 면접 예시

### English Interview
```
Interviewer: "What's the time complexity?"
You: "It's O N, we iterate through the array once."

Interviewer: "Can you optimize the space?"
You: "Yes, we can reduce it to O one by using two pointers."
```

### Korean Interview
```
면접관: "이거 시간 복잡도 어떻게 돼?"
나: "오엔이요, 배열 한 번 돌아요."

면접관: "공간은?"
나: "오원으로 줄일 수 있어요, 투 포인터 쓰면요."
```

---

## Practice Phrases

```
"The HashSet solution is O N time and O N space"
"Two pointers is O N time but O one space"
"This algorithm is linear, O N"
"The time complexity is O of N"
```
