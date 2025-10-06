# Misty Programming Language - Development Guide

## Overview
Misty is a simple programming language that compiles to WebAssembly, featuring a clean syntax with functional programming concepts.

## Project Structure
```
misty/
├── src/              # Core language implementation
│   ├── lexer.ts      # Tokenization
│   ├── parser.ts     # AST generation
│   ├── ast.ts        # AST node type definitions
│   ├── interpreter.ts # Runtime execution
│   └── index.ts      # Main exports
├── ui/               # Preact web interface
│   ├── App.tsx       # Main application component
│   ├── Editor.tsx    # Code editor component
│   ├── Output.tsx    # Output display component
│   └── style.css     # Styling
├── assembly/         # AssemblyScript WASM module
│   └── index.ts      # WASM entry point
├── test/             # Test suite (TDD approach)
│   ├── lexer.test.ts
│   ├── parser.test.ts
│   └── interpreter.test.ts
└── index.html        # Entry point
```

## Development Scripts

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for tests
```

### Linting
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting issues
```

### Development
```bash
npm run dev           # Start dev server at localhost:3000
npm run build         # Production build
npm run preview       # Preview production build
```

### WebAssembly
```bash
npm run asbuild       # Build WASM module (debug + release)
npm run asbuild:debug # Build debug WASM
npm run asbuild:release # Build optimized WASM
```

### Cleanup
```bash
npm run clean         # Remove build artifacts
```

## Language Features

### Variables
```misty
const x = 5;        # Immutable constant
mut a = 4;          # Mutable variable
```

### Assignment (Mutable Variables Only)
```misty
mut x = 5;
x = 10;             # OK
x = sum(2, 3);      # OK

const y = 5;
y = 10;             # ERROR: Cannot reassign constant
```

### Procedures (Functions)
```misty
procedure multiply(a, b) {
  returns a * b;
}

procedure add(a, b) {
  returns a + b;
}
```

### Arithmetic Operators
- `+` Addition / String concatenation
- `-` Subtraction
- `*` Multiplication
- `/` Division

### Comparison Operators
- `<` Less than (cannot use with null)
- `>` Greater than (cannot use with null)
- `<=` Less than or equal (cannot use with null)
- `>=` Greater than or equal (cannot use with null)
- `==` Equal (can use with null)
- `!=` Not equal (can use with null)

### Logical Operators
- `&&` Logical AND (returns boolean, arrays cannot be compared to booleans)
- `||` Logical OR (returns boolean, arrays cannot be compared to booleans)
- `!` Logical NOT

### Bitwise Operators
- `&` Bitwise AND
- `|` Bitwise OR

### Objects
```misty
# Object literals (JSON-like syntax)
const person = {
  name: "Alice",
  age: 30,
  address: {
    city: "NYC",
    zip: 10001
  }
};

# Dot notation (static property access)
System.out.console(person.name);
System.out.console(person.address.city);

# Arrow operator (dynamic property access)
person->"name"           # String literal key
person->keyVariable      # Variable containing key name
```

### Arrays
```misty
const arr = [1, 2, 3, 4, 5];
const mixed = [10, "hello", true, null];
```

### Null and NaN
```misty
const x = null;       # Null value
const y = nullptr;    # Also null (same as null)
const z = NaN;        # Not a Number

# Null can be compared with == and !=
x == null;            # true
x != null;            # false

# Null CANNOT be used with <, >, <=, >= (runtime error)
x < 5;                # ERROR: Cannot compare null
```

### Conditional Statements
```misty
# incase ONLY accepts boolean expressions (strict type checking)
incase (x < 12) {
  System.out.console("x is less than 12");
}

incase (x == null) {
  System.out.console("x is null");
}

# This will ERROR - incase requires boolean, not number
incase (5) {           # ERROR: Incase requires boolean
  System.out.console("Won't work");
}
```

**Important**: Misty only has `incase` statements, no else/elif constructs. The condition MUST be a boolean type.

