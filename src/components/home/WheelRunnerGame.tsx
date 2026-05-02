import { useCallback, useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  Ban,
  ChevronsRight,
  CircleOff,
  Construction,
  OctagonAlert,
  RotateCcw,
  Snail,
  TrafficCone,
  TriangleAlert,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type GameStatus = "intro" | "running" | "caught";
type ObstacleKind =
  | "traffic-cone"
  | "road-work"
  | "warning"
  | "electric"
  | "no-entry"
  | "dead-zone"
  | "hazard"
  | "tool"
  | "boost"
  | "ghost-trap";

type RunnerWheel = {
  id: string;
  label: string;
  src: string;
  fallbackSrc: string;
};

type ObstacleDefinition = {
  icon: LucideIcon;
  label: string;
  effect: "hazard" | "boost" | "trap";
  width: number;
  height: number;
  clearance: number;
  color: string;
  yOffset?: number;
  strokeWidth?: number;
};

type Obstacle = {
  id: number;
  x: number;
  width: number;
  height: number;
  kind: ObstacleKind;
  color: string;
  clearance: number;
  effect: ObstacleDefinition["effect"];
  strokeWidth: number;
  yOffset: number;
  armed?: boolean;
  triggered?: boolean;
  hit?: boolean;
};

type GameSnapshot = {
  status: GameStatus;
  y: number;
  rotation: number;
  ghostX: number;
  wheelX: number;
  ghostLane: number;
  wheelLane: number;
  obstacles: Obstacle[];
  distance: number;
  score: number;
  hits: number;
};

type MutableGame = GameSnapshot & {
  velocity: number;
  nextId: number;
  nextSpawnGap: number;
  lastTime: number;
  speed: number;
  jumpsUsed: number;
  introElapsed: number;
  introBounces: number;
  runElapsed: number;
  ghostAdvanceElapsed: number;
};

const HIGH_SCORE_KEY = "oemwdb-wheels-runner-2026-best";
const SIGN_IN_GHOST_SRC =
  "/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png";
const LAND_ROVER_5095_GOOD =
  "http://127.0.0.1:3211/api/media/wheels/js7ephdf4m5qpgevtpk8m7t5618214tz/good_pic_url/1777508573883-land-rover-style-5095-goodpic-v3-single-tire.png";
const LAND_ROVER_5095_FALLBACK =
  "https://ideal-goshawk-843.eu-west-1.convex.site/api/media/wheels/js7ephdf4m5qpgevtpk8m7t5618214tz/bad/public/1774763968046-land-rover-style-5095.jpg";
const RUNNER_WHEELS: RunnerWheel[] = [
  {
    id: "land-rover-style-5095",
    label: "Land Rover Style 5095",
    src: LAND_ROVER_5095_GOOD,
    fallbackSrc: LAND_ROVER_5095_FALLBACK,
  },
];

const WHEEL_SIZE = 34;
const WHEEL_SPRITE_PADDING = 4;
const WHEEL_SPRITE_SIZE = WHEEL_SIZE + WHEEL_SPRITE_PADDING * 2;
const GHOST_SIZE = 36;
const GROUND_OFFSET = 76;
const GRAVITY = 0.003;
const JUMP_VELOCITY = 0.92;
const BASE_SPEED = 0.48;
const MAX_SPEED = 0.74;
const MAX_JUMPS = 2;
const DOUBLE_JUMP_VELOCITY = 0.78;
const FALLBACK_OBSTACLE_KIND: ObstacleKind = "traffic-cone";
const INTRO_DROP_HEIGHT = 168;
const INTRO_AUTO_START_MS = 2600;
const INTRO_ROLL_RAMP_MS = 1700;
const RUN_SPEED_RAMP_MS = 2300;
const TRACK_LANE_COUNT = 10;
const PLAYER_START_LANE = 5;
const GHOST_START_LANE = -2;
const GHOST_MIN_LANE = -3;
const GHOST_ADVANCE_INTERVAL_MS = 3100;
const GHOST_SAFE_LANE_GAP = 3;
const GHOST_PRESSURE_MAX_LANE = PLAYER_START_LANE - GHOST_SAFE_LANE_GAP;
const WHEEL_BOOST_LANE_GAIN = 1;
const WHEEL_HIT_LANE_LOSS = 1;
const GHOST_TRAP_LANE_LOSS = 1;
const CITY_SCAPE_TILE_WIDTH = 720;
const CITY_SCAPE_HEIGHT = 92;
const CITY_SCAPE_BASELINE = CITY_SCAPE_HEIGHT - 2;

const OBSTACLE_TYPES: Record<ObstacleKind, ObstacleDefinition> = {
  "traffic-cone": {
    icon: TrafficCone,
    label: "Traffic cone",
    effect: "hazard",
    width: 30,
    height: 30,
    clearance: 36,
    color: "#67e8f9",
  },
  "road-work": {
    icon: Construction,
    label: "Road work",
    effect: "hazard",
    width: 34,
    height: 32,
    clearance: 38,
    color: "#a78bfa",
  },
  warning: {
    icon: OctagonAlert,
    label: "Warning",
    effect: "hazard",
    width: 30,
    height: 30,
    clearance: 36,
    color: "#fb7185",
  },
  electric: {
    icon: Zap,
    label: "Electric hazard",
    effect: "hazard",
    width: 28,
    height: 32,
    clearance: 38,
    color: "#facc15",
    strokeWidth: 2,
  },
  "no-entry": {
    icon: Ban,
    label: "No entry",
    effect: "hazard",
    width: 30,
    height: 30,
    clearance: 36,
    color: "#f97316",
  },
  "dead-zone": {
    icon: CircleOff,
    label: "Dead zone",
    effect: "hazard",
    width: 30,
    height: 30,
    clearance: 36,
    color: "#22d3ee",
  },
  hazard: {
    icon: TriangleAlert,
    label: "Hazard",
    effect: "hazard",
    width: 30,
    height: 30,
    clearance: 36,
    color: "#f43f5e",
  },
  tool: {
    icon: Wrench,
    label: "Loose tool",
    effect: "hazard",
    width: 32,
    height: 32,
    clearance: 38,
    color: "#c084fc",
  },
  boost: {
    icon: ChevronsRight,
    label: "Gap boost",
    effect: "boost",
    width: 30,
    height: 30,
    clearance: 0,
    color: "#4ade80",
    yOffset: 112,
    strokeWidth: 2,
  },
  "ghost-trap": {
    icon: Snail,
    label: "Ghost trap",
    effect: "trap",
    width: 32,
    height: 32,
    clearance: 40,
    color: "#38bdf8",
  },
};
const obstacleCycle: ObstacleKind[] = [
  "traffic-cone",
  "boost",
  "warning",
  "ghost-trap",
  "road-work",
  "electric",
  "boost",
  "no-entry",
  "dead-zone",
  "ghost-trap",
  "hazard",
  "tool",
];

const getObstacleDefinition = (kind: ObstacleKind | string | undefined) =>
  OBSTACLE_TYPES[kind as ObstacleKind] ?? OBSTACLE_TYPES[FALLBACK_OBSTACLE_KIND];

const getObstacleRuntime = (obstacle: Obstacle) => {
  const definition = getObstacleDefinition(obstacle.kind);

  return {
    icon: definition.icon,
    label: definition.label,
    effect: obstacle.effect ?? definition.effect,
    width: obstacle.width ?? definition.width,
    height: obstacle.height ?? definition.height,
    color: obstacle.color ?? definition.color,
    clearance: obstacle.clearance ?? definition.clearance,
    strokeWidth: obstacle.strokeWidth ?? definition.strokeWidth ?? 1.8,
    yOffset: obstacle.yOffset ?? definition.yOffset ?? 0,
  };
};

const createStarField = () => {
  let seed = 20260501;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  return Array.from({ length: 96 }, () => {
    const isCross = random() > 0.94;
    const isBright = random() > 0.82;

    return {
      left: `${(3 + random() * 94).toFixed(2)}%`,
      top: `${(5 + random() * 66).toFixed(2)}%`,
      opacity: Number((0.18 + random() * (isBright ? 0.52 : 0.28)).toFixed(2)),
      size: isBright ? 2 : 1,
      shape: isCross ? "cross" : "dot",
    };
  });
};

const starField = createStarField();

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const getLaneX = (stageWidth: number, lane: number, size = WHEEL_SIZE) => {
  const left = Math.max(82, stageWidth * 0.08);
  const right = Math.max(104, stageWidth * 0.1);
  const span = Math.max(360, stageWidth - left - right);
  const step = span / (TRACK_LANE_COUNT - 1);

  return left + step * lane - size / 2;
};

const getWheelX = (stageWidth: number) =>
  getLaneX(stageWidth, PLAYER_START_LANE);

const readHighScore = () => {
  if (typeof window === "undefined") return 0;

  try {
    const stored = window.localStorage.getItem(HIGH_SCORE_KEY);
    const parsed = Number.parseInt(stored || "0", 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
};

const writeHighScore = (score: number) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // Local storage is just persistence for the arcade best score.
  }
};

const createObstacle = (x: number, id: number): Obstacle => {
  const kind = obstacleCycle[id % obstacleCycle.length];
  const definition = getObstacleDefinition(kind);

  return {
    id,
    x,
    kind,
    width: definition.width,
    height: definition.height,
    color: definition.color,
    clearance: definition.clearance,
    effect: definition.effect,
    strokeWidth: definition.strokeWidth ?? 1.8,
    yOffset: definition.yOffset ?? 0,
  };
};

const isInteractiveTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "button" ||
    tagName === "a" ||
    tagName === "input" ||
    tagName === "select" ||
    tagName === "textarea"
  );
};

