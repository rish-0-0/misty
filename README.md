# 🌫️ Misty

A simple programming language with Web Worker execution. Born in the mist, before clarity.

## Features

### Core Language
- ✨ Simple, readable syntax
- 📝 Constants and mutable variables
- 🔧 Procedures (functions) with closures and recursion
- 🧮 Arithmetic, comparison, logical, and bitwise operators
- 📦 Objects (JSON-like syntax) with dot and arrow notation
- 📚 Arrays with drift-through loops
- 🔄 Control flow with `incase` statements
- 🌀 Drift loops (traditional and iterator-based)
- 🎯 Null/NaN support with proper type safety
- ⚡ Early return support for procedures

### Execution & Performance
- 🚀 Runs in Web Workers (non-blocking UI)
- 🛑 Cancellable execution
- 📊 Real-time execution notifications
- 💻 Interactive web-based playground

## Language Syntax

### Variables
```misty
const x = 5;        # Immutable constant
mut a = 4;          # Mutable variable
a = 10;             # Reassignment (mutable only)
```

### Data Types
```misty
const num = 42;                    # Number
const str = "Hello";               # String
const bool = true;                 # Boolean
const nothing = null;              # Null (also: nullptr)
const notANumber = NaN;            # NaN
const arr = [1, 2, 3];            # Array
const obj = {name: "Alice"};       # Object
```

### Objects
```misty
# JSON-like syntax
mut person = {
  name: "Alice",
  age: 30,
  address: {
    city: "NYC"
  }
};

# Dot notation (static)
System.out.console(person.name);
System.out.console(person.address.city);

# Arrow operator (dynamic)
const key = "name";
System.out.console(person->key);
System.out.console(person->"age");

# Bracket notation (array-style)
System.out.console(person["name"]);
System.out.console(person[key]);

# Property mutation (requires mut)
person.age = 31;
person["name"] = "Bob";
person[key] = "Charlie";
```

### Procedures (Functions)
```misty
procedure multiply(a, b) {
  returns a * b;
}

# Closures and recursion
procedure fibonacci(n) {
  incase (n <= 1) {
    returns n;
  }
  returns fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Control Flow
```misty
# incase statements with else/elif
incase (score >= 90) {
  System.out.console("A");
} elif (score >= 80) {
  System.out.console("B");
} elif (score >= 70) {
  System.out.console("C");
} else {
  System.out.console("F");
}

# Comparison operators
x < 5    # Less than
x > 5    # Greater than
x == 5   # Equal (works with null)
x != 5   # Not equal

# Logical operators
(x > 5) && (y < 10)   # AND
(x > 5) || (y < 10)   # OR
!(x > 5)              # NOT
```

### Arrays
```misty
# Array literals
const arr = [1, 2, 3];

# Array indexing
System.out.console(arr[0]);  # Prints: 1
System.out.console(arr[2]);  # Prints: 3

# Array mutation (requires mut)
mut nums = [10, 20, 30];
nums[0] = 99;
nums[2] = 77;
System.out.console(nums[1]);  # Prints: 20

# Array properties
System.out.console(arr.length);  # Prints: 3

# Array methods
mut stack = [];
stack.push(1);        # Add to end → [1]
stack.push(2);        # Add to end → [1, 2]
const last = stack.pop();   # Remove from end → [1], returns 2
const first = stack.shift(); # Remove from start → [], returns 1
stack.unshift(0);     # Add to start → [0]

# Nested arrays
mut matrix = [[1, 2], [3, 4]];
matrix[0][1] = 5;
System.out.console(matrix[0][1]);  # Prints: 5
```

### Loops
```misty
# Traditional drift loop
mut sum = 0;
drift (mut i = 0; i < 5; i = i + 1) {
  sum = sum + i;
}

# Drift-through loop (iterator)
const arr = [10, 20, 30];
drift (const num through arr) {
  System.out.console("Number: " + num);
}

# Break and continue
drift (mut i = 0; i < 10; i = i + 1) {
  incase (i == 5) {
    break;  # Exit loop early
  }
  incase (i == 3) {
    continue;  # Skip this iteration
  }
  System.out.console(i);
}

# Arrays can be mutated in loops
mut arr = [1, 2, 3];
drift (mut i = 0; i < 3; i = i + 1) {
  arr[i] = arr[i] * 2;
}
```

### Built-in Functions
```misty
System.out.console("Output text");
```

### Complete Example
```misty
# Fibonacci calculator
procedure fib(n) {
  incase (n <= 1) {
    returns n;
  }

  mut a = 0;
  mut b = 1;
  mut result = 0;

  drift (mut i = 2; i <= n; i = i + 1) {
    result = a + b;
    a = b;
    b = result;
  }

  returns result;
}

