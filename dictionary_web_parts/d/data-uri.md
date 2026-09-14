HTML의 <a> 태그에서 data-uri 속성은 브라우저가 기본적으로 인식하는 기능이 없는, 개발자가 임의로 정의한 '커스텀 데이터 속성'입니다.
HTML5 표준 스펙인 data-* 문법을 따른 것으로, 특정 HTML 엘리먼트에 서버의 데이터나 추가적인 정보를 안전하게 저장해 두고 싶을 때 사용합니다.
이것이 <a> 태그에서 어떤 의미를 가지는지 핵심 내용을 요약해 드립니다.
## 1. href 대신 자바스크립트(JS) 통신용으로 사용
일반적으로 <a> 태그는 href="/url"을 사용해 페이지를 이동시킵니다.
하지만 페이지 이동(새로고침) 없이 비동기 요청(AJAX/Fetch)을 보내거나, 클릭했을 때 자바스크립트로 특별한 처리를 하고 싶을 때 href 대신 data-uri에 목적지 주소를 숨겨놓습니다.
## 2. 실제 HTML 예시와 자바스크립트 연동
HTML 코드가 다음과 같이 작성되어 있다면:

<a href="#" class="recommend-btn" data-uri="/question/vote/5">추천하기</a>

자바스크립트에서는 이 data-uri 값을 다음과 같이 읽어서 백엔드 서버와 통신(투표 기능 수행 등)을 처리합니다.

// 버튼 클릭 이벤트 리스너
document.querySelector('.recommend-btn').addEventListener('click', function(event) {
    event.preventDefault(); // href="#"로 인해 페이지가 위로 튕기는 현상 방지

    // data-uri 값 가져오기
    let targetUri = this.dataset.uri; // "/question/vote/5"가 담깁니다.

    // Fetch API 등을 이용해 비동기 요청 보내기
    fetch(targetUri, { method: 'POST' })
        .then(response => {
            // 성공 시 추천수 UI 업데이트 등...
        });
});

## 3. 왜 굳이 href를 안 쓰고 data-uri를 쓸까?

* 유연한 처리: href에 주소를 넣으면 브라우저가 무조건 그 주소로 이동하려고 인터셉트하므로 자바스크립트 제어가 까다로워질 수 있습니다.
* RESTful한 설계: 투표나 삭제 같은 기능은 단순 페이지 이동(GET)이 아니라 POST나 DELETE 같은 HTTP 메서드를 사용해야 안전합니다. data-uri에 주소를 담아두고 자바스크립트로 POST 요청을 보내는 방식이 보안과 설계 면에서 훨씬 깔끔합니다.

------------------------------
현재 이 data-uri 값을 활용하는 자바스크립트(JS)나 jQuery 코드 작성이 필요하신가요? 원하시는 동작 방식(예: 클릭 시 알림창 띄우기, 비동기 추천 반영 등)을 말씀해 주시면 맞춤형 코드를 작성해 드릴 수 있습니다.

