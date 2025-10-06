import type {
  ASTNode,
  ProgramNode,
  VariableDeclarationNode,
  AssignmentExpressionNode,
  MemberAssignmentNode,
  ProcedureDeclarationNode,
  CallExpressionNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  MemberExpressionNode,
  ComputedMemberExpressionNode,
  ArrayLiteralNode,
  ObjectLiteralNode,
  IncaseStatementNode,
  DriftLoopNode,
  DriftThroughLoopNode,
} from "./ast";

type MistyValue = number | string | boolean | null | MistyFunction | MistyObject | MistyArray;
type MistyArray = MistyValue[];

interface MistyFunction {
  parameters: string[];
  body: ASTNode[];
  closure: Environment;
}

interface MistyObject {
  [key: string]: MistyValue;
}

interface VariableInfo {
  value: MistyValue;
  isConstant: boolean;
}

// Special exception for early returns
class ReturnValue {
  constructor(public value: MistyValue) {}
}

// Special exceptions for loop control
class BreakException {}
class ContinueException {}

class Environment {
  private variables: Map<string, VariableInfo> = new Map();
  private parent: Environment | null = null;

  constructor(parent: Environment | null = null) {
    this.parent = parent;
  }

  define(name: string, value: MistyValue, isConstant: boolean = false): void {
    this.variables.set(name, { value, isConstant });
  }