const getInitialGame = (stageWidth: number): MutableGame => {
  const wheelLane = PLAYER_START_LANE;
  const ghostLane = GHOST_START_LANE;
  const wheelX = getLaneX(stageWidth, wheelLane);
  const ghostX = getLaneX(stageWidth, ghostLane, GHOST_SIZE);

  return {
    status: "intro",
    y: INTRO_DROP_HEIGHT,
    velocity: 0,
    rotation: 0,
    wheelX,
    ghostX,
    wheelLane,
    ghostLane,
    obstacles: [
      createObstacle(stageWidth + 900, 1),
      createObstacle(stageWidth + 1280, 2),
    ],
    distance: 0,
    score: 0,
    hits: 0,
    speed: BASE_SPEED,
    nextId: 3,
    nextSpawnGap: 360,
    lastTime: 0,
    jumpsUsed: 0,
    introElapsed: 0,
    introBounces: 0,
    runElapsed: 0,
    ghostAdvanceElapsed: 0,
  };
};

const handleWheelImageError = (
  event: SyntheticEvent<HTMLImageElement>,
  wheel: RunnerWheel,
) => {
  const image = event.currentTarget;

  if (image.src !== wheel.fallbackSrc) {
    image.src = wheel.fallbackSrc;
  }
};

const Wheel = ({
  x,
  y,
  rotation,
  wheel,
}: {
  x: number;
  y: number;
  rotation: number;
  wheel: RunnerWheel;
}) => (
  <div
    className="absolute z-20"
    style={{
      left: x - WHEEL_SPRITE_PADDING,
      bottom: GROUND_OFFSET + y - WHEEL_SPRITE_PADDING,
      width: WHEEL_SPRITE_SIZE,
      height: WHEEL_SPRITE_SIZE,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: "center",
    }}
  >
    <img
      src={wheel.src}
      alt={wheel.label}
      onError={(event) => handleWheelImageError(event, wheel)}
      className="absolute object-contain"
      style={{
        left: WHEEL_SPRITE_PADDING,
        top: WHEEL_SPRITE_PADDING,
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
      }}
      draggable={false}
    />
  </div>
);

