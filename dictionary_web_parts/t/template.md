좋은 질문입니다. 핵심은 `previousPageLabel` 같은 변수는 이 메서드 안에서 선언된 게 아니라, 클래스의 필드(field)로 선언되어 있을 가능성이 높다는 것입니다. 그리고 문자열 안의 `{0}`, `{1}`, `{2}`는 정규표현식이 아니라 나중에 값을 채워 넣기 위한 자리표시자(placeholder) 입니다.

## 1. `previousPageLabel`은 왜 타입 선언이 없나요?

Java에서는 변수를 사용하는 위치에 따라 선언하는 곳이 다릅니다.

예를 들어 클래스가 다음과 같이 작성되어 있을 수 있습니다.

java
```
public abstract class AbstractKrdsPaginationRenderer {

    // 클래스 필드 선언
    protected String previousPageLabel;
    protected String previousPageDisabledLabel;
    protected String firstPageLabel;
    protected String currentPageLabel;
    protected String otherPageLabel;
    protected String nextPageLabel;
    protected String nextPageDisabledLabel;
    protected String lastPageLabel;
    protected String dotPageLabel;

    public void initVariables() {
        previousPageLabel =
            "<a onclick=\"{0}({1})\" class=\"page-navi prev\" href=\"#\">이전</a>";
    }
}
```

위 코드는 이해를 돕기 위한 예시입니다. 실제 선언 위치와 접근 제어자는 원본 클래스를 확인해야 합니다.

- `String`: 변수의 자료형입니다.
- `previousPageLabel`: 변수명입니다.
- `protected`: 같은 패키지나 상속받은 클래스에서 접근할 수 있게 하는 접근 제어자입니다.
- `initVariables()`: 이미 선언된 변수에 문자열을 대입하는 메서드입니다.

따라서 메서드 내부에서 `previousPageLabel = ...`처럼 사용해도 됩니다. 변수 선언과 값 대입은 서로 다른 작업이기 때문입니다.

원본 클래스에서 선언부를 찾으려면 IDE에서 `previousPageLabel`에 커서를 두고 Go to Declaration(선언으로 이동) 기능을 사용해 보세요. 또는 프로젝트 전체 검색으로 해당 변수의 선언 위치를 확인할 수 있습니다.

## 2. `{0}`, `{1}`, `{2}`는 정규표현식인가요?

아닙니다. 정규표현식이 아니라 문자열 포맷팅에 사용되는 자리표시자입니다.

예를 들어 다음 코드를 보겠습니다.

java
```
String label =
    "<a onclick=\"{0}({1})\" class=\"page-link\" href=\"#\">{2}</a>";
```

이 문자열 자체는 아직 완성된 HTML이 아닙니다. 나중에 코드에서 값을 넣어 완성할 수 있도록 작성한 템플릿입니다.

실제 값이 다음과 같다고 가정해 보겠습니다.

| 자리표시자 | 들어갈 값 |
| --- | --- |
| `{0}` | `linkPage` |
| `{1}` | `3` |
| `{2}` | `3` |

Java의 `MessageFormat`으로 치환하면 다음과 같습니다.

java
```
String html = MessageFormat.format(
    "<a onclick=\"{0}({1})\" class=\"page-link\" href=\"#\">{2}</a>",
    "linkPage",
    3,
    3
);
```

결과:

HTML줄 바꿈코드 복사미리보기

```
<a onclick="linkPage(3)" class="page-link" href="#">3</a>
```

이렇게 되면 3페이지로 이동하는 링크를 만들 수 있습니다.

여기서 중요한 점은 `{0}`, `{1}`, `{2}`가 자동으로 치환되는 것은 아니라는 것입니다. 실제로 `MessageFormat.format()` 같은 메서드가 호출되어야 합니다. 전자정부 프레임워크의 해당 렌더러가 어떤 방식으로 치환하는지는 렌더링 메서드의 구현을 확인해야 정확히 알 수 있습니다.

## 3. `messageSource.getMessage()`의 `{0}`은 같은 의미인가요?

관련은 있지만, 용도가 조금 다릅니다.

java
```
String prevLabel = messageSource.getMessage(
    "page.prev",
    null,
    "이전",
    LocaleContextHolder.getLocale()
);
```

이 코드는 메시지 프로퍼티에서 `page.prev`라는 키에 해당하는 다국어 문자열을 가져옵니다.

예를 들어 `messages.properties`에 다음과 같이 작성되어 있다면,

properties
```
page.prev=Previous
page.next=Next
```

영어 로케일에서는 `Previous`, `Next`를 가져올 수 있습니다. 한국어 메시지 파일에는 다음과 같이 작성할 수 있습니다.

properties
```
page.prev=이전
page.next=다음
```