# Calculate and display
const nums = [5, 10, 15, 20];
drift (const n through nums) {
  System.out.console("fib(" + n + ") = " + fib(n));
}
```

## Type Safety

### Truthiness Rules
- Numbers: `0` is falsy, others truthy, `NaN` is falsy
- Strings: **Empty string `""` is truthy** (unlike JavaScript)
- Booleans: `true`/`false`
- Null: `null` and `nullptr` are falsy
- Arrays/Objects: Always truthy

### Type Restrictions
1. **`incase` requires boolean**: Only boolean expressions allowed
   ```misty
   incase (x > 5) { }      # ✅ OK
   incase (1) { }          # ❌ ERROR
   ```

2. **Null comparison restrictions**: Cannot use `<`, `>`, `<=`, `>=` with null
   ```misty
   x == null;   # ✅ OK
   x < null;    # ❌ ERROR
   ```

3. **Array-boolean restriction**: Cannot compare arrays to booleans
   ```misty
   arr && true;  # ❌ ERROR
   ```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server with hot reload:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the Misty playground.

### Building

Build the project for production:

```bash
npm run build
```

### Testing

Run the test suite:

```bash
npm test
```

Watch mode for tests:

```bash
npm run test:watch
```

### Build WebAssembly Module

Compile the AssemblyScript to WebAssembly:

```bash
npm run asbuild
```

This creates debug and release builds in the `build/` directory.

## Project Structure

```
misty/
├── src/              # Core language implementation
│   ├── lexer.ts      # Tokenization
│   ├── parser.ts     # AST generation
│   ├── ast.ts        # AST node types
│   └── interpreter.ts # Code execution
├── assembly/         # AssemblyScript WASM module
│   └── index.ts
├── ui/               # Preact web UI
│   ├── App.tsx
│   ├── Editor.tsx
│   ├── Output.tsx
│   └── style.css
├── test/             # Test suite
│   ├── lexer.test.ts
│   ├── parser.test.ts
│   └── interpreter.test.ts
└── index.html        # Entry point
```

## Implemented Features

### Language Features ✅
- [x] Lexer with comprehensive tokenization
- [x] Parser with precedence climbing
- [x] Interpreter with scoping and closures
- [x] Variables (const/mut) with reassignment
- [x] Procedures with parameters and recursion
- [x] Early return support
- [x] Objects (JSON-like syntax)
- [x] Arrays with literals
- [x] Dot notation (`obj.prop`)
- [x] Arrow operator (`obj->key`)
- [x] Bracket notation (`arr[0]`, `obj["key"]`)
- [x] Array indexing with expressions (`arr[i + 1]`)
- [x] Object/array property mutation (`obj.x = 5`, `arr[0] = 10`)
- [x] Nested array/object mutation
- [x] Array properties (`length`)
- [x] Array methods (`push`, `pop`, `shift`, `unshift`)
- [x] Null/nullptr support
- [x] NaN support
- [x] Arithmetic operators (`+`, `-`, `*`, `/`)
- [x] Comparison operators (`<`, `>`, `<=`, `>=`, `==`, `!=`)
- [x] Logical operators (`&&`, `||`, `!`)
- [x] Bitwise operators (`&`, `|`)
- [x] String concatenation
- [x] Control flow (`incase`, `elif`, `else`)
- [x] Drift loops (traditional and drift-through)
- [x] Loop control (`break`, `continue`)
- [x] Strict type checking for conditionals
- [x] Null safety (comparison restrictions)
- [x] Comments (`#`)

### Execution Features ✅
- [x] Web Worker execution (non-blocking UI)
- [x] Cancellable execution
- [x] Automatic worker respawn
- [x] Real-time execution notifications
- [x] Progress tracking (console logs)
- [x] Web-based playground with CodeMirror
- [x] Syntax highlighting
- [x] Error reporting with messages

### Performance & Architecture
- [x] Maximum recursion depth: ~2,145 calls
- [x] Early return mechanism for procedures
- [x] Environment-based variable scoping
- [x] Closure support with lexical scoping

## Roadmap

### Planned Features
- [ ] WebAssembly compilation (10-100x speedup)
- [ ] Additional array methods (slice, splice, map, filter, etc.)
- [ ] String methods (split, substring, etc.)
- [ ] Math library (sin, cos, sqrt, etc.)
- [ ] Type annotations
- [ ] Standard library expansion
- [ ] Module system
- [ ] Pattern matching
- [ ] Error handling (try/catch)
- [ ] Switch/match expressions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request

## License

LGPL-2.1-only

## Author

Rishabh Anand
