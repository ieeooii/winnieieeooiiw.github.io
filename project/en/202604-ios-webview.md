---
thumbnail: /images/projects/202604-ios-webview-native-home.png
gradient: linear-gradient(135deg, #ffe4d6, #dbeafe)
---

# iOS WebView Hybrid App Integration

| Field | Details |
|-------|---------|
| Category | Side Project |
| Tech Stack | React 19, TypeScript, Vite, vanilla-extract, WKWebView, S3, CloudFront |
| Period | 2026.04 |
| Team | Solo |
| GitHub | [ieeooii/study-ios-web-view](https://github.com/ieeooii/study-ios-web-view) |

## Overview

A side project directly implementing the hybrid app pattern. Designed a JS ↔ Swift bridge interface from scratch and built a structure for calling native features — haptics, camera, and share sheet — through an abstracted API from the web app. The React web app is deployed automatically via S3 + CloudFront + GitHub Actions, and the iOS app is built with SwiftUI + WKWebView.

## Key Implementations

### JS ↔ Swift Bridge Design

- **Problem**: There was no interface for the web app to call native features, making a hybrid structure impossible to build. At the same time, the solution had to work without errors in both browser and WebView environments.

- **Solve**: Split responsibilities by message direction into Emitter and Receiver, and abstracted them behind a `bridge.emit.*` / `bridge.on.*` interface.

  - **Web → Native**: Sends messages via `window.webkit.messageHandlers.bridge.postMessage()`. Swift's `WKScriptMessageHandler` receives and dispatches to haptic (`UIImpactFeedbackGenerator`), camera (`UIImagePickerController`), share sheet (`UIActivityViewController`), navigation, and more.
  - **Native → Web**: Swift calls `evaluateJavaScript` to fire `window.dispatchEvent(new CustomEvent(...))`. The web app receives it via `window.addEventListener`.
  - **Environment Detection**: Implemented an `isWebView()` utility that checks whether `navigator.userAgent` contains `StudyWebViewApp`. Bridge calls in non-WebView environments are silently ignored, so the app runs without errors in the browser too.

- **Result**: Placed under `shared/lib/bridge` in a Feature-Sliced Design (FSD) structure, giving every page a consistent interface for calling native features.

### Event Banner Page

<div class="img-row-3">

![Event banner embedded in native feed](/images/projects/202604-ios-webview-native-home.png)
![Event detail page](/images/projects/202604-ios-webview-event-detail.png)
![Event participation complete](/images/projects/202604-ios-webview-event-detail-submit.png)

</div>

- **Problem**: The banner is a small WebView embedded in the native feed, and it needed to expand to full-screen on tap. Handling navigation through the web router would only transition inside the embedded WebView, not produce a full-screen effect.

- **Solve**: On banner tap, `bridge.emit.navigate('/event/detail')` sends a message to native. Swift then opens a new full-screen sheet WebView loading `/event/detail`. In the browser, it falls back to react-router `navigate`.

- **Result**: Full-screen WebView transition while preserving the native feed UI. Haptic feedback on participation (`bridge.emit.haptic('heavy')`), close button → `bridge.emit.close()` → Swift sheet dismiss.

### Community Feed Page

<div class="img-row-3">

![Community feed](/images/projects/202604-ios-webview-feed.png)
![Write post — image attachment](/images/projects/202604-ios-webview-feed-write.png)
![Native camera/gallery picker](/images/projects/202604-ios-webview-feed-camera.png)

</div>

- **Problem**: The web app can't directly access the camera or gallery, and there was no way to pass a selected image back to the web app.

- **Solve**: Web app calls `bridge.emit.openCamera()` → Swift opens `UIImagePickerController` → on selection, compresses to JPEG, Base64-encodes, and fires `window.dispatchEvent(new CustomEvent('imageSelected', { detail: base64 }))` via `evaluateJavaScript` → web app receives it through `bridge.on.image()` and renders a preview. Like/comment interactions trigger `bridge.emit.haptic('light')`, and the share button calls `bridge.emit.share()` → `UIActivityViewController`.

- **Result**: Full bidirectional communication between the web app and native camera/gallery.

<div class="img-row-1">

![Native share sheet](/images/projects/202604-ios-webview-feed-share.png)

</div>

### Order Complete Page

<div class="img-row-3">

![Native order screen](/images/projects/202604-ios-webview-native-order.png)
![Order complete WebView](/images/projects/202604-ios-webview-order-complete.png)
![Receipt share](/images/projects/202604-ios-webview-order-share.png)

</div>

- **Problem**: After the native checkout flow (cart → payment), there was no way to pass order data (orderId, amount, etc.) into the WebView.

- **Solve**: Native opens the WebView with order data embedded as URL query parameters. The web app reads them via `useSearchParams`. URL-based delivery requires no extra bridge messages and is reproducible via deep link. Share receipt → `bridge.emit.share()`, go home → `bridge.emit.navigate('Home')` → Swift dismisses the WebView.

- **Result**: Order completion UI and copy can be updated and deployed instantly without an App Store review.

### S3 + CloudFront Infrastructure and GitHub Actions CI/CD

- **Problem**: Deploying a React SPA to S3 caused 403 errors on direct URL access or page refresh for routes like `/event/detail`, since S3 has no matching file. Additionally, the ACM SSL certificate issued in the Seoul region (ap-northeast-2) couldn't be selected in CloudFront settings at all.

- **Solve**: Fixed the SPA routing issue by configuring CloudFront error pages to return `/index.html` with HTTP 200 for 403 and 404 responses — S3 doesn't understand client-side routing, so this must be handled at the CloudFront layer. For the certificate, CloudFront is a regionless global service and only accepts certificates from us-east-1, so the certificate was reissued there. S3 direct access is blocked via OAC, allowing only CloudFront.

- **Result**: PR merge → `pnpm build` → S3 upload → CloudFront cache invalidation, fully automated. Custom domain (`study-ios-web-view.ieeooii.com`) served over HTTPS.

## Retrospective / Lessons Learned

- **Bridge design decisions**: Started with a `WebViewBridge` class, then switched to an object literal since there was no state or instance needed. This clarified a useful rule: classes are for when you need state and instances; plain function collections are cleaner as object literals.
- **WebView touch delay**: Buttons in a WKWebView embedded inside a native ScrollView responded slowly to taps. Fixed on the Swift side with `webView.scrollView.delaysContentTouches = false`, and removed the 300ms tap delay on the CSS side with `touch-action: manipulation`. A reminder that both layers need to be considered.
- **UIActivityViewController conflict**: Tapping the share button while a sheet was already open caused an "already presenting" error. Fixed by traversing the presentation chain in `rootViewController()` to find the topmost view controller. A good lesson in how SwiftUI's presentation hierarchy works.