const ObstacleView = ({ obstacle }: { obstacle: Obstacle }) => {
  const obstacleState = getObstacleRuntime(obstacle);
  const Icon = obstacleState.icon;
  const color = obstacle.armed ? "#f8fafc" : obstacleState.color;
  const commonStyle = {
    left: obstacle.x,
    bottom: GROUND_OFFSET + obstacleState.yOffset + 2,
    width: obstacleState.width,
    height: obstacleState.height,
    color,
    opacity: obstacle.hit || obstacle.triggered ? 0.32 : 1,
  };

  return (
    <div
      aria-label={obstacleState.label}
      className="absolute z-10 flex items-center justify-center"
      style={commonStyle}
    >
      <Icon className="h-full w-full" strokeWidth={obstacleState.strokeWidth} />
    </div>
  );
};

const CityScapeLoop = ({
  distance,
  stageWidth,
}: {
  distance: number;
  stageWidth: number;
}) => {
  const tileCount = Math.ceil(stageWidth / CITY_SCAPE_TILE_WIDTH) + 2;
  const offset = ((distance % CITY_SCAPE_TILE_WIDTH) + CITY_SCAPE_TILE_WIDTH) % CITY_SCAPE_TILE_WIDTH;
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    strokeWidth: 1.4,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0 z-[1] overflow-hidden text-white"
      style={{
        bottom: GROUND_OFFSET + 1,
        height: CITY_SCAPE_HEIGHT,
        opacity: 0.24,
      }}
    >
      {Array.from({ length: tileCount }, (_, index) => (
        <svg
          key={index}
          className="absolute bottom-0"
          viewBox={`0 0 ${CITY_SCAPE_TILE_WIDTH} ${CITY_SCAPE_HEIGHT}`}
          preserveAspectRatio="none"
          style={{
            left: index * CITY_SCAPE_TILE_WIDTH - offset,
            width: CITY_SCAPE_TILE_WIDTH,
            height: CITY_SCAPE_HEIGHT,
          }}
        >
          <path
            {...commonProps}
            d={`M0 ${CITY_SCAPE_BASELINE} H20 V62 H42 V44 H64 V28 H92 V54 H116 V36 H140 V66 H164 V22 H198 V47 H220 V68 H246 V32 H272 V16 H310 V61 H334 V38 H360 V70 H386 V52 H410 V28 H440 V58 H464 V43 H488 V74 H516 V34 H544 V18 H580 V56 H604 V42 H632 V64 H660 V30 H694 V58 H720 V${CITY_SCAPE_BASELINE}`}
          />
          <path
            {...commonProps}
            strokeOpacity="0.58"
            d="M49 54 V48 M78 38 V32 M129 48 V42 M184 34 V28 M231 59 V53 M286 27 V20 M323 50 V44 M372 62 V57 M428 41 V35 M476 66 V60 M531 29 V23 M592 50 V45 M646 43 V37 M677 49 V43"
          />
          <path
            {...commonProps}
            strokeOpacity="0.38"
            d="M272 16 V6 H282 V16 M544 18 V8 H554 V18 M164 22 V12 H172 V22 M660 30 V20 H668 V30"
          />
          <path
            {...commonProps}
            strokeOpacity="0.28"
            d="M0 78 H20 M94 80 H116 M198 82 H220 M310 79 H334 M440 82 H464 M580 80 H604 M694 78 H720"
          />
        </svg>
      ))}
    </div>
  );
};