### Built-in Functions
```misty
System.out.console("Output text");  # Print to console
```

### Comments
```misty
# This is a single-line comment
```

## ESLint Rules
- **No `any` types**: All types must be explicit
- **Explicit function return types**: Required for clarity
- **No unused variables**: Keep code clean
- **Prefer const**: Immutability by default

## Testing Philosophy
- **Test-Driven Development (TDD)**: Write tests first
- All features must have corresponding tests
- Tests are organized by component (lexer, parser, interpreter)
- Aim for 100% code coverage

## Code Style Guidelines
1. Use TypeScript strict mode
2. No `any` types - use proper typing
3. Explicit return types for all functions
4. Prefer `const` over `let`
5. No `var` - use `const` or `let`
6. Handle all edge cases explicitly

## Adding New Features

### Step 1: Update Lexer
Add new tokens in `src/lexer.ts`:
```typescript
export enum TokenType {
  // Add new token type
  NEW_TOKEN = "NEW_TOKEN"
}
```

### Step 2: Update AST
Add new node types in `src/ast.ts`:
```typescript
export interface NewNode {
  type: "NewNode";
  // properties...
}
```

### Step 3: Write Tests
Add tests in `test/*.test.ts` following TDD approach.

### Step 4: Update Parser
Implement parsing logic in `src/parser.ts`.

### Step 5: Update Interpreter
Implement execution logic in `src/interpreter.ts`.

### Step 6: Run Tests & Lint
```bash
npm test
npm run lint
```

## Current Implementation Status

### ✅ Completed
- Lexer with string, number, identifier tokenization
- Parser with precedence climbing for expressions
- Interpreter with variable scoping
- Procedure declarations and calls
- Arithmetic operations
- String concatenation
- Comments
- Assignment expressions
- Const mutation error checking
- Comparison operators (with null restrictions)
- Logical operators (with array-boolean restrictions)
- Bitwise operators
- `incase` conditional statements (strict boolean type checking)
- Arrays
- Objects (JSON-like syntax)
- Dot notation for object property access
- Arrow operator (`->`) for dynamic property access
- Null/nullptr support (unified null value)
- NaN support
- Drift loops (traditional and drift-through)
- Web-based playground with CodeMirror

### 📋 Planned
- Type system
- Standard library expansion
- Advanced WASM integration
- Optimizations
- Else/elif constructs (maybe)
- Break/continue statements

## Type System & Truthiness Rules

### Truthiness (for internal evaluation)
- **Numbers**: `0` is falsy, all other numbers (including `1`) are truthy, `NaN` is falsy
- **Strings**: Empty string `""` is **truthy** (unlike JavaScript)
- **Booleans**: `true` is truthy, `false` is falsy
- **Null**: `null` and `nullptr` are falsy
- **Arrays/Objects**: Always truthy

### Type Restrictions
1. **incase condition**: MUST be boolean type (not just truthy/falsy)
2. **Null comparisons**: `null` can only be used with `==` and `!=`, NOT with `<`, `>`, `<=`, `>=`
3. **Array-boolean comparisons**: Arrays cannot be compared with booleans in `&&` or `||` operations

## Error Handling
- Lexer errors: Unexpected characters, unterminated strings
- Parser errors: Syntax errors with line/column information
- Runtime errors: Type mismatches, undefined variables, const reassignment, null comparison errors, incase type errors

## Performance Considerations
- AST nodes are immutable
- Environment uses Map for O(1) lookups
- String concatenation handled efficiently
- WASM module for compute-intensive operations (future)

## Contributing
1. Write tests first (TDD)
2. Run `npm run lint` before committing
3. Ensure all tests pass
4. Update this documentation for new features
5. Follow the existing code style

## References
- [AssemblyScript Documentation](https://www.assemblyscript.org/)
- [Preact Documentation](https://preactjs.com/)
- [CodeMirror 6](https://codemirror.net/)
