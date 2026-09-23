자바스크립트의 forEach() 메서드는 배열의 각 요소에 대해 제공된 콜백 함수를 차례대로 한 번씩 실행하는 내장 함수입니다. 일반적인 for문과 달리 인덱스 변수를 만들거나 증감시킬 필요가 없어 코드가 간결해집니다. [1, 2, 3] 
이해를 돕기 위해 공식 문서인 [MDN Web Docs Array.prototype.forEach()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 명세를 기반으로 기본 문법과 활용법을 정리해 드립니다. [1] 
------------------------------
## 1. 기본 구문 (Syntax)
forEach는 기본적으로 최대 3개의 매개변수(인자)를 콜백 함수로 전달받을 수 있습니다. [4, 5] 

array.forEach(function(currentValue, index, array) {
  // 실행할 코드
});


* 
* currentValue (필수): 배열에서 현재 처리 중인 요소의 값입니다.
* index (선택): 현재 처리 중인 요소의 인덱스(번호)입니다.
* array (선택): forEach()를 호출한 원본 배열 자체입니다. [1, 4] 
* 

------------------------------
## 2. 자주 쓰는 3가지 사용 예제## ① 가장 기본적인 사용법 (요소만 꺼내기)
화살표 함수(Arrow Function)를 사용하면 코드를 더 직관적이고 짧게 작성할 수 있습니다. [1, 5] 

const fruits = ['사과', '바나나', '딸기'];

fruits.forEach((fruit) => {
  console.log(fruit);
});
// 출력 결과:// 사과// 바나나// 딸기

## ② 요소와 인덱스(순번) 함께 활용하기
현재 몇 번째 데이터를 처리하고 있는지 알고 싶을 때 index 매개변수를 추가합니다. [4, 5] 

const animals = ['호랑이', '사자', '곰'];

animals.forEach((animal, index) => {
  console.log(`${index + 1}번째 동물: ${animal}`);
});
// 출력 결과:// 1번째 동물: 호랑이// 2번째 동물: 사자// 3번째 동물: 곰

## ③ 원본 배열(array) 정보를 활용하거나 변경하기
세 번째 인자를 활용하면 반복문 안에서 전체 배열 구조에 접근할 수 있습니다. 다만 원본을 직접 수정하는 것보다는 안전하게 값을 참조하는 용도로 권장됩니다. [5] 

const numbers = [10, 20, 30];

numbers.forEach((value, index, arr) => {
  console.log(`현재 값: ${value}, 전체 배열의 크기: ${arr.length}`);
});

------------------------------
## ⚠️ forEach 사용 시 꼭 알아야 할 주의점

   1. break나 continue를 사용할 수 없습니다.
   forEach는 배열의 모든 요소를 전부 순회할 때까지 멈추지 않습니다. 중간에 반복을 멈추거나 건너뛰어야 한다면 일반 for문, for...of문, 또는 Array.prototype.every(), some() 같은 메서드를 사용해야 합니다. [1] 
   2. 반환값(Return Value)이 없습니다.
   forEach의 반환값은 언제나 undefined입니다. 만약 배열 요소를 가공하여 새로운 배열을 만들어내고 싶다면 forEach가 아닌 [map()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 메서드를 사용해야 합니다. [1, 4, 5, 6] 

forEach를 활용하려는 구체적인 작업 예시(예: 배열 안의 숫자 합산하기, 특정 조건 필터링하기 등)를 말씀해 주시면, 상황에 가장 알맞은 최적의 코드 작성법을 안내해 드릴게요.

[1] [https://developer.mozilla.org](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
[2] [https://coding-factory.tistory.com](https://coding-factory.tistory.com/1029)
[3] [https://ko.wikipedia.org](https://ko.wikipedia.org/wiki/Foreach_%EB%A3%A8%ED%94%84)
[4] [https://codingeverybody.kr](https://codingeverybody.kr/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-foreach-%ED%95%A8%EC%88%98/)
[5] [https://www.youtube.com](https://www.youtube.com/watch?v=K_CxaSPjd1c)
[6] [https://velog.io](https://velog.io/@hyeonzii/JS-forEach-map-reduce-%EC%82%AC%EC%9A%A9%EB%B2%95)
