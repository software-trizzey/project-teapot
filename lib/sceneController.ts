export type ScenePhase =
  | "boot"
  | "greeting"
  | "idle"
  | "scanning"
  | "reviewing"
  | "complete"
  | "error"

export type SceneVideoId = "greet" | "resume-scan" | "robot-idle" | "error"

export type SceneIdleClip = {
  id: SceneVideoId
  weight: number
}

export type SceneIdleWeights = Record<ScenePhase, SceneIdleClip[]>

export type SceneState = {
  phase: ScenePhase
  activeVideo: SceneVideoId | null
  isVideoVisible: boolean
  lastVideo: SceneVideoId | null
  idleWeights: SceneIdleWeights
}

export type SceneEvent =
  | { type: "INIT" }
  | { type: "PLAY_VIDEO"; id: SceneVideoId; nextPhase?: ScenePhase }
  | { type: "VIDEO_ENDED" }
  | { type: "SET_PHASE"; phase: ScenePhase }
  | { type: "UPDATE_IDLE_WEIGHTS"; phase: ScenePhase; clips: SceneIdleClip[] }

export type SceneControllerOptions = {
  initialPhase?: ScenePhase
  idleWeights?: Partial<SceneIdleWeights>
}

export type SceneController = {
  getState: () => SceneState
  send: (event: SceneEvent) => SceneState
  subscribe: (listener: (state: SceneState) => void) => () => void
}

const DEFAULT_IDLE_WEIGHTS: SceneIdleWeights = {
  boot: [],
  greeting: [],
  idle: [{ id: "robot-idle", weight: 1 }],
  scanning: [{ id: "robot-idle", weight: 1 }],
  reviewing: [{ id: "robot-idle", weight: 1 }],
  complete: [{ id: "robot-idle", weight: 1 }],
  error: [],
}

const getIdleWeights = (
  overrides: Partial<SceneIdleWeights> = {}
): SceneIdleWeights => {
  return {
    boot: overrides.boot ?? DEFAULT_IDLE_WEIGHTS.boot,
    greeting: overrides.greeting ?? DEFAULT_IDLE_WEIGHTS.greeting,
    idle: overrides.idle ?? DEFAULT_IDLE_WEIGHTS.idle,
    scanning: overrides.scanning ?? DEFAULT_IDLE_WEIGHTS.scanning,
    reviewing: overrides.reviewing ?? DEFAULT_IDLE_WEIGHTS.reviewing,
    complete: overrides.complete ?? DEFAULT_IDLE_WEIGHTS.complete,
    error: overrides.error ?? DEFAULT_IDLE_WEIGHTS.error,
  }
}

export type IdleScheduleConfig = {
  minDelayMs: number
  maxDelayMs: number
  avoidRepeat?: boolean
}

export const DEFAULT_IDLE_SCHEDULE: IdleScheduleConfig = {
  minDelayMs: 8000,
  maxDelayMs: 16000,
  avoidRepeat: true,
}

export const getRandomIdleDelayMs = (
  config: IdleScheduleConfig = DEFAULT_IDLE_SCHEDULE
): number => {
  const minDelayMs = Math.max(0, config.minDelayMs)
  const maxDelayMs = Math.max(minDelayMs, config.maxDelayMs)
  return Math.floor(minDelayMs + Math.random() * (maxDelayMs - minDelayMs))
}

export const pickIdleClip = (
  clips: SceneIdleClip[],
  lastVideo: SceneVideoId | null,
  avoidRepeat = true
): SceneVideoId | null => {
  if (clips.length === 0) {
    return null
  }

  const availableClips =
    avoidRepeat && lastVideo
      ? clips.filter((clip) => clip.id !== lastVideo)
      : clips

  const selectionPool = availableClips.length > 0 ? availableClips : clips
  const totalWeight = selectionPool.reduce((sum, clip) => sum + clip.weight, 0)

  if (totalWeight <= 0) {
    return null
  }

  const target = Math.random() * totalWeight
  let cumulative = 0

  for (const clip of selectionPool) {
    cumulative += clip.weight
    if (target <= cumulative) {
      return clip.id
    }
  }

  return selectionPool[selectionPool.length - 1]?.id ?? null
}

const getPhaseAfterVideo = (phase: ScenePhase): ScenePhase => {
  if (phase === "greeting") {
    return "idle"
  }

  if (phase === "scanning") {
    return "reviewing"
  }

  return phase
}

const reduceSceneState = (state: SceneState, event: SceneEvent): SceneState => {
  if (event.type === "INIT") {
    return {
      ...state,
      phase: "greeting",
      activeVideo: "greet",
      isVideoVisible: true,
      lastVideo: "greet",
    }
  }

  if (event.type === "PLAY_VIDEO") {
    return {
      ...state,
      phase: event.nextPhase ?? state.phase,
      activeVideo: event.id,
      isVideoVisible: true,
      lastVideo: event.id,
    }
  }

  if (event.type === "VIDEO_ENDED") {
    const nextPhase = getPhaseAfterVideo(state.phase)

    return {
      ...state,
      phase: nextPhase,
      activeVideo: null,
      isVideoVisible: false,
      lastVideo: state.activeVideo ?? state.lastVideo,
    }
  }

  if (event.type === "SET_PHASE") {
    return {
      ...state,
      phase: event.phase,
    }
  }

  if (event.type === "UPDATE_IDLE_WEIGHTS") {
    return {
      ...state,
      idleWeights: {
        ...state.idleWeights,
        [event.phase]: event.clips,
      },
    }
  }

  return state
}

export function createSceneController(
  options: SceneControllerOptions = {}
): SceneController {
  let currentState: SceneState = {
    phase: options.initialPhase ?? "boot",
    activeVideo: null,
    isVideoVisible: false,
    lastVideo: null,
    idleWeights: getIdleWeights(options.idleWeights),
  }

  const listeners = new Set<(state: SceneState) => void>()

  const send = (event: SceneEvent): SceneState => {
    currentState = reduceSceneState(currentState, event)
    listeners.forEach((listener) => listener(currentState))
    return currentState
  }

  const getState = (): SceneState => currentState

  const subscribe = (listener: (state: SceneState) => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return {
    getState,
    send,
    subscribe,
  }
}
