# lucy

## 快速使用

iife: https://linyuan-code.github.io/lucy/dist/index.iife.js
esm: https://linyuan-code.github.io/lucy/dist/index.esm.js

npm(case vue):
npm/pnpm i lucy-compiler

```javascript
import lucy from "lucy-compiler";
const ll1Parser = new lucy.LL1Parser(
  testCase.terminals,
  testCase.nonTerminals,
  testCase.grammers
);
```

## demo website

open https://linyuan-code.github.io/lucy/demo/index.html in browser and open debug-tool-console

## 词法分析

使用 JS 的原生正则表达式进行词法分析

## 语法分析

### LL(1)

```javascript
let grammers = [
  "S  =>  AB",
  "S  =>  SCa | h",
  "S =>  AACB | AAdd",
  "C  =>  b",
  "C => l",
  "A => a",
  "B => b",
  "C => c",
];
// 合并(A => a , A => b   === A => a | b),并简单去重
if (lucy.checkNeedunionGrammers(grammers)) {
  grammers = lucy.unionGrammers(grammers);
  console.log("[unionGrammers]", grammers);
}
// 提左公因子
if (lucy.checkNeedliftUpCommonTocken(grammers)) {
  grammers = lucy.liftUpCommonTocken(grammers);
  console.log("[liftUpCommonTocken]", grammers);
}

// 消除左递归
if (lucy.checkNeedClearRightRecursion(grammers)) {
  grammers = lucy.clearRightRecursion(grammers);
  console.log("[clearRightRecursion]", grammers);
}
```

```javascript
const testCase = {
  nonTerminals: ["E'", "E", "T'", "T", "F"],
  terminals: [
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
const ll1Parser = new lucy.LL1Parser(
  testCase.terminals,
  testCase.nonTerminals,
  testCase.grammers
);
const firstSet = ll1Parser.getFirstSet();
const followSet = ll1Parser.getFollowSet(firstSet);
const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
const predictResult = ll1Parser.getPredictProcess(
  "11 + 22 * 33",
  "E",
  predictTable
);
```

如果你的文法是教学意义的简单文法，如下格式
非终结符: A B .... A' B' A'' A''' ...
终结符: 小写字母 以及 Greek Symbols () a b c ε μ ....
那么只需要输入文法串即可自动获得对应的 noTerminals 和 terminals 集合

```javascript
const grammers = [
  "S  =>  AB",
  "A  =>  Ca | ε",
  "B  =>  cB'",
  "B' =>  aACB' | ε",
  "C  =>  b | ε",
];
const { nonTerminals, terminals } = lucy.getTockFromSimpleGrammers(grammers);
const ll1Parser = new lucy.LL1Parser(terminals, nonTerminals, grammers);
const firstSet = ll1Parser.getFirstSet();
const followSet = ll1Parser.getFollowSet(firstSet);
const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
// 按步骤生成
for (let process of ll1Parser.getFirstSetProgressive()) {
  console.log(process);
}
for (let process of ll1Parser.getFollowSetProgressive(firstSet)) {
  console.log(process);
}
for (let process of ll1Parser.getPredictTableProgressive(firstSet, followSet)) {
  console.log(process);
}
```

### LR


```javascript
let grammers = [
    "E  =>  E + T | T",
    "T => T * F | F",
    "F => (E) | id",
]
// log.logTo(nullLogChannel);
const lRParser = new lucy.LRParser();
const nonTerminals = ["E","T","F"];
const terminals: [string,RegExp][] = [["+",/^\+/],["*",/^\*/],["(",/^\(/],[")",/^\)/],["id",/^id/]];
lRParser.generateState(grammers,"E",nonTerminals,terminals);
const stateNode = lRParser.stateGraph;
const predictTable = lRParser.generateSLR1PredictTable();
console.log(stateNode,predictTable);
const predictResult = lRParser.predictInput("id * id + id",predictTable);
console.log(predictResult);
```