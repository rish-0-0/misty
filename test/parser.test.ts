import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import type { ProgramNode, VariableDeclarationNode, ProcedureDeclarationNode, BinaryExpressionNode, CallExpressionNode } from "../src/ast";

describe("Parser", () => {
  it("parses a constant declaration", () => {
    const source = "const x = 5;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.type).to.equal("Program");
    expect(ast.body.length).to.equal(1);

    const decl = ast.body[0] as VariableDeclarationNode;
    expect(decl.type).to.equal("VariableDeclaration");
    expect(decl.isConstant).to.be.true;
    expect(decl.identifier).to.equal("x");
    expect(decl.value.type).to.equal("NumberLiteral");
  });

  it("parses a mutable variable declaration", () => {
    const source = "mut a = 4;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const decl = ast.body[0] as VariableDeclarationNode;
    expect(decl.isConstant).to.be.false;
    expect(decl.identifier).to.equal("a");
  });

  it("parses string literals", () => {
    const source = 'const msg = "Hello";';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const decl = ast.body[0] as VariableDeclarationNode;
    expect(decl.value.type).to.equal("StringLiteral");
  });

  it("parses binary expressions", () => {
    const source = "const result = 2 + 3 * 4;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const decl = ast.body[0] as VariableDeclarationNode;
    const expr = decl.value as BinaryExpressionNode;

    expect(expr.type).to.equal("BinaryExpression");
    expect(expr.operator).to.equal("+");
    expect(expr.right.type).to.equal("BinaryExpression");
  });

  it("parses string concatenation", () => {
    const source = 'const msg = "Hello" + " " + "World";';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const decl = ast.body[0] as VariableDeclarationNode;
    const expr = decl.value as BinaryExpressionNode;

    expect(expr.type).to.equal("BinaryExpression");
    expect(expr.operator).to.equal("+");
  });

  it("parses procedure declarations", () => {
    const source = "procedure multiply(a, b) { returns a * b; }";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const proc = ast.body[0] as ProcedureDeclarationNode;
    expect(proc.type).to.equal("ProcedureDeclaration");
    expect(proc.name).to.equal("multiply");
    expect(proc.parameters).to.deep.equal(["a", "b"]);
    expect(proc.body.length).to.equal(1);
    expect(proc.body[0].type).to.equal("ReturnStatement");
  });

  it("parses function calls", () => {
    const source = "multiply(5, 4);";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const call = ast.body[0] as CallExpressionNode;
    expect(call.type).to.equal("CallExpression");
    expect(call.arguments.length).to.equal(2);
  });

  it("parses member expressions", () => {
    const source = "System.out.console(msg);";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const call = ast.body[0] as CallExpressionNode;
    expect(call.type).to.equal("CallExpression");
    expect(call.callee.type).to.equal("MemberExpression");
  });

  it("parses complex expressions", () => {
    const source = 'System.out.console("Result: " + (5 + 3));';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const call = ast.body[0] as CallExpressionNode;
    expect(call.type).to.equal("CallExpression");
    expect(call.arguments.length).to.equal(1);
    expect(call.arguments[0].type).to.equal("BinaryExpression");
  });
});
