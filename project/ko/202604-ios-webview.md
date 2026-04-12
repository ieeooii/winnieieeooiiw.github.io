---
thumbnail: /images/projects/202604-ios-webview-native-home.png
gradient: linear-gradient(135deg, #ffe4d6, #dbeafe)
---

# iOS WebView 하이브리드 앱 연동

| 항목 | 내용 |
|------|------|
| 카테고리 | Side Project |
| 기술 스택 | React 19, TypeScript, Vite, vanilla-extract, WKWebView, S3, CloudFront, ASM, Route 53 |
| 개발 기간 | 2026.04 |
| 인원 | 1인 (개인 프로젝트) |
| GitHub | [ieeooii/study-ios-web-view](https://github.com/ieeooii/study-ios-web-view) |

## 소개

실서비스에서 WebView를 활용하는 하이브리드 앱 패턴을 직접 구현한 사이드 프로젝트. JS ↔ Swift 브릿지 인터페이스를 직접 설계하고, 네이티브 기능(햅틱, 카메라, 공유 시트)을 웹앱에서 추상화된 API로 호출하는 구조를 구축했다. React 웹앱은 S3 + CloudFront + GitHub Actions로 자동 배포되며, iOS 앱은 SwiftUI + WKWebView로 구현했다.

## 주요 구현

### JS ↔ Swift 브릿지 설계

- **Problem**: 웹앱에서 네이티브 기능을 호출하는 인터페이스가 없어 하이브리드 구조를 구현할 수 없었다. 동시에 브라우저와 WebView 양쪽 환경에서 에러 없이 동작해야 했다.

- **Solve**: 메시지 방향에 따라 Emitter / Receiver로 역할을 분리하고, `bridge.emit.*` / `bridge.on.*` 인터페이스로 추상화했다.

  - **웹 → 네이티브**: `window.webkit.messageHandlers.bridge.postMessage()`로 메시지 전송. Swift의 `WKScriptMessageHandler`가 수신하여 햅틱(`UIImpactFeedbackGenerator`), 카메라(`UIImagePickerController`), 공유 시트(`UIActivityViewController`), 화면 이동 등으로 분기 처리.
  - **네이티브 → 웹**: Swift에서 `evaluateJavaScript`로 `window.dispatchEvent(new CustomEvent(...))` 실행. 웹앱에서 `window.addEventListener`로 수신.
  - **환경 감지**: `navigator.userAgent`에 `StudyWebViewApp` 포함 여부로 WebView 환경을 판별하는 `isWebView()` 유틸을 구현. WebView가 아닌 환경에서 브릿지 호출 시 조용히 무시하여 브라우저에서도 에러 없이 동작.

- **Result**: FSD(Feature-Sliced Design) 구조의 `shared/lib/bridge`로 배치하여 어느 페이지에서도 일관된 인터페이스로 네이티브 기능 호출 가능.

### 이벤트 배너 페이지

<div class="img-row-3">

![네이티브 피드에 임베드된 이벤트 배너](/images/projects/202604-ios-webview-native-home.png)
![이벤트 상세 페이지](/images/projects/202604-ios-webview-event-detail.png)
![이벤트 참여 완료](/images/projects/202604-ios-webview-event-detail-submit.png)

</div>

- **Problem**: 배너는 네이티브 피드에 임베드된 작은 WebView이고, 탭 시 풀스크린으로 전환이 필요했다. 웹 라우터로 처리하면 임베드된 WebView 내부에서만 전환되어 풀스크린이 되지 않는다.
- **Solve**: 배너 탭 시 `bridge.emit.navigate('/event/detail')`로 네이티브에 메시지를 전달. Swift가 새로운 풀스크린 sheet WebView를 열어 `/event/detail`을 로드. 브라우저 환경에서는 react-router `navigate`로 fallback.
- **Result**: 네이티브 피드 UI를 유지하면서 WebView가 풀스크린으로 전환되는 UX 구현. 이벤트 참여 완료 시 `bridge.emit.haptic('heavy')`, 닫기 버튼 → `bridge.emit.close()` → Swift sheet dismiss.

### 커뮤니티 피드 페이지

<div class="img-row-3">

![커뮤니티 피드](/images/projects/202604-ios-webview-feed.png)
![글쓰기 — 이미지 첨부](/images/projects/202604-ios-webview-feed-write.png)
![네이티브 카메라/갤러리 호출](/images/projects/202604-ios-webview-feed-camera.png)

</div>

- **Problem**: 웹앱에서 직접 카메라·갤러리에 접근할 수 없고, 선택한 이미지를 웹앱으로 돌려보내는 방법이 필요했다.
- **Solve**: 웹앱이 `bridge.emit.openCamera()`로 요청 → Swift가 `UIImagePickerController` 오픈 → 이미지 선택 후 JPEG 압축·Base64 인코딩 → `evaluateJavaScript`로 `window.dispatchEvent(new CustomEvent('imageSelected', { detail: base64 }))` 실행 → 웹앱에서 `bridge.on.image()`로 수신해 미리보기 렌더. 좋아요·댓글 인터랙션 시 `bridge.emit.haptic('light')`, 공유 버튼 → `bridge.emit.share()` → `UIActivityViewController` 호출.
- **Result**: 웹앱에서 네이티브 카메라·갤러리와 연동하는 양방향 통신 구현.


### 주문 완료 페이지

<div class="img-row-3">

![네이티브 주문 화면](/images/projects/202604-ios-webview-native-order.png)
![주문 완료 WebView](/images/projects/202604-ios-webview-order-complete.png)
![영수증 공유](/images/projects/202604-ios-webview-order-share.png)

</div>

- **Problem**: 네이티브 결제 플로우(장바구니 → 결제)가 끝난 후 주문 정보(orderId, amount 등)를 WebView에 전달할 방법이 필요했다.
- **Solve**: 네이티브가 WebView를 열 때 URL 쿼리 파라미터에 주문 정보를 포함. 웹앱은 `useSearchParams`로 파라미터를 읽어 렌더. URL 기반이라 별도 브릿지 메시지 없이 단방향 데이터 전달이 가능하고, 딥링크로도 재현 가능한 구조. 영수증 공유 → `bridge.emit.share()`, 홈으로 이동 → `bridge.emit.navigate('Home')` → Swift가 WebView dismiss.
- **Result**: 주문 완료 페이지 UI·문구 수정 시 앱스토어 심사 없이 즉시 배포 가능.


### S3 + CloudFront 인프라 구성 및 GitHub Actions CI/CD

- **Problem**: React SPA를 S3에 올리면 `/event/detail` 같은 경로를 직접 접근하거나 새로고침할 때 S3가 해당 파일을 찾지 못해 403을 반환한다. 또한 커스텀 도메인에 HTTPS를 붙이려면 SSL 인증서가 필요한데, ACM 인증서를 서울 리전(ap-northeast-2)에서 발급했더니 CloudFront 설정에서 선택 자체가 되지 않았다.
- **Solve**: SPA 라우팅 문제는 CloudFront 오류 페이지에서 403·404를 `/index.html`로 fallback 설정해 해결했다. S3는 정적 파일 저장소라 클라이언트 라우팅을 모르므로 CloudFront 레이어에서 처리해야 한다. 인증서 문제는 CloudFront가 리전 없는 글로벌 서비스라 us-east-1 인증서만 연결 가능하다는 것을 파악하고 재발급해 해결했다. OAC로 S3 직접 접근을 차단하고 CloudFront만 허용했다.
- **Result**: PR merge → `pnpm build` → S3 업로드 → CloudFront 캐시 무효화까지 자동화. 커스텀 도메인(`study-ios-web-view.ieeooii.com`) HTTPS 서빙.

## 회고 / 아쉬웠던 점

- **브릿지 명명 고민**: 처음에는 `WebViewBridge` 클래스로 설계했다가, 상태가 없는 순수 유틸이라는 이유로 객체 리터럴로 전환했다. 클래스는 상태와 인스턴스가 필요할 때 적합하고, 순수 함수 묶음은 객체 리터럴이 더 명확하다는 기준을 이 과정에서 정리할 수 있었다.
- **WebView touch 딜레이**: 네이티브 ScrollView 안에 임베드된 WKWebView에서 버튼 탭 반응이 느린 문제가 있었다. `webView.scrollView.delaysContentTouches = false`로 Swift 쪽에서 해결하고, CSS의 `touch-action: manipulation`으로 300ms 탭 딜레이를 제거했다. 웹과 네이티브 양쪽을 모두 고려해야 한다는 점을 체감했다.
- **UIActivityViewController 충돌**: sheet가 열린 상태에서 공유 버튼을 탭하면 "already presenting" 에러가 발생했다. `rootViewController()`에서 최상단 VC를 찾도록 presentation chain을 순회하는 방식으로 수정했다. SwiftUI의 presentation 계층 구조를 이해하는 계기가 됐다.
