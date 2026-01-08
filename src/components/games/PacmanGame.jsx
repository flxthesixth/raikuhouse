import { useState, useEffect, useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import './PacmanGame.css';

const CELL_SIZE = 20;
const MAZE_WIDTH = 19;
const MAZE_HEIGHT = 21;

const LEVEL_CONFIGS = [
  { baseSpeed: 120, powerSpeed: 80, ghostChaseChance: 0.6, powerDuration: 8000, name: "TRAINING GROUNDS" },
  { baseSpeed: 110, powerSpeed: 75, ghostChaseChance: 0.7, powerDuration: 7000, name: "SHADOW REALM" },
  { baseSpeed: 100, powerSpeed: 70, ghostChaseChance: 0.75, powerDuration: 6000, name: "DEMON'S LAIR" },
  { baseSpeed: 90, powerSpeed: 65, ghostChaseChance: 0.8, powerDuration: 5000, name: "NIGHTMARE ZONE" },
  { baseSpeed: 80, powerSpeed: 60, ghostChaseChance: 0.9, powerDuration: 4000, name: "FINAL BOSS" },
];

const MAZES = [
  // Level 1: TRAINING GROUNDS
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Level 2: SHADOW REALM
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 3, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 3, 1],
    [1, 2, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0, 1, 2, 1, 0, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 0, 1, 2, 1, 1, 0, 1, 0, 1, 1, 2, 1, 0, 1, 2, 1],
    [0, 2, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 2, 0],
    [1, 2, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 0, 0, 1, 0, 1, 0, 0, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 0, 1, 2, 1, 0, 1, 1, 1, 0, 1, 2, 1, 0, 1, 2, 1],
    [0, 2, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 2, 0],
    [1, 2, 1, 0, 1, 2, 1, 1, 0, 1, 0, 1, 1, 2, 1, 0, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0, 1, 2, 1, 0, 1, 2, 1],
    [1, 3, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 3, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Level 3: DEMON'S LAIR
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 3, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1],
    [0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0],
    [1, 1, 1, 2, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 2, 1, 1, 1],
    [0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0],
    [1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1],
    [0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0],
    [1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 3, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Level 4: NIGHTMARE ZONE
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 0, 1, 0, 1, 1, 2, 1, 1, 1, 2, 1],
    [0, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 0],
    [1, 1, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2, 1, 1, 1],
    [0, 0, 0, 2, 0, 2, 0, 0, 1, 0, 1, 0, 0, 2, 0, 2, 0, 0, 0],
    [1, 1, 1, 2, 1, 2, 1, 0, 1, 1, 1, 0, 1, 2, 1, 2, 1, 1, 1],
    [0, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 0],
    [1, 2, 1, 1, 1, 2, 1, 1, 0, 1, 0, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Level 5: FINAL BOSS
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1],
    [1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1],
    [0, 0, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 0, 0],
    [1, 1, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2, 1, 1, 1],
    [0, 0, 0, 2, 1, 2, 0, 0, 1, 0, 1, 0, 0, 2, 1, 2, 0, 0, 0],
    [1, 1, 1, 2, 1, 2, 1, 0, 1, 1, 1, 0, 1, 2, 1, 2, 1, 1, 1],
    [0, 0, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 0, 0],
    [1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1],
    [1, 3, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1, 3, 1],
    [1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

const getNextPosition = (x, y, dir) => {
  let newX = x;
  let newY = y;
  switch (dir) {
    case "up":
      newY--;
      break;
    case "down":
      newY++;
      break;
    case "left":
      newX--;
      break;
    case "right":
      newX++;
      break;
  }
  if (newX < 0) newX = MAZE_WIDTH - 1;
  if (newX >= MAZE_WIDTH) newX = 0;
  return { x: newX, y: newY };
};

const canMoveInMaze = (x, y, maze) => {
  if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) {
    return y === 9 && (x === -1 || x === MAZE_WIDTH);
  }
  return maze[y][x] !== 1;
};

const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

export default function PacmanGame() {
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [pacman, setPacman] = useState({ x: 9, y: 15, visualX: 9, visualY: 15 });
  const [direction, setDirection] = useState("right");
  const [nextDirection, setNextDirection] = useState(null);
  const [maze, setMaze] = useState(() => MAZES[0].map((row) => [...row]));
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState("ready");
  const [powerMode, setPowerMode] = useState(false);
  const [ghosts, setGhosts] = useState([
    { x: 8, y: 9, visualX: 8, visualY: 9, direction: "left", color: "#FF0000", scared: false },
    { x: 9, y: 9, visualX: 9, visualY: 9, direction: "up", color: "#00FFFF", scared: false },
    { x: 10, y: 9, visualX: 10, visualY: 9, direction: "right", color: "#FFB8FF", scared: false },
    { x: 9, y: 10, visualX: 9, visualY: 10, direction: "down", color: "#FFB852", scared: false },
  ]);
  const [isInvincible, setIsInvincible] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(true);
  const [showRaikuMode, setShowRaikuMode] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [deathEffect, setDeathEffect] = useState(false);
  const [killEffect, setKillEffect] = useState(false);
  const [killScore, setKillScore] = useState({ show: false, x: 0, y: 0 });

  const gameContainerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const powerModeRef = useRef(null);
  const touchStartRef = useRef(null);
  const canvasRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const animationProgressRef = useRef(1);
  
  const levelRef = useRef(1);
  const directionRef = useRef("right");
  const nextDirectionRef = useRef(null);
  const pacmanRef = useRef({ x: 9, y: 15, visualX: 9, visualY: 15, prevX: 9, prevY: 15, isTeleporting: false });
  const mazeRef = useRef(MAZES[0].map((row) => [...row]));
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const totalScoreRef = useRef(0);
  const powerModeStateRef = useRef(false);
  const ghostsRef = useRef([
    { x: 8, y: 9, visualX: 8, visualY: 9, direction: "left", color: "#FF0000", scared: false },
    { x: 9, y: 9, visualX: 9, visualY: 9, direction: "up", color: "#00FFFF", scared: false },
    { x: 10, y: 9, visualX: 10, visualY: 9, direction: "right", color: "#FFB8FF", scared: false },
    { x: 9, y: 10, visualX: 9, visualY: 10, direction: "down", color: "#FFB852", scared: false },
  ]);
  const isInvincibleRef = useRef(false);
  const gameSpeedRef = useRef(LEVEL_CONFIGS[0].baseSpeed);

  const initLevel = useCallback((lvl) => {
    const config = LEVEL_CONFIGS[lvl - 1];
    const newMaze = MAZES[lvl - 1].map((row) => [...row]);
    
    setPacman({ x: 9, y: 15, visualX: 9, visualY: 15 });
    pacmanRef.current = { x: 9, y: 15, visualX: 9, visualY: 15, prevX: 9, prevY: 15, isTeleporting: false };
    setDirection("right");
    directionRef.current = "right";
    setNextDirection(null);
    nextDirectionRef.current = null;
    setMaze(newMaze);
    mazeRef.current = newMaze;
    setScore(0);
    scoreRef.current = 0;
    setPowerMode(false);
    powerModeStateRef.current = false;
    setIsInvincible(false);
    isInvincibleRef.current = false;
    gameSpeedRef.current = config.baseSpeed;
    animationProgressRef.current = 1;
    setShowRaikuMode(false);
    
    const initialGhosts = [
      { x: 8, y: 9, visualX: 8, visualY: 9, direction: "left", color: "#FF0000", scared: false },
      { x: 9, y: 9, visualX: 9, visualY: 9, direction: "up", color: "#00FFFF", scared: false },
      { x: 10, y: 9, visualX: 10, visualY: 9, direction: "right", color: "#FFB8FF", scared: false },
      { x: 9, y: 10, visualX: 9, visualY: 10, direction: "down", color: "#FFB852", scared: false },
    ];
    setGhosts(initialGhosts);
    ghostsRef.current = initialGhosts;
  }, []);

  const nextLevel = useCallback(() => {
    setShowLevelUp(false);
    
    const newLevel = levelRef.current + 1;
    if (newLevel > 5) {
      setGameState("won");
      return;
    }
    
    totalScoreRef.current += scoreRef.current;
    setTotalScore(totalScoreRef.current);
    setLevel(newLevel);
    levelRef.current = newLevel;
    initLevel(newLevel);
    setGameState("ready");
  }, [initLevel]);

  const resetGame = useCallback(() => {
    setLevel(1);
    levelRef.current = 1;
    setTotalScore(0);
    totalScoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setGameState("ready");
    setShowLevelUp(false);
    initLevel(1);
  }, [initLevel]);

  const shareToTwitter = useCallback(async () => {
    const finalScore = totalScoreRef.current + scoreRef.current;
    const text = `I reached Level ${levelRef.current} with ${finalScore} points in Rac-man! Can you beat my score?`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    // Download screenshot from canvas directly
    const gameCanvas = canvasRef.current;
    if (gameCanvas) {
      try {
        const link = document.createElement('a');
        link.download = `pacman-level${levelRef.current}-score${finalScore}.png`;
        link.href = gameCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Failed to download screenshot:', error);
      }
    }
    
    // Open Twitter after a small delay
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.open(twitterUrl, '_blank');
      }
    }, 300);
  }, []);

  const downloadScreenshot = useCallback(async () => {
    const container = gameContainerRef.current;
    if (!container) return;
    
    try {
      const dataUrl = await toPng(container, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#000",
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `pacman-level${levelRef.current}-score${totalScoreRef.current + scoreRef.current}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download screenshot:', error);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (gameState === "ready") {
        setGameState("playing");
      }
      if (gameState === "levelComplete") {
        if (e.key === " " || e.key === "Enter") {
          nextLevel();
        }
        return;
      }
      if (gameState === "won" || gameState === "lost") {
        if (e.key === " " || e.key === "Enter") {
          resetGame();
        }
        return;
      }

      let newDir = null;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          newDir = "up";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          newDir = "down";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          newDir = "left";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          newDir = "right";
          break;
        case "p":
        case "P":
          if (gameState === "playing") setGameState("paused");
          else if (gameState === "paused") setGameState("playing");
          return;
      }
      if (newDir) {
        e.preventDefault();
        setNextDirection(newDir);
        nextDirectionRef.current = newDir;
      }
    },
    [gameState, resetGame]
  );

  const handleTouchStart = useCallback(
    (e) => {
      if (gameState === "ready") {
        setGameState("playing");
      }
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    [gameState]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (!touchStartRef.current) return;
      if (gameState === "won" || gameState === "lost") {
        resetGame();
        return;
      }

      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      const minSwipe = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipe) {
          const newDir = deltaX > 0 ? "right" : "left";
          setNextDirection(newDir);
          nextDirectionRef.current = newDir;
        }
      } else {
        if (Math.abs(deltaY) > minSwipe) {
          const newDir = deltaY > 0 ? "down" : "up";
          setNextDirection(newDir);
          nextDirectionRef.current = newDir;
        }
      }
      touchStartRef.current = null;
    },
    [gameState, resetGame]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState !== "playing") {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const moveGhosts = (currentGhosts, pacX, pacY, currentMaze) => {
      const config = LEVEL_CONFIGS[levelRef.current - 1];
      return currentGhosts.map((ghost) => {
        const directions = ["up", "down", "left", "right"];
        const opposite = {
          up: "down",
          down: "up",
          left: "right",
          right: "left",
        };

        const validDirs = directions.filter((dir) => {
          if (dir === opposite[ghost.direction]) return false;
          const next = getNextPosition(ghost.x, ghost.y, dir);
          return canMoveInMaze(next.x, next.y, currentMaze);
        });

        if (validDirs.length === 0) {
          const next = getNextPosition(ghost.x, ghost.y, opposite[ghost.direction]);
          if (canMoveInMaze(next.x, next.y, currentMaze)) {
            return { ...ghost, ...next, visualX: ghost.x, visualY: ghost.y, direction: opposite[ghost.direction] };
          }
          return ghost;
        }

        let chosenDir;
        // Ghost returning to base - move towards spawn point
        if (ghost.returning) {
          let bestDir = validDirs[0];
          let bestDist = Infinity;
          const targetX = 9;
          const targetY = 9;
          validDirs.forEach((dir) => {
            const next = getNextPosition(ghost.x, ghost.y, dir);
            const dist = Math.abs(next.x - targetX) + Math.abs(next.y - targetY);
            if (dist < bestDist) {
              bestDist = dist;
              bestDir = dir;
            }
          });
          chosenDir = bestDir;
        } else if (ghost.scared) {
          chosenDir = validDirs[Math.floor(Math.random() * validDirs.length)];
        } else if (isInvincibleRef.current) {
          // When pacman is invincible, ghosts move randomly (can't detect pacman)
          chosenDir = validDirs[Math.floor(Math.random() * validDirs.length)];
        } else {
          if (Math.random() < config.ghostChaseChance) {
            let bestDir = validDirs[0];
            let bestDist = Infinity;
            validDirs.forEach((dir) => {
              const next = getNextPosition(ghost.x, ghost.y, dir);
              const dist = Math.abs(next.x - pacX) + Math.abs(next.y - pacY);
              if (dist < bestDist) {
                bestDist = dist;
                bestDir = dir;
              }
            });
            chosenDir = bestDir;
          } else {
            chosenDir = validDirs[Math.floor(Math.random() * validDirs.length)];
          }
        }

        const nextPos = getNextPosition(ghost.x, ghost.y, chosenDir);
        
        // Check if returning ghost reached base
        if (ghost.returning && ghost.x === 9 && ghost.y === 9) {
          return { ...ghost, ...nextPos, visualX: ghost.x, visualY: ghost.y, direction: chosenDir, returning: false };
        }
        
        return { ...ghost, ...nextPos, visualX: ghost.x, visualY: ghost.y, direction: chosenDir };
      });
    };

    const gameStep = () => {
      const config = LEVEL_CONFIGS[levelRef.current - 1];
      let currentDir = directionRef.current;
      const nextDir = nextDirectionRef.current;
      const currentPacman = pacmanRef.current;
      const currentMaze = mazeRef.current;
      
      if (nextDir) {
        const nextPos = getNextPosition(currentPacman.x, currentPacman.y, nextDir);
        if (canMoveInMaze(nextPos.x, nextPos.y, currentMaze)) {
          currentDir = nextDir;
          setDirection(currentDir);
          directionRef.current = currentDir;
          setNextDirection(null);
          nextDirectionRef.current = null;
        }
      }

      const nextPos = getNextPosition(currentPacman.x, currentPacman.y, currentDir);

      if (canMoveInMaze(nextPos.x, nextPos.y, currentMaze)) {
        const isTeleporting = Math.abs(nextPos.x - currentPacman.x) > 1;
        
        pacmanRef.current = { 
          ...nextPos, 
          visualX: isTeleporting ? nextPos.x : currentPacman.x, 
          visualY: currentPacman.y,
          prevX: isTeleporting ? nextPos.x : currentPacman.x,
          prevY: currentPacman.y,
          isTeleporting
        };
        animationProgressRef.current = isTeleporting ? 1 : 0;

        const cell = currentMaze[nextPos.y]?.[nextPos.x];
        if (cell === 2) {
          scoreRef.current += 10;
          setScore(scoreRef.current);
          currentMaze[nextPos.y][nextPos.x] = 0;
          setMaze([...currentMaze.map((row) => [...row])]);
          
          let dotsRemaining = 0;
          currentMaze.forEach((row) => {
            row.forEach((c) => {
              if (c === 2 || c === 3) dotsRemaining++;
            });
          });
          if (dotsRemaining === 0) {
            if (levelRef.current >= 5) {
              totalScoreRef.current += scoreRef.current;
              setTotalScore(totalScoreRef.current);
              setGameState("won");
              // Play victory fanfare
              try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
                notes.forEach((freq, i) => {
                  const osc = audioContext.createOscillator();
                  const gain = audioContext.createGain();
                  osc.connect(gain);
                  gain.connect(audioContext.destination);
                  osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
                  osc.type = 'square';
                  gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.15);
                  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.2);
                  osc.start(audioContext.currentTime + i * 0.15);
                  osc.stop(audioContext.currentTime + i * 0.15 + 0.2);
                });
              } catch (e) {}
            } else {
              setShowLevelUp(true);
              setGameState("levelComplete");
              // Play level complete sound (triumphant ascending melody)
              try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [392.00, 440.00, 493.88, 523.25, 587.33, 659.25]; // G4, A4, B4, C5, D5, E5
                notes.forEach((freq, i) => {
                  const osc = audioContext.createOscillator();
                  const gain = audioContext.createGain();
                  osc.connect(gain);
                  gain.connect(audioContext.destination);
                  osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
                  osc.type = 'square';
                  gain.gain.setValueAtTime(0.12, audioContext.currentTime + i * 0.1);
                  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.15);
                  osc.start(audioContext.currentTime + i * 0.1);
                  osc.stop(audioContext.currentTime + i * 0.1 + 0.15);
                });
              } catch (e) {}
            }
          }
        } else if (cell === 3) {
          scoreRef.current += 50;
          setScore(scoreRef.current);
          currentMaze[nextPos.y][nextPos.x] = 0;
          setMaze([...currentMaze.map((row) => [...row])]);
          setPowerMode(true);
          powerModeStateRef.current = true;
          gameSpeedRef.current = config.powerSpeed;
          
          // Play power pill sound effect
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Power up arpeggio sound
            const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
            notes.forEach((freq, i) => {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              osc.connect(gain);
              gain.connect(audioContext.destination);
              osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.08);
              osc.type = 'square';
              gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.08);
              gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.08 + 0.1);
              osc.start(audioContext.currentTime + i * 0.08);
              osc.stop(audioContext.currentTime + i * 0.08 + 0.1);
            });
          } catch (e) {
            // Audio not supported
          }
          
          setShowRaikuMode(true);
          setTimeout(() => setShowRaikuMode(false), 1500);
          
          const scaredGhosts = ghostsRef.current.map((g) => ({ ...g, scared: true }));
          setGhosts(scaredGhosts);
          ghostsRef.current = scaredGhosts;
          
          if (powerModeRef.current) clearTimeout(powerModeRef.current);
          powerModeRef.current = setTimeout(() => {
            setPowerMode(false);
            powerModeStateRef.current = false;
            gameSpeedRef.current = config.baseSpeed;
            const normalGhosts = ghostsRef.current.map((g) => ({ ...g, scared: false }));
            setGhosts(normalGhosts);
            ghostsRef.current = normalGhosts;
          }, config.powerDuration);
          
          let dotsRemaining = 0;
          currentMaze.forEach((row) => {
            row.forEach((c) => {
              if (c === 2 || c === 3) dotsRemaining++;
            });
          });
          if (dotsRemaining === 0) {
            if (levelRef.current >= 5) {
              totalScoreRef.current += scoreRef.current;
              setTotalScore(totalScoreRef.current);
              setGameState("won");
              // Play victory fanfare
              try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
                notes.forEach((freq, i) => {
                  const osc = audioContext.createOscillator();
                  const gain = audioContext.createGain();
                  osc.connect(gain);
                  gain.connect(audioContext.destination);
                  osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
                  osc.type = 'square';
                  gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.15);
                  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.2);
                  osc.start(audioContext.currentTime + i * 0.15);
                  osc.stop(audioContext.currentTime + i * 0.15 + 0.2);
                });
              } catch (e) {}
            } else {
              setShowLevelUp(true);
              setGameState("levelComplete");
              // Play level complete sound (triumphant ascending melody)
              try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [392.00, 440.00, 493.88, 523.25, 587.33, 659.25]; // G4, A4, B4, C5, D5, E5
                notes.forEach((freq, i) => {
                  const osc = audioContext.createOscillator();
                  const gain = audioContext.createGain();
                  osc.connect(gain);
                  gain.connect(audioContext.destination);
                  osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
                  osc.type = 'square';
                  gain.gain.setValueAtTime(0.12, audioContext.currentTime + i * 0.1);
                  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.15);
                  osc.start(audioContext.currentTime + i * 0.1);
                  osc.stop(audioContext.currentTime + i * 0.1 + 0.15);
                });
              } catch (e) {}
            }
          }
        }
      }

      // Ghost movement - always moves at base speed (every tick)
      const newGhosts = moveGhosts(ghostsRef.current, pacmanRef.current.x, pacmanRef.current.y, currentMaze);
      ghostsRef.current = newGhosts;
      setGhosts([...newGhosts]);

      if (!isInvincibleRef.current) {
        const collision = newGhosts.some(
          (ghost) => ghost.x === pacmanRef.current.x && ghost.y === pacmanRef.current.y
        );

        if (collision) {
          if (powerModeStateRef.current) {
            scoreRef.current += 200;
            setScore(scoreRef.current);
            
            // Trigger kill effect
            setKillEffect(true);
            setKillScore({ show: true, x: pacmanRef.current.x, y: pacmanRef.current.y });
            setTimeout(() => {
              setKillEffect(false);
              setKillScore({ show: false, x: 0, y: 0 });
            }, 500);
            
            // Play kill sound (ascending tone)
            try {
              const audioContext = new (window.AudioContext || window.webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
              oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.15);
              gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.15);
            } catch (e) {
              // Audio not supported
            }
            
            // Set ghost to returning mode (animate back to base)
            const updatedGhosts = newGhosts.map((ghost) => {
              if (ghost.x === pacmanRef.current.x && ghost.y === pacmanRef.current.y) {
                return { ...ghost, returning: true, scared: false };
              }
              // Check if returning ghost reached base
              if (ghost.returning && ghost.x === 9 && ghost.y === 9) {
                return { ...ghost, returning: false };
              }
              return ghost;
            });
            ghostsRef.current = updatedGhosts;
            setGhosts([...updatedGhosts]);
          } else {
            const currentLives = livesRef.current;
            
            // Trigger death effect
            setDeathEffect(true);
            // Play death sound
            try {
              const audioContext = new (window.AudioContext || window.webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
              oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
              // Audio not supported
            }
            setTimeout(() => setDeathEffect(false), 500);
            
            if (currentLives <= 1) {
              setLives(0);
              livesRef.current = 0;
              setGameState("lost");
            } else {
              livesRef.current = currentLives - 1;
              setLives(currentLives - 1);
              
              pacmanRef.current = { x: 9, y: 15, visualX: 9, visualY: 15, prevX: 9, prevY: 15, isTeleporting: false };
              setPacman({ x: 9, y: 15, visualX: 9, visualY: 15 });
              directionRef.current = "right";
              setDirection("right");
              nextDirectionRef.current = null;
              setNextDirection(null);
              
              const initialGhosts = [
                { x: 8, y: 9, visualX: 8, visualY: 9, direction: "left", color: "#FF0000", scared: false },
                { x: 9, y: 9, visualX: 9, visualY: 9, direction: "up", color: "#00FFFF", scared: false },
                { x: 10, y: 9, visualX: 10, visualY: 9, direction: "right", color: "#FFB8FF", scared: false },
                { x: 9, y: 10, visualX: 9, visualY: 10, direction: "down", color: "#FFB852", scared: false },
              ];
              ghostsRef.current = initialGhosts;
              setGhosts(initialGhosts);
              
              setPowerMode(false);
              powerModeStateRef.current = false;
              const currentConfig = LEVEL_CONFIGS[levelRef.current - 1];
              gameSpeedRef.current = currentConfig.baseSpeed;
              
              isInvincibleRef.current = true;
              setIsInvincible(true);
              setTimeout(() => {
                isInvincibleRef.current = false;
                setIsInvincible(false);
              }, 2000);
            }
          }
        }
      }
    };
    
    const scheduleNextStep = () => {
      gameLoopRef.current = setTimeout(() => {
        gameStep();
        scheduleNextStep();
      }, gameSpeedRef.current);
    };
    
    scheduleNextStep();

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId;
    
    const render = (timestamp) => {
      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;
      
      if (gameState === "playing") {
        animationProgressRef.current = Math.min(1, animationProgressRef.current + deltaTime / gameSpeedRef.current);
        setMouthOpen(Math.sin(timestamp * 0.015) > 0);
      }

      const scale = window.devicePixelRatio || 1;
      canvas.width = MAZE_WIDTH * CELL_SIZE * scale;
      canvas.height = MAZE_HEIGHT * CELL_SIZE * scale;
      canvas.style.width = `${MAZE_WIDTH * CELL_SIZE}px`;
      canvas.style.height = `${MAZE_HEIGHT * CELL_SIZE}px`;
      ctx.scale(scale, scale);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);

      maze.forEach((row, y) => {
        row.forEach((cell, x) => {
          const px = x * CELL_SIZE;
          const py = y * CELL_SIZE;

          if (cell === 1) {
            ctx.fillStyle = "#1a1aff";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
            ctx.strokeStyle = "#4444ff";
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          } else if (cell === 2) {
            ctx.fillStyle = "#ffb8ae";
            ctx.beginPath();
            ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            const pulseSize = 6 + Math.sin(timestamp * 0.005) * 2;
            ctx.fillStyle = "#ffb8ae";
            ctx.beginPath();
            ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, pulseSize, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      const currentPacman = pacmanRef.current;
      const progress = animationProgressRef.current;
      const visualX = currentPacman.isTeleporting ? currentPacman.x : lerp(currentPacman.prevX, currentPacman.x, progress);
      const visualY = currentPacman.isTeleporting ? currentPacman.y : lerp(currentPacman.prevY, currentPacman.y, progress);
      
      const pacX = visualX * CELL_SIZE + CELL_SIZE / 2;
      const pacY = visualY * CELL_SIZE + CELL_SIZE / 2;
      const mouthAngle = mouthOpen ? 0.25 * Math.PI : 0.05 * Math.PI;
      let startAngle = mouthAngle;
      let endAngle = 2 * Math.PI - mouthAngle;

      switch (direction) {
        case "up":
          startAngle = -Math.PI / 2 + mouthAngle;
          endAngle = -Math.PI / 2 + 2 * Math.PI - mouthAngle;
          break;
        case "down":
          startAngle = Math.PI / 2 + mouthAngle;
          endAngle = Math.PI / 2 + 2 * Math.PI - mouthAngle;
          break;
        case "left":
          startAngle = Math.PI + mouthAngle;
          endAngle = Math.PI + 2 * Math.PI - mouthAngle;
          break;
        case "right":
          startAngle = mouthAngle;
          endAngle = 2 * Math.PI - mouthAngle;
          break;
      }

      // Pacman blinking effect when invincible (just respawned)
      const shouldDrawPacman = !isInvincible || Math.sin(timestamp * 0.02) > 0;
      
      if (shouldDrawPacman) {
        ctx.fillStyle = isInvincible ? "#FFFF00CC" : "#FFFF00";
        ctx.beginPath();
        ctx.moveTo(pacX, pacY);
        ctx.arc(pacX, pacY, CELL_SIZE / 2 - 2, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
      }

      ghostsRef.current.forEach((ghost) => {
        const ghostVisualX = lerp(ghost.visualX, ghost.x, progress);
        const ghostVisualY = lerp(ghost.visualY, ghost.y, progress);
        
        const gx = ghostVisualX * CELL_SIZE + CELL_SIZE / 2;
        const gy = ghostVisualY * CELL_SIZE + CELL_SIZE / 2;
        const radius = CELL_SIZE / 2 - 2;

        // Ghost returning to base - draw as transparent eyes only
        if (ghost.returning) {
          // Draw only eyes (ghost body is invisible)
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = "#FFF";
          ctx.beginPath();
          ctx.arc(gx - 4, gy - 4, 5, 0, Math.PI * 2);
          ctx.arc(gx + 4, gy - 4, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(gx - 4, gy - 3, 2.5, 0, Math.PI * 2);
          ctx.arc(gx + 4, gy - 3, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          return;
        }

        if (ghost.scared) {
          const blinkPhase = Math.sin(timestamp * 0.01) > 0;
          ctx.fillStyle = blinkPhase ? "#0000FF" : "#FFFFFF";
        } else {
          ctx.fillStyle = ghost.color;
        }
        
        ctx.beginPath();
        ctx.arc(gx, gy - 2, radius, Math.PI, 0, false);
        ctx.lineTo(gx + radius, gy + radius - 2);
        
        const waveOffset = Math.sin(timestamp * 0.01) * 2;
        for (let i = 0; i < 4; i++) {
          const waveX = gx + radius - (radius * 2 * i) / 3;
          ctx.lineTo(waveX, gy + radius - 4 + (i % 2 === 0 ? waveOffset : -waveOffset));
        }
        ctx.lineTo(gx - radius, gy + radius - 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(gx - 4, gy - 4, 4, 0, Math.PI * 2);
        ctx.arc(gx + 4, gy - 4, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = ghost.scared ? "#FFF" : "#000";
        ctx.beginPath();
        ctx.arc(gx - 4, gy - 3, 2, 0, Math.PI * 2);
        ctx.arc(gx + 4, gy - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      if (gameState === "ready") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);
        ctx.fillStyle = "#FFFF00";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("MOVE", MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 - 15);
        ctx.fillText("TO START", MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 + 15);
      } else if (gameState === "won") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);
        ctx.fillStyle = "#00FF00";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN!", MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 - 10);
        ctx.fillStyle = "#FFF";
        ctx.font = "16px Arial";
        ctx.fillText(`Final Score: ${totalScoreRef.current + scoreRef.current}`, MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 + 20);
      } else if (gameState === "lost") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);
        ctx.fillStyle = "#FF0000";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 - 10);
        ctx.fillStyle = "#FFF";
        ctx.font = "16px Arial";
        ctx.fillText(`Final Score: ${totalScoreRef.current + scoreRef.current}`, MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 + 20);
      } else if (gameState === "paused") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);
        ctx.fillStyle = "#FFFF00";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2);
      } else if (gameState === "levelComplete") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);
        ctx.fillStyle = "#00FF00";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("LEVEL CLEAR!", MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 - 40);
        ctx.fillStyle = "#FFFF00";
        ctx.font = "18px Arial";
        ctx.fillText(`Level ${levelRef.current} Score: ${scoreRef.current}`, MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2);
        ctx.fillText(`Total Score: ${totalScoreRef.current}`, MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 + 30);
        ctx.fillStyle = "#AAAAAA";
        ctx.font = "14px Arial";
        ctx.fillText("Press SPACE or click Next Level →", MAZE_WIDTH * CELL_SIZE / 2, MAZE_HEIGHT * CELL_SIZE / 2 + 65);
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [maze, direction, gameState, powerMode, score, isInvincible, mouthOpen]);

  return (
    <div className="pacman-game">
      {showRaikuMode && (
        <div className="raiku-mode-overlay">
          <div className="raiku-mode-text">
            <div className="raiku-mode-title">RAIKU MODE</div>
            <div className="raiku-mode-subtitle">ACTIVATED!</div>
          </div>
        </div>
      )}

      {deathEffect && (
        <div className="death-overlay">
          <div className="death-text">OUCH!</div>
        </div>
      )}

      {killEffect && (
        <div className="kill-overlay">
          <div className="kill-text">+200</div>
        </div>
      )}

      {showLevelUp && (
        <div className="level-up-overlay">
          <div className="level-up-text">
            <div className="level-up-title">LEVEL UP!</div>
            <div className="level-up-next">
              NEXT: {levelRef.current < 5 ? LEVEL_CONFIGS[levelRef.current].name : "VICTORY!"}
            </div>
          </div>
          <div className="level-up-buttons">
            <button onClick={resetGame} className="game-btn primary">
              Restart
            </button>
            <button onClick={nextLevel} className="game-btn success">
              Next Level →
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes raiku-mode {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          30% {
            transform: scale(1.3) rotate(5deg);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotate(-2deg);
          }
          70% {
            transform: scale(1.1) rotate(2deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-raiku-mode {
          animation: raiku-mode 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <h1 className="game-title">RAC-MAN</h1>

      <div className="game-stats">
        <div className="stat-item">
          Score: <span className="stat-value">{totalScore + score}</span>
        </div>
        <div className="stat-item">
          Level: <span className="stat-value">{level}</span>
        </div>
        <div className="stat-item">
          Lives:{" "}
          <span className="stat-lives">
            {"❤️".repeat(lives)}
            {"🖤".repeat(3 - lives)}
          </span>
        </div>
      </div>

      {powerMode && (
        <div className="power-mode-indicator">
          RAIKU MODE ACTIVE! (+50% SPEED)
        </div>
      )}

      {isInvincible && (
        <div className="invincible-indicator">
          INVINCIBLE!
        </div>
      )}

      <div
        className={`game-canvas-container ${showLevelUp ? 'blur' : ''} ${deathEffect ? 'death-shake' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: MAZE_WIDTH * CELL_SIZE,
            height: MAZE_HEIGHT * CELL_SIZE,
          }}
        />
      </div>

      <div className="game-controls-mobile">
        <div className="controls-row">
          <div />
          <button
            className="control-btn"
            onClick={() => {
              if (gameState === "ready") setGameState("playing");
              setNextDirection("up");
              nextDirectionRef.current = "up";
            }}
          >
            ▲
          </button>
          <div />
        </div>
        <div className="controls-row">
          <button
            className="control-btn"
            onClick={() => {
              if (gameState === "ready") setGameState("playing");
              setNextDirection("left");
              nextDirectionRef.current = "left";
            }}
          >
            ◀
          </button>
          <button
            className="control-btn"
            onClick={() => {
              if (gameState === "ready") setGameState("playing");
              setNextDirection("down");
              nextDirectionRef.current = "down";
            }}
          >
            ▼
          </button>
          <button
            className="control-btn"
            onClick={() => {
              if (gameState === "ready") setGameState("playing");
              setNextDirection("right");
              nextDirectionRef.current = "right";
            }}
          >
            ▶
          </button>
        </div>
      </div>

      <div className="game-buttons">
        <button onClick={resetGame} className="game-btn primary">
          Restart
        </button>
        {gameState === "playing" && (
          <button
            onClick={() => setGameState("paused")}
            className="game-btn"
          >
            Pause
          </button>
        )}
        {gameState === "paused" && (
          <button
            onClick={() => setGameState("playing")}
            className="game-btn success"
          >
            Resume
          </button>
        )}
        {gameState === "levelComplete" && (
          <button
            onClick={nextLevel}
            className="game-btn success"
          >
            Next Level →
          </button>
        )}
        {(gameState === "won" || gameState === "lost") && (
          <button
            onClick={shareToTwitter}
            className="game-btn share"
          >
            <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share Score
          </button>
        )}
      </div>

      <div className="game-instructions">
        <p className="instructions-desktop">
          Use arrow keys or WASD to move. Press P to pause.
        </p>
        <p className="instructions-mobile">
          Use directional buttons or swipe to move.
        </p>
      </div>

      <div className="game-legend">
        <p>🟡 Rac-Man | 🔴🟣🟢🟠 Ghosts | ⚪ Dot | ⭕ Power Pill (+Speed)</p>
      </div>
    </div>
  );
}
