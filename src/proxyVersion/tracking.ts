import { useRef } from "react";

let currentListener: (() => void) | null = null;

export function track(listener: () => void) {
  currentListener = listener;
}

export function getCurrentListener() {
  return currentListener;
}

export function clearCurrentListener() {
  currentListener = null;
}

export function useTracking() {
  const currentListenerRef = useRef<(() => void) | null>(null);

  const track = (listener: () => void) => {
    currentListenerRef.current = listener;
  };

  const getCurrentListener = () => {
    return currentListenerRef.current;
  };

  const clearCurrentListener = () => {
    currentListenerRef.current = null;
  };

  return { track, getCurrentListener, clearCurrentListener };
}