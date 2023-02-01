# lucy

## 快速使用

iife: https://linyuan-code.github.io/lucy/dist/index.iife.js
esm: https://linyuan-code.github.io/lucy/dist/index.esm.js

## demo website

open https://linyuan-code.github.io/lucy/demo/index.html in browser and open debug-tool-console

## 词法分析

使用 JS 的原生正则表达式进行词法分析

## 语法分析

### LL(1)

```javascript
const testCase = {
  nonTerminalSymbol: ["E'", "E", "T'", "T", "F"],
  terminalsSet: [
    ["ε", /^ε/],
    ["int", /^(0|[1-9][0-9]*)/],
    ["+", /^\+/],
    ["*", /^\*/],
    ["(", /^\(/],
    [")", /^\)/],
  ],
  grammers: [
    "E  =>  T E'",
    "E' =>  + T E' | ε",
    "T  =>  F T'",
    "T' =>  * F T' | ε",
    "F  => ( E ) | int",
  ],
};
const ll0Parser = new LL0Parser(
  testCase.terminalsSet,
  testCase.nonTerminalSymbol,
  testCase.grammers
);
const firstSet = ll0Parser.getFirstSet();
const followSet = ll0Parser.getFollowSet(firstSet);
const predictTable = ll0Parser.getPredictTable(firstSet, followSet);
const predictResult = ll0Parser.getPredictProcess(
  "11 + 22 * 33",
  "E",
  predictTable
);
```

### LR(1)
