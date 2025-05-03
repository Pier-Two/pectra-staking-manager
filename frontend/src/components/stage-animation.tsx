import { AnimatePresence, motion } from "framer-motion";
import { cn } from "pec/lib/utils";
import { createContext, useContext, useRef, useState } from "react";

type Direction = "left" | "right" | "none";

/**
 * Context for the stage animation.
 */
const StageAnimationContext = createContext<{
  direction: Direction;
  stepClassName?: string;
  currentStage?: string;
}>({
  direction: "none",
  stepClassName: undefined,
  currentStage: undefined,
});

/**
 * Allows us to detect when a stage is rendered and unrendered.
 * Also provides a context which allows us to determine the direction of the stage animation.
 *
 * The only children to this component should be StageAnimationStep components.
 */
export const StageAnimationParent = ({
  children,
  stage,
  stageOrder,
  stepClassName: stepClassName,
}: {
  children: React.ReactNode;
  stage: string;
  stageOrder: string[];
  /**
   * Optional className to apply to each stage.
   * This can be overridden by the className prop on StageAnimationStep.
   */
  stepClassName?: string;
}) => {
  // Keep track of both the current stage and the direction in a single state
  const [[currentStage, direction], setStageAndDirection] = useState<
    [string, Direction]
  >([stage, "none"]);

  // Function to update stage with proper direction handling
  const updateStage = (newStage: string) => {
    // Only update if stage is actually changing
    if (newStage !== currentStage) {
      const currentIndex = stageOrder.indexOf(currentStage);
      const newIndex = stageOrder.indexOf(newStage);

      // Calculate direction based on indices
      const newDirection = newIndex > currentIndex ? "left" : "right";

      // Update both stage and direction together
      setStageAndDirection([newStage, newDirection]);
    }
  };

  // Keep the stage in sync with the parent's stage prop
  // Only run this once on initial mount to set up
  const initialRender = useRef(true);
  if (initialRender.current) {
    initialRender.current = false;
    if (stage !== currentStage) {
      setStageAndDirection([stage, "none"]);
    }
  }

  // If the parent forces a stage change, we need to handle direction
  if (stage !== currentStage) {
    updateStage(stage);
  }

  return (
    <StageAnimationContext.Provider
      value={{ direction, stepClassName, currentStage }}
    >
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {children}
      </AnimatePresence>
    </StageAnimationContext.Provider>
  );
};

/**
 * Provides entry and exit animations for a stage.
 * Should be rendered as a child of StageAnimationParent.
 *
 * Make sure to also add a unique key prop to the component.
 */
export const StageAnimationStep = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { direction, stepClassName } = useContext(StageAnimationContext);

  const variants = {
    initial: (direction: Direction) => {
      if (direction === "none") {
        return {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
        };
      }
      return {
        opacity: 0,
        x: direction === "left" ? 150 : -150,
        filter: "blur(10px)",
      };
    },
    animate: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
    },
    exit: (direction: Direction) => {
      if (direction === "none") {
        return {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
        };
      }
      return {
        opacity: 0,
        x: direction === "left" ? -150 : 150,
        filter: "blur(10px)",
      };
    },
  };

  return (
    <motion.div
      custom={direction}
      className={cn(stepClassName, className)}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};
