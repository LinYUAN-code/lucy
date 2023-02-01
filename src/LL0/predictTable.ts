import { getDerivationFirstSet } from "@/firstSet";
import Lexer from "@/lexer";
import { EmptyCharacter } from "@/utils/const";
import log from "@/utils/log";

export default function generatorPredictTable(
  lexer: Lexer,
  grammers: Grammers,
  firstSet: GrammerSet,
  followSet: GrammerSet,
): PredictTable {
  /*
    对语法中的每条产生式： A -> u ：
      (1)对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = “A -> u” ；
      (2)若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = “A -> u” 
  */
  const predictTable: PredictTable = [];
  const nonTerminal2TableRowMap = new Map<NonTerminal, PredictLine>();
  lexer.nonTerminals.forEach(nonTerminal => {
    const tableLine = {
      nonTerminal: nonTerminal,
      terminal2Derivation: new Map<Terminal, Grammer>(),
    };
    nonTerminal2TableRowMap.set(nonTerminal, tableLine);
    predictTable.push(tableLine);
  })
  const nonTerminal2FirstSetMap = new Map<NonTerminal, GrammerSetLine>();
  const nonTerminal2FollowSetLine = new Map<NonTerminal, GrammerSetLine>();
  for (let setLine of followSet) {
    nonTerminal2FollowSetLine.set(setLine.tocken, setLine);
  }
  for (let setLine of firstSet) {
    nonTerminal2FirstSetMap.set(setLine.tocken, setLine);
  }
  grammers.forEach(grammer => {
    for (let derivation of grammer.derivations) {
      const derivationFirstSet = getDerivationFirstSet(lexer, derivation, nonTerminal2FirstSetMap);
      const tableLine = nonTerminal2TableRowMap.get(grammer.nonTerminal);
      log.log(derivationFirstSet);
      // (1)对 First(u) 中的所有终结符 a （不含 ε ），置 M[A, a] = “A -> u” ；
      for (let terminal of derivationFirstSet.terminals) {
        if (terminal === EmptyCharacter) continue;
        let cellGrammer: Grammer | undefined = tableLine?.terminal2Derivation.get(terminal);
        if (!cellGrammer) {
          cellGrammer = {
            nonTerminal: grammer.nonTerminal,
            derivations: []
          };
          tableLine?.terminal2Derivation.set(terminal, cellGrammer);
        }
        cellGrammer.derivations.push(derivation);
      }
      // (2)若 First(u) 含 ε ，则对 Follow(A) 中的所有符号 a （可含 $ ），置 M[A, a] = “A -> u” 
      if (derivationFirstSet.terminals.has(EmptyCharacter)) {
        for (let terminal of nonTerminal2FollowSetLine.get(grammer.nonTerminal)!.terminals) {
          let cellGrammer: Grammer | undefined = tableLine?.terminal2Derivation.get(terminal);
          if (!cellGrammer) {
            cellGrammer = {
              nonTerminal: grammer.nonTerminal,
              derivations: []
            };
            tableLine?.terminal2Derivation.set(terminal, cellGrammer);
          }
          cellGrammer.derivations.push(derivation);
        }
      }
    }
  })

  return predictTable;
}


export function checkPredickTableIsValid(lexer: Lexer, table: PredictTable): boolean {
  // 每一Cell最多只能有一个推导式 
  for (let terminal of lexer.terminals) {
    const tocken = terminal[0];
    table.forEach(tableLine => {
      const t2d = tableLine.terminal2Derivation.get(tocken);
      if (t2d) {
        if (t2d.derivations.length > 1) {
          return false;
        }
      }
    })
  }
  return true;
}