각 인자의 의미는 다음과 같습니다.

- `"page.prev"`: 메시지 키
- `null`: 메시지 문자열에 삽입할 파라미터가 없음
- `"이전"`: 해당 키를 찾지 못했을 때 사용할 기본값
- `LocaleContextHolder.getLocale()`: 현재 요청에 적용된 언어 설정

반면 `{0}`, `{1}` 등은 `MessageFormat` 스타일의 메시지나 HTML 템플릿에서 값을 삽입할 때 사용됩니다. 즉, 메시지를 조회하는 기능과 HTML 템플릿의 자리표시자를 치환하는 기능은 별개입니다.

## 4. 왜 HTML 전체를 문자열로 저장하나요?

페이지네이션 렌더러는 페이지 번호마다 HTML 구조를 매번 직접 작성하는 대신, 공통 템플릿을 문자열로 보관하고 필요한 값만 바꿔 사용하도록 설계할 수 있습니다.

예를 들어 다음 세 가지를 별도 템플릿으로 관리할 수 있습니다.

- `previousPageLabel`: 이전 페이지로 이동하는 활성 링크
- `previousPageDisabledLabel`: 이전 페이지가 없을 때 표시하는 비활성 요소
- `currentPageLabel`: 현재 페이지 번호를 표시하는 요소

이렇게 하면 렌더링 로직과 HTML 표현을 분리하고, CSS 클래스나 다국어 문구를 일관되게 관리할 수 있습니다.

다만 이 코드에서는 `onclick`에 JavaScript 함수를 넣는 방식이므로, 실제 렌더링 시 어떤 함수명과 페이지 번호가 삽입되는지 확인하는 것이 좋습니다.

정리하면 다음과 같습니다.

1. `previousPageLabel`은 메서드 안에서 선언하지 않고 클래스 필드로 미리 선언했을 가능성이 높습니다.
2. `{0}`, `{1}`, `{2}`는 정규표현식이 아니라 값이 들어갈 자리표시자입니다.
3. `messageSource.getMessage()`는 다국어 메시지를 조회하고, HTML 문자열의 자리표시자 치환은 별도의 렌더링 로직에서 수행됩니다.

원하시면 다음으로 `AbstractKrdsPaginationRenderer`의 실제 페이지 번호 생성 메서드에서 이 `{0}`, `{1}`, `{2}`가 어떻게 치환되는지 코드 흐름을 이어서 설명해 드릴 수 있습니다.


------

아, 전체 코드를 보니 이유가 명확합니다. `previousPageLabel` 등의 변수는 현재 작성한 `EgovKrdsPaginationRenderer` 클래스에서 선언한 것이 아니라, 부모 클래스인 `AbstractKrdsPaginationRenderer`에서 선언했기 때문입니다.

이것이 바로 Java의 상속(Inheritance) 개념입니다.

## 1. 현재 코드의 상속 관계

작성하신 코드에서 이 부분이 핵심입니다.

java
```
public class EgovKrdsPaginationRenderer
        extends AbstractKrdsPaginationRenderer {
```

`extends`는 부모 클래스의 기능과 멤버를 자식 클래스가 물려받는다는 의미입니다.

### 부모 클래스

AbstractKrdsPaginationRenderer

java
```
protected String previousPageLabel;
protected String nextPageLabel;
protected String firstPageLabel;
protected String currentPageLabel;
```

페이징에 필요한 필드와 기본 렌더링 기능 제공

extends로 상속

### 자식 클래스

EgovKrdsPaginationRenderer

java
```
public void initVariables() {
    previousPageLabel = "...";
    nextPageLabel = "...";
}
```

상속받은 필드에 실제 HTML 문자열을 대입

위 부모 클래스 코드는 개념을 설명하기 위한 예시입니다. 실제 필드 선언은 라이브러리의 원본 코드를 확인해야 합니다.

## 2. 부모 클래스에서 선언한 변수를 자식 클래스에서 사용할 수 있는 이유

예를 들어 다음과 같은 코드가 있다고 가정해 보겠습니다.

java
```
// 부모 클래스
public abstract class ParentRenderer {

    protected String previousPageLabel;
    protected String nextPageLabel;
}
```

java
```
// 자식 클래스
public class EgovKrdsPaginationRenderer extends ParentRenderer {

    public void initVariables() {
        previousPageLabel = "이전";
        nextPageLabel = "다음";
    }
}
```

자식 클래스에서는 `previousPageLabel`을 새로 선언하지 않아도 사용할 수 있습니다.

이유는 다음과 같습니다.

- `protected` 필드는 자식 클래스에서 접근할 수 있습니다.
- 자식 클래스는 부모 클래스의 멤버를 상속합니다.
- 따라서 자식 클래스의 메서드에서 해당 필드에 값을 대입할 수 있습니다.

