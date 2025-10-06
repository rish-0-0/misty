export type ASTNode =
  | ProgramNode
  | VariableDeclarationNode
  | AssignmentExpressionNode
  | MemberAssignmentNode
  | ProcedureDeclarationNode
  | CallExpressionNode
  | BinaryExpressionNode
  | UnaryExpressionNode
  | MemberExpressionNode
  | ComputedMemberExpressionNode
  | NumberLiteralNode
  | StringLiteralNode
  | BooleanLiteralNode
  | NullLiteralNode
  | NaNLiteralNode
  | ArrayLiteralNode
  | ObjectLiteralNode
  | IdentifierNode
  | ReturnStatementNode
  | BreakStatementNode
  | ContinueStatementNode
  | IncaseStatementNode
  | DriftLoopNode
  | DriftThroughLoopNode;

export interface ProgramNode {
  type: "Program";
  body: ASTNode[];
}

export interface VariableDeclarationNode {
  type: "VariableDeclaration";
  isConstant: boolean;
  identifier: string;
  value: ASTNode;
}

export interface AssignmentExpressionNode {
  type: "AssignmentExpression";
  identifier: string;
  value: ASTNode;
}

export interface MemberAssignmentNode {
  type: "MemberAssignment";
  object: ASTNode;
  property: ASTNode | string;
  isComputed: boolean;
  value: ASTNode;
}

export interface ProcedureDeclarationNode {
  type: "ProcedureDeclaration";
  name: string;
  parameters: string[];
  body: ASTNode[];
}

export interface CallExpressionNode {
  type: "CallExpression";
  callee: ASTNode;
  arguments: ASTNode[];
}

export interface BinaryExpressionNode {
  type: "BinaryExpression";
  operator: "+" | "-" | "*" | "/" | "<" | ">" | "<=" | ">=" | "==" | "!=" | "&&" | "||" | "&" | "|";
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryExpressionNode {
  type: "UnaryExpression";
  operator: "!" | "-";
  argument: ASTNode;
}

export interface MemberExpressionNode {
  type: "MemberExpression";
  object: ASTNode;
  property: string;
}

export interface ComputedMemberExpressionNode {
  type: "ComputedMemberExpression";
  object: ASTNode;
  property: ASTNode;
}

export interface NumberLiteralNode {
  type: "NumberLiteral";
  value: number;
}

export interface StringLiteralNode {
  type: "StringLiteral";
  value: string;
}

export interface BooleanLiteralNode {
  type: "BooleanLiteral";
  value: boolean;
}

export interface NullLiteralNode {
  type: "NullLiteral";
}

export interface NaNLiteralNode {
  type: "NaNLiteral";
}

export interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export interface ReturnStatementNode {
  type: "ReturnStatement";
  value: ASTNode;
}

export interface BreakStatementNode {
  type: "BreakStatement";
}

export interface ContinueStatementNode {
  type: "ContinueStatement";
}

export interface IncaseStatementNode {
  type: "IncaseStatement";
  condition: ASTNode;
  body: ASTNode[];
  elifBranches?: { condition: ASTNode; body: ASTNode[] }[];
  elseBranch?: ASTNode[];
}

export interface ArrayLiteralNode {
  type: "ArrayLiteral";
  elements: ASTNode[];
}

export interface ObjectLiteralNode {
  type: "ObjectLiteral";
  properties: { key: string; value: ASTNode }[];
}

export interface DriftLoopNode {
  type: "DriftLoop";
  init: VariableDeclarationNode;
  condition: ASTNode;
  update: AssignmentExpressionNode;
  body: ASTNode[];
}

export interface DriftThroughLoopNode {
  type: "DriftThroughLoop";
  isConstant: boolean;
  variable: string;
  iterable: ASTNode;
  body: ASTNode[];
}
