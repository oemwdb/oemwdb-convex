import { useState, useEffect, useRef, useCallback } from "react";

export const useWheelRotation = () => {
  const [rotation, setRotation] = useState(0);
  const [rotationState, setRotationState] = useState<'idle' | 'forward' | 'reverse' | 'completing'>('idle');
  const animationRef = useRef<number>();
  const lastTimestampRef = useRef<number>();
  const rotationStateRef = useRef<'idle' | 'forward' | 'reverse' | 'completing'>('idle');
  const targetRotationRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);

  const ROTATION_SPEED = 30; // degrees per second

  // Keep refs in sync with state
  useEffect(() => {
    rotationStateRef.current = rotationState;
  }, [rotationState]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    lastTimestampRef.current = undefined;
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

      setRotation(currentRotation => {
        const currentState = rotationStateRef.current;
        let newRotation = currentRotation;
        let shouldContinue = true;

        if (currentState === 'forward') {
          newRotation += ROTATION_SPEED * deltaTime;
        } else if (currentState === 'reverse') {
          newRotation -= ROTATION_SPEED * deltaTime;

          if (newRotation <= targetRotationRef.current) {
            newRotation = targetRotationRef.current;
            setRotationState('idle');
            shouldContinue = false;
          }
        } else if (currentState === 'completing') {
          newRotation += ROTATION_SPEED * deltaTime;

          if (newRotation >= targetRotationRef.current) {
            newRotation = targetRotationRef.current; // Complete to exact target
            setRotationState('idle');
            shouldContinue = false;
          }
        } else {
          shouldContinue = false;
        }

        // Schedule next frame if animation should continue
        if (shouldContinue && currentState !== 'idle') {
          animationRef.current = requestAnimationFrame(animate);
        }

        return newRotation;
      });
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [stopAnimation]);

  const handleMouseEnter = useCallback(() => {
    console.log('🎡 Wheel rotation: Mouse ENTER detected');
    stopAnimation(); // Stop any existing animation
    setRotationState('forward');
    startAnimation();
  }, [stopAnimation, startAnimation]);

  const handleMouseLeave = useCallback(() => {
    const currentState = rotationStateRef.current;
    const currentRotation = rotationRef.current;

    if (currentState === 'forward') {
      stopAnimation();

      // Calculate completion based on current position in the current cycle
      const currentCycle = Math.floor(currentRotation / 360);
      const rotationInCurrentCycle = currentRotation - (currentCycle * 360);
      const completionPercentage = rotationInCurrentCycle / 360;

      if (completionPercentage > 0.5) {
        // More than 50% complete, continue to finish the rotation
        targetRotationRef.current = (currentCycle + 1) * 360;
        setRotationState('completing');
        startAnimation();
      } else {
        // Less than 50% complete, reverse back to start of cycle
        targetRotationRef.current = currentCycle * 360;
        setRotationState('reverse');
        startAnimation();
      }
    }
  }, [stopAnimation, startAnimation]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  const getTransformStyle = useCallback(() => {
    return {
      transform: `rotate(${rotation}deg)`,
      transition: 'none'
    };
  }, [rotation, rotationState]);

  return {
    handleMouseEnter,
    handleMouseLeave,
    getTransformStyle,
    isAnimating: rotationState !== 'idle'
  };
};