단, 부모 클래스의 필드가 `private`이면 자식 클래스에서 이름을 직접 사용해 접근할 수 없습니다. 실제 접근 가능 여부는 부모 클래스의 선언을 확인해야 합니다.

## 3. 그렇다면 `initVariables()`는 무엇을 하나요?

작성하신 코드에서는 다음 부분입니다.

java
```
public void initVariables() {
    previousPageLabel =
        "<a onclick=\"{0}({1})\" class=\"page-navi prev\" href=\"#\">이전</a>";

    firstPageLabel =
        "<a onclick=\"{0}({1})\" class=\"page-link\" href=\"#\">{2}</a>";

    currentPageLabel =
        "<a class=\"page-link active\" href=\"#\">{0}</a>";
}
```

이 메서드는 부모 클래스에서 물려받은 필드에 HTML 템플릿을 설정하는 역할을 합니다.

여기서 구분할 점은 다음과 같습니다.

| 코드 | 의미 |
| --- | --- |
| `protected String previousPageLabel;` | 변수 선언 |
| `previousPageLabel = "...";` | 변수에 값 대입 |
| `initVariables();` | 해당 메서드 실행 |
| `extends AbstractKrdsPaginationRenderer` | 부모 클래스 상속 |

즉, 선언은 부모 클래스에 있고, 초기화는 자식 클래스에서 수행할 수 있습니다.

## 4. 부모 클래스의 메서드는 어떻게 실행되나요?

작성하신 코드에는 다음 부분도 있습니다.

java
```
@Override
public String renderPagination(
        PaginationInfo paginationInfo,
        String jsFunction) {

    updateLabelsWithCurrentLocale();

    return super.renderPagination(paginationInfo, jsFunction);
}
```

여기서는 두 가지 중요한 개념이 등장합니다.

- `@Override`: 부모 클래스에 있는 메서드를 자식 클래스에서 재정의한다는 뜻입니다.
- `super.renderPagination(...)`: 부모 클래스의 `renderPagination()` 구현을 호출한다는 뜻입니다.

실행 흐름은 대략 다음과 같습니다.

1. 화면에서 페이지네이션 렌더링을 요청합니다.
2. 자식 클래스의 `renderPagination()`이 실행됩니다.
3. `updateLabelsWithCurrentLocale()`이 언어에 맞는 이전·다음 문구를 설정합니다.
4. `super.renderPagination(...)`이 부모 클래스의 렌더링 로직을 실행합니다.
5. 부모 클래스는 전달받은 페이지 정보와 HTML 템플릿을 사용해 페이지네이션 문자열을 생성합니다.

5번의 구체적인 처리 방식은 실제 부모 클래스 구현에 따라 달라집니다.

## 5. `{0}`, `{1}`, `{2}`도 다시 정리하면

예를 들어 다음 문자열은

java
```
firstPageLabel =
    "<a onclick=\"{0}({1})\" class=\"page-link\" href=\"#\">{2}</a>";
```

정규표현식이 아니라 HTML 템플릿입니다.

부모 클래스가 `MessageFormat.format()` 또는 이에 해당하는 문자열 치환 로직을 사용한다면 다음처럼 완성될 수 있습니다.

HTML줄 바꿈코드 복사미리보기

```
<a onclick="linkPage(3)" class="page-link" href="#">3</a>
```

다만 `{0}`, `{1}`, `{2}` 각각에 어떤 값이 들어가는지는 부모 클래스의 렌더링 구현을 확인해야 정확히 알 수 있습니다.

## 6. 직접 확인하는 가장 좋은 방법

프로젝트에서 다음 순서로 확인해 보세요.

1. `AbstractKrdsPaginationRenderer`에 커서를 놓습니다.
2. IDE에서 Ctrl + 클릭 또는 Go to Declaration을 실행합니다.
3. `previousPageLabel`을 검색합니다.
4. 다음과 같은 선언을 찾습니다.

java
```
protected String previousPageLabel;
```

5. 이어서 `renderPagination()` 내부에서 `previousPageLabel`이 어떻게 사용되는지 확인합니다.

이렇게 하면 변수 선언 → 자식 클래스에서 초기화 → 부모 클래스에서 HTML 렌더링이라는 전체 흐름을 직접 확인할 수 있습니다.

참고로 현재 코드에서는 `@PostConstruct`로 초기화할 때와 `renderPagination()` 호출 때 모두 다국어 문구를 설정하고 있습니다. 현재 로케일을 반영하기 위한 의도는 이해되지만, `initMessageLabels()`의 초기화가 반드시 필요한지는 프로젝트의 실행 흐름과 설정에 따라 검토할 수 있습니다.
