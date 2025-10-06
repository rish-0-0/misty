import { describe, it } from "mocha";
import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { Interpreter } from "../src/interpreter";

describe("Chained Function Calls", () => {
  it("supports simple chained calls f(x)(y)", () => {
    const code = `
      procedure makeAdder(x) {
        procedure add(y) {
          returns x + y;
        }
        returns add;
      }

      const add5 = makeAdder(5);
      const result = add5(10);
      System.out.console(result);
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const output = interpreter.interpret(ast);

    expect(output).to.equal("15");
  });

  it("supports direct chained calls f(x)(y)", () => {
    const code = `
      procedure makeAdder(x) {
        procedure add(y) {
          returns x + y;
        }
        returns add;
      }

      const result = makeAdder(5)(10);
      System.out.console(result);
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const output = interpreter.interpret(ast);

    expect(output).to.equal("15");
  });

  it("supports higher-order functions with closures", () => {
    const code = `
      procedure f(c, d) {
        procedure g(a, b) {
          returns a + b + c + d;
        }
        returns g;
      }

      const result = f(2, 3)(4, 5);
      System.out.console(result);
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const output = interpreter.interpret(ast);

    expect(output).to.equal("14");
  });

  it("supports triple chained calls f(x)(y)(z)", () => {
    const code = `
      procedure f(a) {
        procedure g(b) {
          procedure h(c) {
            returns a + b + c;
          }
          returns h;
        }
        returns g;
      }

      const result = f(1)(2)(3);
      System.out.console(result);
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const output = interpreter.interpret(ast);

    expect(output).to.equal("6");
  });

  it("supports chained calls in expressions", () => {
    const code = `
      procedure makeMultiplier(x) {
        procedure multiply(y) {
          returns x * y;
        }
        returns multiply;
      }

      const result = makeMultiplier(3)(4) + makeMultiplier(2)(5);
      System.out.console(result);
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const output = interpreter.interpret(ast);

    expect(output).to.equal("22");
  });
});
