import '@testing-library/jest-dom';

// Полифилл для TextEncoder/TextDecoder для среды jest (jsdom)
if (typeof TextEncoder === 'undefined') {
  // @ts-ignore
  global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = require('util').TextDecoder;
}