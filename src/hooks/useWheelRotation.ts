import { useState, useEffect, useRef, useCallback } from "react";

export const useWheelRotation = () => {
  const [rotationState, setRotationState] = useState<
    "idle" | "forward" | "reverse" | "completing"
  >("idle");
  const animationRef = useRef<number>();
  const lastTimestampRef = useRef<number>();
  const rotationStateRef = useRef<
    "idle" | "forward" | "reverse" | "completing"
  >("idle");
  const targetRotationRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const wheelImageRef = useRef<HTMLImageElement>(null);

  const ROTATION_SPEED = 40; // degrees per second

  useEffect(() => {
    rotationStateRef.current = rotationState;
  }, [rotationState]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    lastTimestampRef.current = undefined;
  }, []);

  const applyRotation = useCallback((deg: number) => {
    const el = wheelImageRef.current;
    if (el) {
      el.style.transform = `rotate(${deg}deg)`;
    }
  }, []);

  const startAnimation = useCallback(() => {
    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const currentState = rotationStateRef.current;
      let newRotation = rotationRef.current;
      let shouldContinue = true;

      if (currentState === "forward") {
        newRotation += ROTATION_SPEED * deltaTime;
      } else if (currentState === "reverse") {
        newRotation -= ROTATION_SPEED * deltaTime;
        if (newRotation <= targetRotationRef.current) {
          newRotation = targetRotationRef.current;
          setRotationState("idle");
          shouldContinue = false;
        }
      } else if (currentState === "completing") {
        newRotation += ROTATION_SPEED * deltaTime;
        if (newRotation >= targetRotationRef.current) {
          newRotation = targetRotationRef.current;
          setRotationState("idle");
          shouldContinue = false;
        }
      } else {
        shouldContinue = false;
      }

      rotationRef.current = newRotation;
      applyRotation(newRotation);

      if (shouldContinue && currentState !== "idle") {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [applyRotation]);

  const handleMouseEnter = useCallback(() => {
    stopAnimation();
    setRotationState("forward");
    startAnimation();
  }, [stopAnimation, startAnimation]);

  const handleMouseLeave = useCallback(() => {
    const currentState = rotationStateRef.current;
    const currentRotation = rotationRef.current;

    if (currentState === "forward") {
      stopAnimation();

      const currentCycle = Math.floor(currentRotation / 360);
      const rotationInCurrentCycle = currentRotation - currentCycle * 360;
      const completionPercentage = rotationInCurrentCycle / 360;

      if (completionPercentage > 0.5) {
        targetRotationRef.current = (currentCycle + 1) * 360;
        setRotationState("completing");
        startAnimation();
      } else {
        targetRotationRef.current = currentCycle * 360;
        setRotationState("reverse");
        startAnimation();
      }
    }
  }, [stopAnimation, startAnimation]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    handleMouseEnter,
    handleMouseLeave,
    wheelImageRef,
    isAnimating: rotationState !== "idle",
  };
};
