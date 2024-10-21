export {};

declare global {
  interface Window {
    recaptchaVerifier: any; // Định nghĩa kiểu của recaptchaVerifier, bạn có thể thay đổi 'any' thành kiểu phù hợp nếu biết.
    confirmationResult: any; // Định nghĩa kiểu của confirmationResult
  }
}