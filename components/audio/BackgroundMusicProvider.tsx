"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type TrackMetadata = {
  title: string;
  artist: string;
};

type BackgroundMusicContextValue = {
  isOn: boolean;
  toggleAudio: () => void;
  enableAudio: () => void;
  track: TrackMetadata;
};

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(
  null
);

export type BackgroundMusicProviderProps = {
  children: React.ReactNode;
  src: string;
  track: TrackMetadata;
};

export function BackgroundMusicProvider({
  children,
  src,
  track,
}: BackgroundMusicProviderProps) {
  const [isOn, setIsOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const element = new Audio(src);
    element.loop = true;
    element.preload = "none";
    // Avoid loading the audio until the user opts in.
    audioRef.current = element;

    return () => {
      element.pause();
      audioRef.current = null;
    };
  }, [src]);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isOn) {
      audio.pause();
      setIsOn(false);
      return;
    }

    const playPromise = audio.play();
    if (!playPromise) {
      setIsOn(true);
      return;
    }

    void playPromise
      .then(() => {
        setIsOn(true);
      })
      .catch(() => {
        setIsOn(false);
      });
  }, [isOn]);

  const enableAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isOn) {
      return;
    }

    const playPromise = audio.play();
    if (!playPromise) {
      setIsOn(true);
      return;
    }

    void playPromise
      .then(() => {
        setIsOn(true);
      })
      .catch(() => {
        setIsOn(false);
      });
  }, [isOn]);

  const value = useMemo(
    () => ({
      isOn,
      toggleAudio,
      enableAudio,
      track,
    }),
    [enableAudio, isOn, toggleAudio, track]
  );

  return (
    <BackgroundMusicContext.Provider value={value}>
      {children}
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error(
      "useBackgroundMusic must be used within BackgroundMusicProvider"
    );
  }
  return context;
}
