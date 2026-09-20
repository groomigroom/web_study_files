
const lottoNumbers = new Set();

// 숫자가 6개가 될 때까지 반복
while (lottoNumbers.size < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    lottoNumbers.add(num); // 이미 있는 숫자면 알아서 무시됨
}

// 결과를 배열로 변환하여 출력
console.log([...lottoNumbers]);
// 출력 예시: [14, 3, 45, 21, 33, 7]
