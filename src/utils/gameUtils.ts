import { GameArray, Line } from '../Types/GameArray';
import { SquareVal, XO } from '../Types/SquareVal';
import { Coord, lineIndex, WinningCoords } from '../Types/WinningCoords';

type ValCounts = { [key in SquareVal]: number };
export type ValCoords = { [key in SquareVal]: Coord[] };

export const nextMove = (gameArr: GameArray): XO | null => {
  if (!gameArr || !gameArr[0]) return null;
  let xCount = 0;
  let oCount = 0;
  const blanks = [];

  for (let r = 0; r < gameArr.length; r++) {
    for (let c = 0; c < gameArr[0].length; c++) {
      if (gameArr[r][c] === 'X') xCount++;
      else if (gameArr[r][c] === 'O') oCount++;
      else if (gameArr[r][c] === '_') blanks.push([r, c]);
    }
  }

  if (!blanks.length) return null;

  return xCount > oCount ? 'O' : 'X';
};

export const updateGameArr = (gameArr: GameArray, r: lineIndex, c: lineIndex, val: XO): GameArray => {
  if (gameArr[r][c] !== '_') return gameArr;
  const newGameArr = [...gameArr] as GameArray;
  newGameArr[r] = [...gameArr[r].slice(0, c), val, ...gameArr[r].slice(c + 1)] as Line;
  return newGameArr as GameArray;
};

const isLineMatch = (line: Line): SquareVal | false => {
  if (line[0] !== '_' && line[0] === line[1] && line[0] === line[2]) {
    return line[0];
  } else return false;
};

export const isGameOver = (gameArr: GameArray): false | [SquareVal, WinningCoords | null] => {
  const counts = getValCounts(gameArr);
  if (counts.X < 3) return false;

  // check rows
  for (let r = 0; r < gameArr.length; r++) {
    const row = gameArr[r];
    const isMatch = isLineMatch(row);
    if (isMatch) return [isMatch, [[r, 0], [r, 1], [r, 2]] as WinningCoords];
  }

  // check cols
  for (let c = 0; c < gameArr.length; c++) {
    const col: Line = [gameArr[0][c], gameArr[1][c], gameArr[2][c]];
    const isMatch = isLineMatch(col);
    if (isMatch) return [isMatch, [[0, c], [1, c], [2, c]] as WinningCoords];
  }
  // check diagonals
  const diagCoords: WinningCoords[] = [[[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];
  for (let coords of diagCoords) {
    const coordToVal = (c: Coord) => gameArr[c[0]][c[1]];
    const isMatch = isLineMatch(coords.map(coordToVal) as Line);
    if (isMatch) return [isMatch, coords];
  }
  if (!counts._) return ['_', null];

  return false;
};

export const getValCounts = (gameArr: GameArray): ValCounts => {
  const counts: ValCounts = { X: 0, O: 0, _: 0 };

  for (let r = 0; r < gameArr.length; r++) {
    for (let c = 0; c < gameArr[0].length; c++) {
      counts[gameArr[r][c]]++;
    }
  }

  return counts;
};

export const getValCoords = (gameArr: GameArray): ValCoords => {
  const coords: ValCoords = { X: [], O: [], _: [] };

  for (let r = 0; r < gameArr.length; r++) {
    for (let c = 0; c < gameArr[0].length; c++) {
      coords[gameArr[r][c]].push([r as lineIndex, c as lineIndex]);
    }
  }

  return coords;
};

export const gameToString = (gameArr: GameArray): string => {
  let str = '';
  for (let r = 0; r < gameArr.length; r++) {
    for (let c = 0; c < gameArr[0].length; c++) {
      str += gameArr[r][c];
    }
  }
  return str;
};

export const cornerCoords: Coord[] = [[0, 0], [0, 2], [2, 0], [2, 2]];
export const sideCoords: Coord[] = [[0, 1], [1, 0], [1, 2], [2, 1]];
export const middleCoord: Coord = [1, 1];

export const isCorner = (coord: Coord): boolean => coord[0] !== 1 && coord[1] !== 1;
export const isSide = (coord: Coord): boolean => coord[0] !== coord[1] && (coord[0] === 1 || coord[1] === 1);
export const isMiddle = (coord: Coord): boolean => coord[0] === 1 && coord[1] === 1;

export const getOppositeCorner = (c: Coord): Coord | null => (isCorner(c) ? [c[0] ? 0 : 2, c[1] ? 0 : 2] : null);

export const areOpposites = (c1: Coord, c2: Coord): boolean => {
  const opp1 = getOppositeCorner(c1);
  if (!opp1) return false;
  return opp1[0] === c2[0] && opp1[1] === c2[1];
};

export const shareLine = (c1: Coord, c2: Coord): boolean => c1[0] === c2[0] || c1[1] === c2[1];
