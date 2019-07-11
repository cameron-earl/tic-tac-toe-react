import { GameArray } from '../Types/GameArray';
import { SquareVal, XO } from '../Types/SquareVal';
import { Coord, lineIndex } from '../Types/WinningCoords';
import {
  areOpposites,
  cornerCoords,
  getOppositeCorner,
  getValCoords,
  isCorner,
  isMiddle,
  isSide,
  middleCoord,
  shareLine,
  sideCoords,
  updateGameArr,
  ValCoords,
} from './gameUtils';
import { randElement, randInt } from './helpers';

type MoveObject = {
  row: lineIndex;
  col: lineIndex;
  wins: boolean;
  oppWins: boolean;
  setsOfOne: number;
  setsOfTwo: number;
  oppSetsOfTwo: number;
  blocks: number;
};

type Strategy = (moveArr: MoveObject[], gameArr?: GameArray, valCoords?: ValCoords) => Coord;

export class CPU {
  private strategy: Strategy;
  public name: string;

  constructor(strategy: Strategy, name: string) {
    this.strategy = strategy;
    this.name = `CPU (${name})`;
  }

  public makeMove = (gameArr: GameArray): GameArray => {
    const valCoords: ValCoords = getValCoords(gameArr);

    const currentSymbol: XO = valCoords.X.length > valCoords.O.length ? 'O' : 'X';

    let moveCoord: Coord;
    if (valCoords._.length === 1) {
      moveCoord = valCoords._[0];
    } else {
      const moveArr: MoveObject[] = valCoords._.map(coord => CPU.createMoveObj(gameArr, coord, currentSymbol));
      moveCoord = this.strategy(moveArr, gameArr, valCoords);
    }

    const newGameArr = updateGameArr(gameArr, moveCoord[0], moveCoord[1], currentSymbol);

    return newGameArr;
  };

  private static createMoveObj = (gameArr: GameArray, coord: Coord, sym: XO): MoveObject => {
    const oppSym = sym === 'X' ? 'O' : 'X';
    const obj = {
      row: coord[0],
      col: coord[1],
      wins: false,
      oppWins: false,
      setsOfOne: 0,
      setsOfTwo: 0,
      blocks: 0,
      oppSetsOfTwo: 0,
    };
    const [row, col] = coord;
    const isInLeftDiag = row === col;
    const isInRightDiag = row + col === 2;

    const rowCounts = { X: 0, O: 0, _: 0 };
    for (let c = 0; c <= 2; c++) {
      if (c === col) continue;
      rowCounts[gameArr[row][c]]++;
    }
    const colCounts = { X: 0, O: 0, _: 0 };
    for (let r = 0; r <= 2; r++) {
      if (r === row) continue;
      colCounts[gameArr[r][col]]++;
    }
    const lDiagCounts = { X: 0, O: 0, _: 0 };
    for (let rc = 0; isInLeftDiag && rc <= 2; rc++) {
      if (rc === row && rc === col) continue;
      lDiagCounts[gameArr[rc][rc]]++;
    }
    const rDiagCounts = { X: 0, O: 0, _: 0 };
    for (let rc = 0; isInRightDiag && rc <= 2; rc++) {
      if (rc === row && 2 - rc === col) continue;
      rDiagCounts[gameArr[rc][2 - rc]]++;
    }

    const n = (b: boolean) => (b ? 1 : 0);
    const sumCondition = (conditions: { [key: string]: number }): number => {
      const counts = [rowCounts, colCounts, lDiagCounts, rDiagCounts];
      return counts.reduce(
        (sum, countObj) =>
          sum + n(Object.keys(conditions).every(key => countObj[key as SquareVal] === conditions[key as SquareVal])),
        0
      );
    };
    obj.wins = !!sumCondition({ [sym]: 2 });
    obj.oppWins = !!sumCondition({ [oppSym]: 2 });
    obj.setsOfOne = sumCondition({ _: 2 });
    obj.setsOfTwo = sumCondition({ _: 1, [sym]: 1 });
    obj.oppSetsOfTwo = sumCondition({ _: 1, [oppSym]: 1 });
    obj.blocks = sumCondition({ _: 1, [oppSym]: 1 });
    return obj;
  };
}

