"use strict";

var nm = require('./node-maker');

var ast = nm("ast", {
  Array: ["index", "isFrozen", "data"],
  Binding: ["index", "pattern", "value"],
  BinOp: ["index", "operator", "left", "right"],
  Block: ["index", "statements", "expression"],
  Call: ["index", "f", "args"],
  CallMethod: ["index", "obj", "prop", "args"],
  Debugger: ["index"],
  Declaration: ["index", "identifier"],
  ElseIf: ["index", "condition", "branch"],
  Error: ["index", "message"],
  ExprStmt: ["index", "expression"],
  False: ["index"],
  Function: ["index", "name", "parameters", "body"],
  GetIndex: ["index", "array", "arrayIndex"],
  GetMethod: ["index", "obj", "prop"],
  GetProperty: ["index", "obj", "prop"],
  Global: ["index"],
  Identifier: ["index", "data"],
  IdentifierExpression: ["index", "data"],
  If: ["index", "condition", "ifBranch", "elseIfs", "elseBranch"],
  Let: ["index", "binding"],
  Match: ["index", "expression", "clauses"],
  MatchClause: ["index", "pattern", "expression"],
  Module: ["index", "statements", "exports"],
  Negate: ["index", "expr"],
  Not: ["index", "expr"],
  Null: ["index"],
  Number: ["index", "data"],
  Object: ["index", "isFrozen", "data"],
  Operator: ["index", "data"],
  Pair: ["index", "key", "value"],
  Parameter: ["index", "identifier"],
  Parameters: ["index", "context", "positional", "slurpy"],
  PatternArray: ["index", "patterns"],
  PatternArraySlurpy: ["index", "patterns", "slurp"],
  PatternLiteral: ["index", "data"],
  PatternObject: ["index", "pairs"],
  PatternObjectPair: ["index", "key", "value"],
  PatternParenExpr: ["index", "expr"],
  PatternSimple: ["index", "identifier"],
  Require: ["index", "expr"],
  String: ["index", "data"],
  Throw: ["index", "exception"],
  True: ["index"],
  Try: ["index", "expr"],
  Undefined: ["index"],
});

module.exports = ast;