  get(name: string): MistyValue {
    const varInfo = this.variables.get(name);
    if (varInfo) {
      return varInfo.value;
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  set(name: string, value: MistyValue): void {
    const varInfo = this.variables.get(name);
    if (varInfo) {
      if (varInfo.isConstant) {
        throw new Error(`Cannot assign to constant variable: ${name}`);
      }
      varInfo.value = value;
      return;
    }
    if (this.parent) {
      this.parent.set(name, value);
      return;
    }
    throw new Error(`Undefined variable: ${name}`);
  }
}

export class Interpreter {
  private globalEnv: Environment;
  private output: string[] = [];

  constructor() {
    this.globalEnv = new Environment();
    this.setupBuiltins();
  }

  private setupBuiltins(): void {
    // Setup System.out.console built-in
    const consoleFunction = (msg: MistyValue): void => {
      this.output.push(String(msg));
    };

    const systemOut: MistyObject = {
      console: consoleFunction as unknown as MistyValue,
    };

    const system: MistyObject = {
      out: systemOut as unknown as MistyValue,
    };

    this.globalEnv.define("System", system as unknown as MistyValue, true);
  }

  interpret(ast: ProgramNode): string {
    this.output = [];
    this.executeProgram(ast, this.globalEnv);
    return this.output.join("\n");
  }

  private executeProgram(program: ProgramNode, env: Environment): void {
    for (const statement of program.body) {
      this.execute(statement, env);
    }
  }

  private execute(node: ASTNode, env: Environment): MistyValue {
    switch (node.type) {
      case "Program":
        this.executeProgram(node, env);
        return 0;

      case "VariableDeclaration":
        return this.executeVariableDeclaration(node, env);

      case "AssignmentExpression":
        return this.executeAssignment(node, env);

      case "MemberAssignment":
        return this.executeMemberAssignment(node, env);

      case "ProcedureDeclaration":
        return this.executeProcedureDeclaration(node, env);

      case "ReturnStatement":
        throw new ReturnValue(this.evaluate(node.value, env));

      case "BreakStatement":
        throw new BreakException();

      case "ContinueStatement":
        throw new ContinueException();

      case "IncaseStatement":
        return this.executeIncaseStatement(node, env);

      case "CallExpression":
        return this.executeCallExpression(node, env);

      case "BinaryExpression":
        return this.executeBinaryExpression(node, env);

      case "UnaryExpression":
        return this.executeUnaryExpression(node, env);

      case "MemberExpression":
        return this.executeMemberExpression(node, env);

      case "ComputedMemberExpression":
        return this.executeComputedMemberExpression(node, env);

      case "NumberLiteral":
        return node.value;

      case "StringLiteral":
        return node.value;

      case "BooleanLiteral":
        return node.value;

      case "NullLiteral":
        return null;

      case "NaNLiteral":
        return NaN;

      case "ArrayLiteral":
        return this.executeArrayLiteral(node, env);

      case "ObjectLiteral":
        return this.executeObjectLiteral(node, env);

      case "DriftLoop":
        return this.executeDriftLoop(node, env);

      case "DriftThroughLoop":
        return this.executeDriftThroughLoop(node, env);

      case "Identifier":
        return env.get(node.name);

      default:
        throw new Error(`Unknown node type: ${(node as {type?: string}).type ?? 'unknown'}`);
    }
  }

  private evaluate(node: ASTNode, env: Environment): MistyValue {
    return this.execute(node, env);
  }

  private executeVariableDeclaration(node: VariableDeclarationNode, env: Environment): MistyValue {
    const value = this.evaluate(node.value, env);
    env.define(node.identifier, value, node.isConstant);
    return value;
  }

  private executeAssignment(node: AssignmentExpressionNode, env: Environment): MistyValue {
    const value = this.evaluate(node.value, env);
    env.set(node.identifier, value);
    return value;
  }

  private executeMemberAssignment(node: MemberAssignmentNode, env: Environment): MistyValue {
    const obj = this.evaluate(node.object, env);
    const value = this.evaluate(node.value, env);

    if (typeof obj !== "object" || obj === null) {
      throw new Error("Cannot assign property to non-object");
    }

    if (node.isComputed) {
      // arr[index] = value or obj[key] = value
      const property = this.evaluate(node.property as ASTNode, env);
      const key = String(property);
      (obj as MistyObject)[key] = value;
    } else {
      // obj.prop = value
      const key = node.property as string;
      (obj as MistyObject)[key] = value;
    }

    return value;
  }

  private executeProcedureDeclaration(node: ProcedureDeclarationNode, env: Environment): MistyValue {
    const func: MistyFunction = {
      parameters: node.parameters,
      body: node.body,
      closure: env,
    };
    env.define(node.name, func as unknown as MistyValue, true);
    return func as unknown as MistyValue;
  }

  private executeIncaseStatement(node: IncaseStatementNode, env: Environment): MistyValue {
    const condition = this.evaluate(node.condition, env);

    // Strict boolean check: incase only accepts boolean values
    if (typeof condition !== "boolean") {
      throw new Error(`Incase statement condition must be a boolean, got ${typeof condition}`);
    }

    if (condition) {
      let result: MistyValue = 0;
      for (const statement of node.body) {
        result = this.execute(statement, env);
      }
      return result;
    }

    // Check elif branches
    if (node.elifBranches) {
      for (const elifBranch of node.elifBranches) {
        const elifCondition = this.evaluate(elifBranch.condition, env);

        if (typeof elifCondition !== "boolean") {
          throw new Error(`Elif statement condition must be a boolean, got ${typeof elifCondition}`);
        }

        if (elifCondition) {
          let result: MistyValue = 0;
          for (const statement of elifBranch.body) {
            result = this.execute(statement, env);
          }
          return result;
        }
      }
    }

    // Execute else branch if no conditions matched
    if (node.elseBranch) {
      let result: MistyValue = 0;
      for (const statement of node.elseBranch) {
        result = this.execute(statement, env);
      }
      return result;
    }

    return 0;
  }

  private executeCallExpression(node: CallExpressionNode, env: Environment): MistyValue {
    const callee = this.evaluate(node.callee, env);

    // Handle built-in functions
    if (typeof callee === "function") {
      const args = node.arguments.map((arg) => this.evaluate(arg, env));
      return (callee as ((...args: MistyValue[]) => MistyValue))(...args);
    }

    // Handle user-defined procedures
    if (this.isFunction(callee)) {
      const func = callee;

      // Check if this is a built-in array method
      if ((func as any).__arrayMethod) {
        const methodName = (func as any).__arrayMethod;
        const arrayRef = (func as any).__arrayRef as MistyArray;
        const args = node.arguments.map((arg) => this.evaluate(arg, env));

        switch (methodName) {
          case "push":
            arrayRef.push(args[0]);
            return arrayRef.length;
          case "pop":
            return arrayRef.pop() ?? null;
          case "shift":
            return arrayRef.shift() ?? null;
          case "unshift":
            arrayRef.unshift(args[0]);
            return arrayRef.length;
          default:
            throw new Error(`Unknown array method: ${methodName}`);
        }
      }

      const args = node.arguments.map((arg) => this.evaluate(arg, env));

      if (args.length !== func.parameters.length) {
        throw new Error(`Expected ${func.parameters.length} arguments, got ${args.length}`);
      }

      const funcEnv = new Environment(func.closure);
      for (let i = 0; i < func.parameters.length; i++) {
        funcEnv.define(func.parameters[i], args[i]);
      }

      try {
        let result: MistyValue = 0;
        for (const statement of func.body) {
          result = this.execute(statement, funcEnv);
        }
        return result;
      } catch (err) {
        if (err instanceof ReturnValue) {
          return err.value;
        }
        throw err;
      }
    }

    throw new Error(`Cannot call non-function value`);
  }

  private executeBinaryExpression(node: BinaryExpressionNode, env: Environment): MistyValue {
    const left = this.evaluate(node.left, env);
    const right = this.evaluate(node.right, env);

    // String concatenation
    if (node.operator === "+" && (typeof left === "string" || typeof right === "string")) {
      return String(left) + String(right);
    }

    // Comparison operators - null checks
    if (node.operator === "<" || node.operator === ">" || node.operator === "<=" || node.operator === ">=") {
      if (left === null || right === null) {
        throw new Error(`Cannot compare null using ${node.operator} operator`);
      }

      if (typeof left === "number" && typeof right === "number") {
        if (node.operator === "<") return left < right;
        if (node.operator === ">") return left > right;
        if (node.operator === "<=") return left <= right;
        if (node.operator === ">=") return left >= right;
      }
      throw new Error(`Comparison operators require numbers`);
    }

    // Equality operators - allow null
    if (node.operator === "==") {
      return left === right;
    }
    if (node.operator === "!=") {
      return left !== right;
    }

    // Logical operators - return boolean
    if (node.operator === "&&") {
      // Check for array-boolean comparison
      if (Array.isArray(left) && typeof right === "boolean") {
        throw new Error(`Cannot compare array to boolean`);
      }
      if (typeof left === "boolean" && Array.isArray(right)) {
        throw new Error(`Cannot compare boolean to array`);
      }
      return this.isTruthy(left) && this.isTruthy(right);
    }
    if (node.operator === "||") {
      // Check for array-boolean comparison
      if (Array.isArray(left) && typeof right === "boolean") {
        throw new Error(`Cannot compare array to boolean`);
      }
      if (typeof left === "boolean" && Array.isArray(right)) {
        throw new Error(`Cannot compare boolean to array`);
      }
      return this.isTruthy(left) || this.isTruthy(right);
    }

    // Bitwise operators
    if (node.operator === "&") {
      return (left as number) & (right as number);
    }
    if (node.operator === "|") {
      return (left as number) | (right as number);
    }

    // Numeric operations
    if (typeof left === "number" && typeof right === "number") {
      switch (node.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        default:
          throw new Error(`Unknown operator: ${String(node.operator)}`);
      }
    }

    throw new Error(`Cannot perform operation on incompatible types`);
  }

  private executeUnaryExpression(node: UnaryExpressionNode, env: Environment): MistyValue {
    const argument = this.evaluate(node.argument, env);

    if (node.operator === "!") {
      return !this.isTruthy(argument);
    }

    if (node.operator === "-") {
      return -(argument as number);
    }

    throw new Error(`Unknown unary operator: ${String(node.operator)}`);
  }

  private executeMemberExpression(node: MemberExpressionNode, env: Environment): MistyValue {
    const object = this.evaluate(node.object, env);

    if (typeof object === "object" && object !== null) {
      // Check for array methods
      if (Array.isArray(object)) {
        if (node.property === "length") {
          return object.length;
        }
        // Return built-in array methods as callable functions
        if (node.property === "push" || node.property === "pop" || node.property === "shift" || node.property === "unshift") {
          return this.createArrayMethod(object, node.property);
        }
      }

      const obj = object as MistyObject;
      return obj[node.property];
    }

    throw new Error(`Cannot access property ${node.property} on non-object`);
  }

  private executeComputedMemberExpression(node: ComputedMemberExpressionNode, env: Environment): MistyValue {
    const object = this.evaluate(node.object, env);
    const property = this.evaluate(node.property, env);

    if (typeof object === "object" && object !== null) {
      const obj = object as MistyObject;
      const key = String(property);
      return obj[key];
    }

    throw new Error(`Cannot access computed property on non-object`);
  }

  private executeArrayLiteral(node: ArrayLiteralNode, env: Environment): MistyValue {
    const elements: MistyValue[] = [];
    for (const elem of node.elements) {
      elements.push(this.evaluate(elem, env));
    }
    return elements;
  }

  private executeObjectLiteral(node: ObjectLiteralNode, env: Environment): MistyValue {
    const obj: MistyObject = {};
    for (const prop of node.properties) {
      obj[prop.key] = this.evaluate(prop.value, env);
    }
    return obj as unknown as MistyValue;
  }

  private executeDriftLoop(node: DriftLoopNode, env: Environment): MistyValue {
    // Create new scope for loop
    const loopEnv = new Environment(env);

    // Execute initialization
    this.execute(node.init, loopEnv);

    // Loop while condition is true
    while (this.isTruthy(this.evaluate(node.condition, loopEnv))) {
      try {
        // Execute loop body
        for (const statement of node.body) {
          this.execute(statement, loopEnv);
        }
      } catch (err) {
        if (err instanceof BreakException) {
          break; // Exit the loop
        } else if (err instanceof ContinueException) {
          // Continue to next iteration (skip update and go to condition check)
          this.execute(node.update, loopEnv);
          continue;
        }
        throw err; // Re-throw other exceptions
      }

      // Execute update
      this.execute(node.update, loopEnv);
    }

    return 0;
  }

  private executeDriftThroughLoop(node: DriftThroughLoopNode, env: Environment): MistyValue {
    const iterable = this.evaluate(node.iterable, env);

    if (!Array.isArray(iterable)) {
      throw new Error("Can only iterate through arrays in drift-through loop");
    }

    const array = iterable;

    for (const item of array) {
      // Create new scope for each iteration
      const loopEnv = new Environment(env);
      loopEnv.define(node.variable, item, node.isConstant);

      try {
        // Execute loop body
        for (const statement of node.body) {
          this.execute(statement, loopEnv);
        }
      } catch (err) {
        if (err instanceof BreakException) {
          break; // Exit the loop
        } else if (err instanceof ContinueException) {
          continue; // Skip to next iteration
        }
        throw err; // Re-throw other exceptions
      }
    }

    return 0;
  }

  private createArrayMethod(arr: MistyArray, methodName: string): MistyValue {
    // Return a special function that operates on the array
    const method: MistyFunction = {
      parameters: methodName === "push" || methodName === "unshift" ? ["value"] : [],
      body: [],
      closure: new Environment(this.globalEnv),
    };

    // Mark this as a built-in array method by adding metadata
    (method as any).__arrayMethod = methodName;
    (method as any).__arrayRef = arr;

    return method as unknown as MistyValue;
  }

  private isTruthy(value: MistyValue): boolean {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "number") {
      // 0 is falsy, any other number (including 1) is truthy
      // NaN is falsy
      if (isNaN(value)) return false;
      return value !== 0;
    }
    if (typeof value === "string") {
      // Empty string is truthy in Misty (unlike JavaScript)
      return true;
    }
    if (value === null) {
      return false;
    }
    // Arrays and objects are truthy
    return true;
  }

  private isFunction(value: MistyValue): value is MistyFunction {
    return typeof value === "object" && value !== null && "parameters" in value && "body" in value && "closure" in value;
  }

  getOutput(): string[] {
    return this.output;
  }
}
