// AssemblyScript WASM Module for Misty Language
// This will be the bridge between JavaScript and WASM

// Export memory for JavaScript to access
export const memory = new WebAssembly.Memory({ initial: 1 });

// Simple runtime functions
export function add(a: f64, b: f64): f64 {
  return a + b;
}

export function subtract(a: f64, b: f64): f64 {
  return a - b;
}

export function multiply(a: f64, b: f64): f64 {
  return a * b;
}

export function divide(a: f64, b: f64): f64 {
  return a / b;
}

// String buffer for passing strings between JS and WASM
let outputBuffer: string = "";

export function getOutputLength(): i32 {
  return outputBuffer.length;
}

export function clearOutput(): void {
  outputBuffer = "";
}

// For now, we'll keep it simple and use the interpreter in JavaScript
// The WASM module will provide basic arithmetic operations
// that can be called from the interpreter