const random: Strategy = moveArr => {
  const moveIndex = randInt(0, moveArr.length - 1);
  const move = moveArr[moveIndex];
  return [move.row, move.col];
};

const first: Strategy = moveArr => {
  const move = moveArr[0];
  return [move.row, move.col];
};

const easy: Strategy = moveArr => {
  const scores = moveArr.map(m => +m.wins * 50 + +m.oppWins * 15);
  const maxScore = Math.max(...scores);
  const bestMoves = moveArr.filter((m, i) => scores[i] === maxScore);
  return random(bestMoves);
};

const medium: Strategy = moveArr => {
  const obviousScores = moveArr.map(m => +m.wins * 50 + +m.oppWins * 15);
  const maxScore = Math.max(...obviousScores);
  const bestMoves = moveArr.filter((m, i) => obviousScores[i] === maxScore);
  if (bestMoves.length < moveArr.length) {
    return random(bestMoves);
  }

  const scores = moveArr.map(m => (+m.wins * 50 + +m.oppWins * 15 + m.setsOfOne + m.setsOfTwo * 2 + m.blocks) ** 2);
  const sum = scores.reduce((sum, score) => sum + score);
  let rand = randInt(0, sum - 1);
  for (let i = 0; i < scores.length; i++) {
    if (rand < scores[i]) return [moveArr[i].row, moveArr[i].col];
    rand -= scores[i];
  }
  return random(moveArr);
};

const hard: Strategy = moveArr => {
  const scores = moveArr.map(
    m => +m.wins * 50 + +m.oppWins * 15 + m.setsOfOne + m.setsOfTwo * 2 + m.blocks + m.oppSetsOfTwo * 2
  );
  const maxScore = Math.max(...scores);
  const bestMoves = moveArr.filter((m, i) => scores[i] === maxScore);
  return random(bestMoves);
};

const perfect: Strategy = (moveArr, gameArr, valCoords) => {
  // The first couple moves are the only situations where hard doesn't act optimally
  if (gameArr && valCoords) {
    if (valCoords.X.length === 0) {
      return randElement(cornerCoords);
    } else if (valCoords.O.length === 0) {
      if (isMiddle(valCoords.X[0])) {
        return randElement(cornerCoords);
      }
    } else if (valCoords.X.length === 1) {
      const oppositeCorner = getOppositeCorner(valCoords.X[0]);
      if (!oppositeCorner) return hard(moveArr);
      const x = valCoords.X[0];
      const o = valCoords.O[0];
      if (isMiddle(o)) {
        return oppositeCorner;
      } else if (isSide(o)) {
        return middleCoord;
      } else if (isCorner(o)) {
        // return random open adjacent corner
        const notX = (c: Coord): boolean => !(c[0] === x[0] && c[1] === x[1]);
        const notO = (c: Coord): boolean => !(c[0] === o[0] && c[1] === o[1]);
        const notOpp = (c: Coord): boolean => !(c[0] === oppositeCorner[0] && c[1] === oppositeCorner[1]);
        return randElement(cornerCoords.filter(c => notX(c) && notO(c) && notOpp(c)));
      }
    } else if (valCoords.O.length === 1) {
      if (isMiddle(valCoords.O[0]) && !shareLine(valCoords.X[0], valCoords.X[1])) {
        if (areOpposites(valCoords.X[0], valCoords.X[1])) {
          return randElement(sideCoords);
        } else if (isCorner(valCoords.X[0]) && isSide(valCoords.X[1])) {
          const oppCorner = getOppositeCorner(valCoords.X[0]);
          if (oppCorner) return oppCorner;
        } else if (isCorner(valCoords.X[1]) && isSide(valCoords.X[0])) {
          const oppCorner = getOppositeCorner(valCoords.X[1]);
          if (oppCorner) return oppCorner;
        }
      }
    }
  }
  return hard(moveArr);
};

const strategies = [random, easy, medium, hard, perfect];

export const cpus: { [key: string]: CPU } = strategies.reduce((obj, s) => {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return { ...obj, [s.name]: new CPU(s, capitalize(s.name)) };
}, {});
