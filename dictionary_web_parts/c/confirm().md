# Window.confirm() 메서드는 확인과 취소 두 버튼을 가지며 메시지를 지정할 수 있는 모달 대화 상자를 띄웁니다.

--------

* result = window.confirm(message);

message
경고 대화 상자에 표시할 텍스트 문자열.

반환 값
확인 (true) 또는 취소 (false) 중 사용자가 선택한 값. 브라우저가 페이지 내 대화 상자를 무시하고 있으면 항상 false입니다.

예제
js

Copy
if (window.confirm("Do you really want to leave?")) {
  window.open("exit.html", "Thanks for Visiting!");
}
