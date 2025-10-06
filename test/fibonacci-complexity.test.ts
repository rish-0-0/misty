// Analyze Fibonacci complexity

// Recursive Fibonacci has O(2^n) time complexity
// Each call spawns 2 more calls (except base cases)

function calculateFibCalls(n: number): number {
  if (n <= 1) return 1;
  return 1 + calculateFibCalls(n - 1) + calculateFibCalls(n - 2);
}

console.log('Fibonacci Recursive Call Analysis:');
console.log('='.repeat(60));

for (const n of [5, 10, 15, 20, 25, 30, 35, 40]) {
  const calls = calculateFibCalls(n);
  const callsInMillions = (calls / 1_000_000).toFixed(2);

  // Estimate time at different speeds
  const timeJS = (calls / 1_000_000).toFixed(2); // ~1M calls/sec in JS interpreter
  const timeWASM = (calls / 10_000_000).toFixed(2); // ~10M calls/sec in WASM (10x faster)

  console.log(`fib(${n.toString().padStart(2)}): ${calls.toLocaleString().padStart(15)} calls`);
  console.log(`        ${callsInMillions.padStart(8)}M calls`);
  console.log(`        JS:   ~${timeJS} seconds`);
  console.log(`        WASM: ~${timeWASM} seconds`);
  console.log('');
}

console.log('Note: These are rough estimates. Actual performance varies.');
console.log('The problem is algorithmic - use memoization or iteration!');