const WheelRunnerGame = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stageWidthRef = useRef(900);
  const frameRef = useRef<number | null>(null);
  const [stageWidth, setStageWidth] = useState(stageWidthRef.current);
  const [highScore, setHighScore] = useState(readHighScore);
  const [selectedWheel, setSelectedWheel] = useState(RUNNER_WHEELS[0]);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => {
    const initial = getInitialGame(stageWidthRef.current);
    return {
      status: initial.status,
      y: initial.y,
      rotation: initial.rotation,
      ghostX: initial.ghostX,
      wheelX: initial.wheelX,
      ghostLane: initial.ghostLane,
      wheelLane: initial.wheelLane,
      obstacles: initial.obstacles,
      distance: initial.distance,
      score: initial.score,
      hits: initial.hits,
    };
  });
  const gameRef = useRef<MutableGame>(getInitialGame(stageWidthRef.current));

  const syncSnapshot = useCallback(() => {
    const game = gameRef.current;
    setSnapshot({
      status: game.status,
      y: game.y,
      rotation: game.rotation,
      ghostX: game.ghostX,
      wheelX: game.wheelX ?? getWheelX(stageWidthRef.current),
      ghostLane: game.ghostLane ?? GHOST_START_LANE,
      wheelLane: game.wheelLane ?? PLAYER_START_LANE,
      obstacles: game.obstacles,
      distance: game.distance ?? 0,
      score: game.score,
      hits: game.hits,
    });
  }, []);

  const saveScore = useCallback((score: number) => {
    const finalScore = Math.floor(score);

    setHighScore((previous) => {
      if (finalScore <= previous) return previous;
      writeHighScore(finalScore);
      return finalScore;
    });
  }, []);

  const startGame = useCallback(() => {
    const next = getInitialGame(stageWidthRef.current);
    gameRef.current = next;
    syncSnapshot();
    stageRef.current?.focus({ preventScroll: true });
  }, [syncSnapshot]);

  const jump = useCallback(() => {
    const game = gameRef.current;

    if (game.status === "caught") {
      startGame();
      return;
    }

    if (game.status !== "running") return;

    if (game.y <= 1) {
      game.velocity = JUMP_VELOCITY;
      game.jumpsUsed = 1;
      return;
    }

    if (game.jumpsUsed < MAX_JUMPS) {
      game.velocity = DOUBLE_JUMP_VELOCITY;
      game.jumpsUsed += 1;
    }
  }, [startGame]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateStageWidth = () => {
      const width = Math.max(320, stage.getBoundingClientRect().width);
      stageWidthRef.current = width;
      setStageWidth(width);
    };

    updateStageWidth();
    const observer = new ResizeObserver(updateStageWidth);
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveTarget(event.target)) return;

      if (
        event.key === " " ||
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
      ) {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  useEffect(() => {
    const runFrame = (time: number) => {
      const game = gameRef.current;

      if (!game.lastTime) {
        game.lastTime = time;
      }

      const delta = Math.min(34, time - game.lastTime);
      game.lastTime = time;

      if (game.status === "intro") {
        game.introElapsed = game.introElapsed ?? 0;
        game.introBounces = game.introBounces ?? 0;
        game.wheelLane = game.wheelLane ?? PLAYER_START_LANE;
        game.ghostLane = game.ghostLane ?? GHOST_START_LANE;
        const targetWheelX = getLaneX(stageWidthRef.current, game.wheelLane);
        const targetGhostX = getLaneX(stageWidthRef.current, game.ghostLane, GHOST_SIZE);
        game.wheelX = Number.isFinite(game.wheelX) ? game.wheelX : targetWheelX;
        game.ghostX = Number.isFinite(game.ghostX) ? game.ghostX : targetGhostX;

        const introProgress = Math.min(1, game.introElapsed / INTRO_ROLL_RAMP_MS);
        const introSpeed = BASE_SPEED * 0.22 * easeOutCubic(introProgress);

        game.introElapsed += delta;
        game.speed = introSpeed;
        game.wheelX += (targetWheelX - game.wheelX) * Math.min(1, delta * 0.008);
        game.ghostX += (targetGhostX - game.ghostX) * Math.min(1, delta * 0.006);
        game.rotation += delta * introSpeed * 1.72;
        game.distance = (game.distance ?? 0) + introSpeed * delta;

        if (game.y > 0 || game.velocity !== 0 || game.introBounces < 3) {
          game.y += game.velocity * delta;
          game.velocity -= GRAVITY * delta;

          if (game.y <= 0) {
            const bounceVelocity = [0.58, 0.34, 0.17][game.introBounces] ?? 0;

            game.y = 0;
            game.velocity = bounceVelocity;
            game.introBounces += 1;
          }
        }

        if (
          game.introElapsed >= INTRO_AUTO_START_MS &&
          game.y <= 1 &&
          game.introBounces >= 3
        ) {
          game.status = "running";
          game.y = 0;
          game.velocity = 0;
          game.score = 0;
          game.hits = 0;
          game.runElapsed = 0;
          game.jumpsUsed = 0;
          game.ghostAdvanceElapsed = 0;
          game.speed = Math.max(0.14, introSpeed);
        }

        syncSnapshot();
      } else if (game.status === "running") {
        game.wheelLane = Math.max(
          0,
          Math.min(TRACK_LANE_COUNT - 1, game.wheelLane ?? PLAYER_START_LANE),
        );
        game.ghostLane = Math.max(GHOST_MIN_LANE, game.ghostLane ?? GHOST_START_LANE);
        const targetWheelX = getLaneX(stageWidthRef.current, game.wheelLane);
        const targetGhostX = getLaneX(stageWidthRef.current, game.ghostLane, GHOST_SIZE);
        game.runElapsed = game.runElapsed ?? 0;
        game.ghostAdvanceElapsed = game.ghostAdvanceElapsed ?? 0;
        game.wheelX = Number.isFinite(game.wheelX) ? game.wheelX : targetWheelX;
        game.ghostX = Number.isFinite(game.ghostX) ? game.ghostX : targetGhostX;
        game.runElapsed += delta;
        game.ghostAdvanceElapsed += delta;
        game.wheelX += (targetWheelX - game.wheelX) * Math.min(1, delta * 0.01);
        game.ghostX += (targetGhostX - game.ghostX) * Math.min(1, delta * 0.006);
        const wheelX = game.wheelX;
        if (
          game.ghostAdvanceElapsed >= GHOST_ADVANCE_INTERVAL_MS &&
          game.ghostLane < GHOST_PRESSURE_MAX_LANE
        ) {
          game.ghostLane += 1;
          game.ghostAdvanceElapsed = 0;
        }
        const runRamp =
          0.22 + 0.78 * easeOutCubic(Math.min(1, game.runElapsed / RUN_SPEED_RAMP_MS));
        const hitPenalty = Math.min(0.28, game.hits * 0.065);
        const targetSpeed = Math.max(
          0.28,
          Math.min(MAX_SPEED, BASE_SPEED + game.score / 4600) - hitPenalty,
        );
        game.speed = Math.max(0.16, targetSpeed * runRamp);
        game.score += delta * 0.011 * (game.speed / BASE_SPEED);
        game.rotation += delta * game.speed * 1.72;
        game.distance = (game.distance ?? 0) + game.speed * delta;

        if (game.y > 0 || game.velocity > 0) {
          game.y += game.velocity * delta;
          game.velocity -= GRAVITY * delta;

          if (game.y <= 0) {
            game.y = 0;
            game.velocity = 0;
            game.jumpsUsed = 0;
          }
        }

        game.obstacles = game.obstacles
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - game.speed * delta,
          }))
          .filter((obstacle) => obstacle.x + getObstacleRuntime(obstacle).width > -44);

        const lastObstacle = game.obstacles[game.obstacles.length - 1];
        if (!lastObstacle || lastObstacle.x < stageWidthRef.current - game.nextSpawnGap) {
          const nextX = stageWidthRef.current + 180 + Math.random() * 180;
          game.obstacles.push(createObstacle(nextX, game.nextId));
          game.nextId += 1;
          game.nextSpawnGap = 260 + Math.random() * 180;
        }

        const playerLeft = wheelX + 2;
        const playerRight = wheelX + WHEEL_SIZE - 2;
        const playerBottom = game.y;
        const playerTop = game.y + WHEEL_SIZE;
        let tookHit = false;

        game.obstacles = game.obstacles.map((obstacle) => {
          if (obstacle.hit || obstacle.triggered) return obstacle;

          const obstacleState = getObstacleRuntime(obstacle);
          const obstacleLeft = obstacle.x + 1;
          const obstacleRight = obstacle.x + obstacleState.width - 1;
          const overlaps = playerRight > obstacleLeft && playerLeft < obstacleRight;
          if (!overlaps) return obstacle;

          const obstacleBottom = obstacleState.yOffset;
          const obstacleTop = obstacleState.yOffset + obstacleState.height;

          if (obstacleState.effect === "boost") {
            const verticalOverlap =
              playerTop > obstacleBottom + 3 && playerBottom < obstacleTop - 3;

            if (!verticalOverlap) return obstacle;

            game.wheelLane = Math.min(
              TRACK_LANE_COUNT - 1,
              game.wheelLane + WHEEL_BOOST_LANE_GAIN,
            );
            game.score += 18;
            game.velocity = Math.max(game.velocity, 0.36);
            return { ...obstacle, hit: true };
          }

          if (obstacleState.effect === "trap") {
            if (obstacle.armed) return obstacle;

            const landedOnTop =
              game.velocity <= 0 &&
              playerBottom >= obstacleTop - 8 &&
              playerBottom <= obstacleTop + 18;

            if (!landedOnTop) return obstacle;

            game.y = obstacleTop;
            game.velocity = 0.34;
            return { ...obstacle, armed: true };
          }

          const isTooLow = playerBottom < obstacleState.clearance;
          if (!isTooLow) return obstacle;

          tookHit = true;
          game.wheelLane = Math.max(0, game.wheelLane - WHEEL_HIT_LANE_LOSS);
          return { ...obstacle, hit: true };
        });

        let triggeredTrap = false;
        game.obstacles = game.obstacles.map((obstacle) => {
          const obstacleState = getObstacleRuntime(obstacle);

          if (
            obstacleState.effect !== "trap" ||
            !obstacle.armed ||
            obstacle.triggered ||
            obstacle.x > game.ghostX + GHOST_SIZE - 4
          ) {
            return obstacle;
          }

          triggeredTrap = true;
          return { ...obstacle, triggered: true, hit: true };
        });

        if (triggeredTrap) {
          game.ghostLane = Math.max(
            GHOST_MIN_LANE,
            game.ghostLane - GHOST_TRAP_LANE_LOSS,
          );
          game.ghostAdvanceElapsed = 0;
          game.hits = Math.max(0, game.hits - 1);
        }

        if (tookHit) {
          game.hits += 1;
        }

        if (game.ghostLane >= game.wheelLane) {
          game.status = "caught";
          game.velocity = 0;
          saveScore(game.score);
        }

        syncSnapshot();
      }

      frameRef.current = window.requestAnimationFrame(runFrame);
    };

    frameRef.current = window.requestAnimationFrame(runFrame);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [saveScore, syncSnapshot]);

  const score = Math.floor(snapshot.score);
  const activeWheel = selectedWheel ?? RUNNER_WHEELS[0];
  const wheelX = Number.isFinite(snapshot.wheelX) ? snapshot.wheelX : getWheelX(stageWidth);

  return (
    <section className="h-full min-h-0 p-3 text-white">
      <div className="flex h-full min-h-0 w-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-3">
        <div
          ref={stageRef}
          role="button"
          tabIndex={0}
          data-testid="wheel-runner-stage"
          data-runner-status={snapshot.status}
          data-wheel-lane={snapshot.wheelLane}
          data-ghost-lane={snapshot.ghostLane}
          aria-label="Wheels Runner 2026 game"
          onPointerDown={(event) => {
            if (isInteractiveTarget(event.target)) return;
            stageRef.current?.focus({ preventScroll: true });
            jump();
          }}
          className="relative min-h-[320px] flex-1 cursor-pointer overflow-hidden rounded-md border border-white/15 bg-black outline-none ring-0 focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {starField.map((star, index) => (
            <span
              key={index}
              className={[
                "pointer-events-none absolute",
                star.shape === "cross" ? "h-[5px] w-[5px]" : "rounded-full bg-white",
              ].join(" ")}
              style={{
                left: star.left,
                top: star.top,
                width: star.shape === "cross" ? undefined : star.size,
                height: star.shape === "cross" ? undefined : star.size,
                opacity: star.opacity,
              }}
            >
              {star.shape === "cross" ? (
                <>
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
                </>
              ) : null}
            </span>
          ))}

          <div className="absolute right-3 top-3 z-30 flex gap-4 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 sm:right-4 sm:top-4">
            <div>
              <div>Score</div>
              <div className="text-base tracking-normal text-white sm:text-lg">{score}</div>
            </div>
            <div>
              <div>Best</div>
              <div className="text-base tracking-normal text-white sm:text-lg">{highScore}</div>
            </div>
          </div>

          <CityScapeLoop distance={snapshot.distance} stageWidth={stageWidth} />

          <div className="pointer-events-none absolute left-0 right-0 z-[2] h-px bg-white/70" style={{ bottom: GROUND_OFFSET }} />

          <img
            src={SIGN_IN_GHOST_SRC}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute z-20 object-contain opacity-95"
            style={{
              left: snapshot.ghostX,
              bottom: GROUND_OFFSET - 1,
              width: GHOST_SIZE,
              height: GHOST_SIZE,
            }}
            draggable={false}
          />

          <Wheel
            x={wheelX}
            y={snapshot.y}
            rotation={snapshot.rotation}
            wheel={activeWheel}
          />

          {snapshot.obstacles.map((obstacle) => (
            <ObstacleView key={obstacle.id} obstacle={obstacle} />
          ))}

          {snapshot.status === "caught" && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/65 px-4">
              <div className="w-full max-w-xs rounded-md border border-red-500/55 bg-black px-4 py-3 text-center">
                <div className="font-mono text-3xl font-semibold uppercase tracking-[0.16em] text-red-500 sm:text-4xl">
                  Game Over
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-red-300/65">
                  Score
                </div>
                <div className="font-mono text-4xl font-semibold tabular-nums text-red-500 sm:text-5xl">
                  {score}
                </div>
                <button
                  type="button"
                  onClick={startGame}
                  className="mx-auto mt-3 flex h-9 items-center gap-2 rounded-md border border-red-500/55 bg-black px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-red-400 transition hover:border-red-300 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                >
                  <RotateCcw className="h-4 w-4" />
                  Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex min-h-16 items-center justify-center rounded-md border border-white/10 bg-black px-3 py-2">
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {RUNNER_WHEELS.map((wheel) => {
              const isSelected = activeWheel.id === wheel.id;

              return (
                <button
                  key={wheel.id}
                  type="button"
                  onClick={() => setSelectedWheel(wheel)}
                  aria-label={`Choose ${wheel.label}`}
                  aria-pressed={isSelected}
                  className={[
                    "grid h-12 w-12 shrink-0 place-items-center rounded-full border bg-black p-1 transition",
                    isSelected
                      ? "border-white"
                      : "border-white/20 opacity-70 hover:border-white/60 hover:opacity-100",
                  ].join(" ")}
                >
                  <img
                    src={wheel.src}
                    alt=""
                    aria-hidden="true"
                    onError={(event) => handleWheelImageError(event, wheel)}
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WheelRunnerGame;
