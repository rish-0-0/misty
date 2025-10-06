import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { Interpreter } from "../src/interpreter";

describe("Drift Loops", () => {
  function run(source: string): string {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return interpreter.interpret(ast);
  }

  describe("Traditional Drift Loop", () => {
    it("executes a simple counting loop", () => {
      const source = `
        mut sum = 0;
        drift (mut i = 0; i < 5; i = i + 1) {
          sum = sum + i;
        }
        System.out.console(sum);
      `;
      const result = run(source);
      expect(result).to.equal("10");
    });

    it("executes loop with step greater than 1", () => {
      const source = `
        mut count = 0;
        drift (mut i = 0; i < 10; i = i + 2) {
          count = count + 1;
        }
        System.out.console(count);
      `;
      const result = run(source);
      expect(result).to.equal("5");
    });

    it("handles countdown loops", () => {
      const source = `
        mut sum = 0;
        drift (mut i = 5; i > 0; i = i - 1) {
          sum = sum + i;
        }
        System.out.console(sum);
      `;
      const result = run(source);
      expect(result).to.equal("15");
    });

    it("handles empty loop body", () => {
      const source = `
        mut count = 0;
        drift (mut i = 0; i < 5; i = i + 1) {
        }
        System.out.console(count);
      `;
      const result = run(source);
      expect(result).to.equal("0");
    });

    it("allows nested drift loops", () => {
      const source = `
        mut sum = 0;
        drift (mut i = 0; i < 3; i = i + 1) {
          drift (mut j = 0; j < 2; j = j + 1) {
            sum = sum + 1;
          }
        }
        System.out.console(sum);
      `;
      const result = run(source);
      expect(result).to.equal("6");
    });

    it("loop variable is scoped to loop body", () => {
      const source = `
        drift (mut i = 0; i < 3; i = i + 1) {
          System.out.console(i);
        }
      `;
      const result = run(source);
      expect(result).to.equal("0\n1\n2");
    });
  });

  describe("Drift-Through Loop", () => {
    it("iterates through array elements", () => {
      const source = `
        const arr = [1, 2, 3, 4, 5];
        mut sum = 0;
        drift (const item through arr) {
          sum = sum + item;
        }
        System.out.console(sum);
      `;
      const result = run(source);
      expect(result).to.equal("15");
    });

    it("works with string arrays", () => {
      const source = `
        const names = ["Alice", "Bob", "Charlie"];
        drift (const name through names) {
          System.out.console(name);
        }
      `;
      const result = run(source);
      expect(result).to.equal("Alice\nBob\nCharlie");
    });

    it("handles empty arrays", () => {
      const source = `
        const arr = [];
        mut count = 0;
        drift (const item through arr) {
          count = count + 1;
        }
        System.out.console(count);
      `;
      const result = run(source);
      expect(result).to.equal("0");
    });

    it("loop variable is const and cannot be reassigned", () => {
      const source = `
        const arr = [1, 2, 3];
        drift (const item through arr) {
          item = 5;
        }
      `;
      expect(() => run(source)).to.throw("Cannot assign to constant variable");
    });

    it("can use mut in drift-through loop", () => {
      const source = `
        const arr = [1, 2, 3];
        drift (mut item through arr) {
          item = item * 2;
          System.out.console(item);
        }
      `;
      const result = run(source);
      expect(result).to.equal("2\n4\n6");
    });
  });
});
