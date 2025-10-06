import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { Interpreter } from "../src/interpreter";

describe("Interpreter", () => {
  function run(source: string): string {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return interpreter.interpret(ast);
  }

  it("evaluates constant declarations", () => {
    const source = "const x = 5;";
    const result = run(source);
    expect(result).to.equal("");
  });

  it("evaluates mutable variable declarations", () => {
    const source = "mut a = 4;";
    const result = run(source);
    expect(result).to.equal("");
  });

  it("evaluates arithmetic expressions", () => {
    const source = `
      const x = 5;
      const y = 3;
      const result = x + y;
    `;
    const result = run(source);
    expect(result).to.equal("");
  });

  it("evaluates multiplication with correct precedence", () => {
    const source = `
      const result = 2 + 3 * 4;
      System.out.console(result);
    `;
    const result = run(source);
    expect(result).to.equal("14");
  });

  it("evaluates string concatenation", () => {
    const source = `
      const msg = "Hello" + " " + "World";
      System.out.console(msg);
    `;
    const result = run(source);
    expect(result).to.equal("Hello World");
  });

  it("evaluates procedure declarations and calls", () => {
    const source = `
      procedure multiply(a, b) {
        returns a * b;
      }
      const result = multiply(5, 4);
      System.out.console(result);
    `;
    const result = run(source);
    expect(result).to.equal("20");
  });

  it("evaluates the example from requirements", () => {
    const source = `
      const x = 5;
      mut a = 4;

      procedure multiply(a, b) {
        returns a * b;
      }

      System.out.console("Multiply 2 numbers: " + x + ", " + a + " = " + multiply(x, a));
    `;
    const result = run(source);
    expect(result).to.equal("Multiply 2 numbers: 5, 4 = 20");
  });

  it("evaluates number to string concatenation", () => {
    const source = `
      const x = 5;
      System.out.console("Value: " + x);
    `;
    const result = run(source);
    expect(result).to.equal("Value: 5");
  });

  it("evaluates nested function calls", () => {
    const source = `
      procedure add(a, b) {
        returns a + b;
      }

      procedure multiply(a, b) {
        returns a * b;
      }

      const result = multiply(add(2, 3), 4);
      System.out.console(result);
    `;
    const result = run(source);
    expect(result).to.equal("20");
  });

  it("evaluates decimal numbers", () => {
    const source = `
      const pi = 3.14;
      const radius = 2;
      const area = pi * radius * radius;
      System.out.console(area);
    `;
    const result = run(source);
    expect(result).to.equal("12.56");
  });
});
