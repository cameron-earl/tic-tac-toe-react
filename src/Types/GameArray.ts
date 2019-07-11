import { SquareVal } from './SquareVal';

export type Line = [SquareVal, SquareVal, SquareVal];

export type GameArray = [Line, Line, Line];

export const newGameArray = (): GameArray => [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
