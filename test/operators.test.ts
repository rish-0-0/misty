import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { Interpreter } from "../src/interpreter";

describe("Comparison and Logical Operators", () => {
  function run(source: string): string {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return interpreter.interpret(ast);
  }

  describe("Comparison Operators", () => {
    it("evaluates less than operator", () => {
      const source = `
        const result = 5 < 10;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates greater than operator", () => {
      const source = `
        const result = 10 > 5;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates less than or equal operator", () => {
      const source = `
        const result = 5 <= 5;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates greater than or equal operator", () => {
      const source = `
        const result = 10 >= 5;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates equality operator", () => {
      const source = `
        const result = 5 == 5;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates inequality operator", () => {
      const source = `
        const result = 5 != 10;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });
  });

  describe("Logical Operators", () => {
    it("evaluates logical AND", () => {
      const source = `
        const result = 1 && 1;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates logical OR", () => {
      const source = `
        const result = 0 || 1;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates logical NOT", () => {
      const source = `
        const result = !(5 < 3);
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });

    it("evaluates complex logical expressions", () => {
      const source = `
        const result = (5 < 10) && (10 > 3);
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("true");
    });
  });

  describe("Bitwise Operators", () => {
    it("evaluates bitwise AND", () => {
      const source = `
        const result = 5 & 3;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("1");
    });

    it("evaluates bitwise OR", () => {
      const source = `
        const result = 5 | 3;
        System.out.console(result);
      `;
      const result = run(source);
      expect(result).to.equal("7");
    });
  });
});
