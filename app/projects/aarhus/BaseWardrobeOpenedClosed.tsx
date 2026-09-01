"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./base-wardrobe.module.css";
import { useStageScale } from "./useStageScale";

const ASSETS = {
  closedRoom: "/projects/aarhus/wardrobe/wardrobe-closed.png",
  closedGlass: "/projects/aarhus/wardrobe/closed-glass.png",
  closedMirror: "/projects/aarhus/wardrobe/wardrobe-closed-mirror.png",
  openedRoom: "/projects/aarhus/wardrobe/wardrobe-opened.png",
  openedLight: "/projects/aarhus/wardrobe/wardrobe-opened-light.png",
  openedInterior: "/projects/aarhus/wardrobe/opened-background.png",
  doubleClosed: "/projects/aarhus/wardrobe/wardrobe-double-closed.png",
  doubleClosedMirror: "/projects/aarhus/wardrobe/wardrobe-double-closed-mirror.png",
  doubleBgExpanded: "/projects/aarhus/wardrobe/double-bg-expanded.png",
  wardrobePiece1: "/projects/aarhus/wardrobe/wardrobe-piece1.png",
  wardrobePiece1Light: "/projects/aarhus/wardrobe/wardrobe-piece1-light.png",
  expandColumn: "/projects/aarhus/wardrobe/column-expanded.png",
  expandColumnLight: "/projects/aarhus/wardrobe/column-expanded-light.png",
  expandBay: "/projects/aarhus/wardrobe/bay-interior.png",
  expandBayLight: "/projects/aarhus/wardrobe/bay-interior-light.png",
  closetInsideLight: "/projects/aarhus/wardrobe/closet-inside-light.png",
  rectangle17: "/projects/aarhus/wardrobe/right-shadow.svg",
  highlightBase: "/projects/aarhus/wardrobe/highlight-base.png",
  highlightExtended: "/projects/aarhus/wardrobe/highlight-extended.png",
  highlightExtendedLight: "/projects/aarhus/wardrobe/highlight-extended-light.png",
  doorShadowOpened: "/projects/aarhus/wardrobe/ellipse-opened.svg",
  rightSideShadowDouble: "/projects/aarhus/wardrobe/right-side-shadow-double.png",
  hanger: "/projects/aarhus/wardrobe/hanger.svg",
  floorShadow: "/projects/aarhus/wardrobe/floor-shadow.svg",
  sweater1: "/projects/aarhus/wardrobe/sweater-1.png",
  sweater2: "/projects/aarhus/wardrobe/sweater-2.png",
  sweater3: "/projects/aarhus/wardrobe/sweater-3.png",
  sweater4: "/projects/aarhus/wardrobe/sweater-4.png",
  sweater5: "/projects/aarhus/wardrobe/sweater-5.png",
  sweater6: "/projects/aarhus/wardrobe/sweater-6.png",
  lightBtnOff: "/projects/aarhus/wardrobe/light-btn-off.svg",
  lightBtnOn: "/projects/aarhus/wardrobe/light-btn-on.svg",
} as const;

function spring(a: number, b: number, c: number) {
  return (t: number) =>
    1 - Math.exp(-t * a) * (Math.cos(t * b) + c * Math.sin(t * b));
}

const EXPAND_X = 97;
const EXPAND_REVEAL_X = 83;

const EXPAND_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 28,
  mass: 1,
};
const REVEAL_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 26,
  mass: 1,
};
const EXPAND_SPRING_LIT = {
  type: "spring" as const,
  stiffness: 480,
  damping: 32,
  mass: 0.8,
};
const REVEAL_SPRING_LIT = {
  type: "spring" as const,
  stiffness: 480,
  damping: 30,
  mass: 0.8,
};

const SWAP_FADE = {
  duration: 0.12,
  ease: [0.4, 0, 0.2, 1] as const,
};
const SWAP_FADE_LIT = {
  duration: 0.08,
  ease: [0.4, 0, 0.2, 1] as const,
};

type SweaterMotion = {
  opacity: number;
  rotate: number;
  x: number;
  y: number;
  className: string;
  src: string;
  imgClass: string;
  opacityTimes: number[];
  rotateTimes: number[];
  yTimes: number[];
  rotateEase: (t: number) => number;
  yEase: (t: number) => number;
};

const SWEATERS: SweaterMotion[] = [
  {
    className: styles.sweater6,
    src: ASSETS.sweater6,
    imgClass: styles.sweater6Img,
    opacity: 0.4,
    rotate: 2.8,
    x: -9,
    y: -2,
    opacityTimes: [0, 0.015, 0.19, 1],
    rotateTimes: [0, 0.015, 0.59, 1],
    yTimes: [0, 0.04, 0.64, 1],
    rotateEase: spring(7.4241, 10.9836, 0.6759),
    yEase: spring(7.58, 7.9075, 0.9586),
  },
  {
    className: styles.sweater5,
    src: ASSETS.sweater5,
    imgClass: styles.sweater5Img,
    opacity: 0.4,
    rotate: -1.8,
    x: 5,
    y: -3,
    opacityTimes: [0, 0.08, 0.255, 1],
    rotateTimes: [0, 0.08, 0.53, 1],
    yTimes: [0, 0.105, 0.58, 1],
    rotateEase: spring(7.5258, 8.7987, 0.8553),
    yEase: spring(7.6739, 6.6648, 1.1514),
  },
  {
    className: styles.sweater3,
    src: ASSETS.sweater3,
    imgClass: styles.sweater3Img,
    opacity: 0.4,
    rotate: -2,
    x: 6,
    y: -3,
    opacityTimes: [0, 0.1, 0.275, 1],
    rotateTimes: [0, 0.1, 0.65, 1],
    yTimes: [0, 0.125, 0.7, 1],
    rotateEase: spring(7.591, 7.7443, 0.9802),
    yEase: spring(7.7357, 6.0035, 1.2885),
  },
];

const SWEATER1: SweaterMotion = {
  className: styles.sweater1,
  src: ASSETS.sweater1,
  imgClass: styles.sweater1Img,
  opacity: 0.4,
  rotate: -3,
  x: 10,
  y: -3,
  opacityTimes: [0, 0.025, 0.2, 1],
  rotateTimes: [0, 0.025, 0.625, 1],
  yTimes: [0, 0.05, 0.675, 1],
  rotateEase: spring(7.4901, 9.4786, 0.7902),
  yEase: spring(7.6405, 7.0695, 1.0808),
};

const SWEATER2 = {
  opacity: 0.4,
  rotate: 2.5,
  x: -7,
  y: -2,
  opacityTimes: [0, 0.06, 0.235, 1],
  rotateTimes: [0, 0.06, 0.56, 1],
  yTimes: [0, 0.085, 0.61, 1],
  rotateEase: spring(7.4454, 10.4572, 0.712),
  yEase: spring(7.5993, 7.6231, 0.9969),
};

const SWEATER4 = {
  opacity: 0.4,
  rotate: 3,
  x: -8,
  y: -2,
  opacityTimes: [0, 0.04, 0.215, 1],
  rotateTimes: [0, 0.04, 0.69, 1],
  yTimes: [0, 0.065, 0.74, 1],
  rotateEase: spring(7.3832, 12.1279, 0.6088),
  yEase: spring(7.5433, 8.4945, 0.888),
};

function sweaterTransition(
  item: {
    opacityTimes: number[];
    rotateTimes: number[];
    yTimes: number[];
    rotateEase: (t: number) => number;
    yEase: (t: number) => number;
  },
  reduceMotion: boolean,
) {
  if (reduceMotion) {
    return { duration: 0 };
  }

  return {
    opacity: {
      duration: 2,
      times: item.opacityTimes,
      ease: ["linear", "easeOut", "linear"] as const,
    },
    rotate: {
      duration: 2,
      times: item.rotateTimes,
      ease: ["linear", item.rotateEase, "linear"] as const,
    },
    x: {
      duration: 2,
      times: item.rotateTimes,
      ease: ["linear", item.rotateEase, "linear"] as const,
    },
    y: {
      duration: 2,
      times: item.yTimes,
      ease: ["linear", item.yEase, "linear"] as const,
    },
  };
}

function sweaterInitial(
  item: { opacity: number; rotate: number; x: number; y: number },
  reduceMotion: boolean,
) {
  if (reduceMotion) {
    return { opacity: 1, rotate: 0, x: 0, y: 0 };
  }

  return {
    opacity: item.opacity,
    rotate: item.rotate,
    x: item.x,
    y: item.y,
  };
}

function sweaterAnimate(
  item: { opacity: number; rotate: number; x: number; y: number },
  reduceMotion: boolean,
) {
  if (reduceMotion) {
    return { opacity: 1, rotate: 0, x: 0, y: 0 };
  }

  return {
    opacity: [item.opacity, item.opacity, 1, 1],
    rotate: [item.rotate, item.rotate, 0, 0],
    x: [item.x, item.x, 0, 0],
    y: [item.y, item.y, 0, 0],
  };
}

function SweaterLayers({
  sweaterRun,
  reduceMotion,
}: {
  sweaterRun: number;
  reduceMotion: boolean;
}) {
  return (
    <>
      {SWEATERS.map((item) => (
        <motion.div
          key={`${item.src}-${sweaterRun}`}
          className={item.className}
          initial={sweaterInitial(item, reduceMotion)}
          animate={sweaterAnimate(item, reduceMotion)}
          transition={sweaterTransition(item, reduceMotion)}
        >
          <span className={styles.sweaterCrop}>
            <img
              className={item.imgClass}
              src={item.src}
              alt=""
              draggable={false}
            />
          </span>
        </motion.div>
      ))}

      <motion.div
        key={`sweater2-${sweaterRun}`}
        className={styles.sweater2}
        initial={sweaterInitial(SWEATER2, reduceMotion)}
        animate={sweaterAnimate(SWEATER2, reduceMotion)}
        transition={sweaterTransition(SWEATER2, reduceMotion)}
      >
        <span className={styles.sweaterCrop}>
          <img
            className={styles.sweater2Img}
            src={ASSETS.sweater2}
            alt=""
            draggable={false}
          />
        </span>
        <span className={styles.hanger}>
          <img src={ASSETS.hanger} alt="" draggable={false} />
        </span>
      </motion.div>

      <motion.div
        key={`sweater4-${sweaterRun}`}
        className={styles.sweater4}
        initial={sweaterInitial(SWEATER4, reduceMotion)}
        animate={sweaterAnimate(SWEATER4, reduceMotion)}
        transition={sweaterTransition(SWEATER4, reduceMotion)}
      >
        <span className={styles.sweaterCrop}>
          <img
            className={styles.sweater4Img}
            src={ASSETS.sweater4}
            alt=""
            draggable={false}
          />
        </span>
      </motion.div>

      <motion.div
        key={`sweater1-${sweaterRun}`}
        className={SWEATER1.className}
        initial={sweaterInitial(SWEATER1, reduceMotion)}
        animate={sweaterAnimate(SWEATER1, reduceMotion)}
        transition={sweaterTransition(SWEATER1, reduceMotion)}
      >
        <span className={styles.sweaterCrop}>
          <img
            className={SWEATER1.imgClass}
            src={SWEATER1.src}
            alt=""
            draggable={false}
          />
        </span>
      </motion.div>
    </>
  );
}

type MotionTransition =
  | typeof SWAP_FADE
  | { duration: number; ease?: typeof SWAP_FADE.ease };

function transitionDuration(transition: MotionTransition): number {
  if ("duration" in transition && typeof transition.duration === "number") {
    return transition.duration;
  }

  return SWAP_FADE.duration;
}

type HighlightVariant = "base" | "extended" | "extendedLight";

/** Crossfaded floor highlight — outgoing layer stays full until incoming is in */
function FloorHighlight({
  variant,
  transition,
}: {
  variant: HighlightVariant;
  transition: MotionTransition;
}) {
  const duration = transitionDuration(transition);
  const fade = {
    duration,
    ease: "ease" in transition ? transition.ease : SWAP_FADE.ease,
  };

  function layerTransition(active: boolean) {
    return {
      opacity: {
        ...fade,
        delay: active ? 0 : duration,
      },
    };
  }

  return (
    <div className={styles.floorHighlightStack} aria-hidden>
      <motion.img
        className={`${styles.floorHighlightBaseImg} ${
          variant === "base"
            ? styles.floorHighlightOver
            : styles.floorHighlightUnder
        }`}
        src={ASSETS.highlightBase}
        alt=""
        width={476}
        height={61}
        draggable={false}
        initial={false}
        animate={{ opacity: variant === "base" ? 1 : 0 }}
        transition={layerTransition(variant === "base")}
      />
      <motion.img
        className={`${styles.floorHighlightExtendedImg} ${
          variant === "extended"
            ? styles.floorHighlightOver
            : styles.floorHighlightUnder
        }`}
        src={ASSETS.highlightExtended}
        alt=""
        width={523}
        height={61}
        draggable={false}
        initial={false}
        animate={{ opacity: variant === "extended" ? 1 : 0 }}
        transition={layerTransition(variant === "extended")}
      />
      <motion.img
        className={`${styles.floorHighlightExtendedImg} ${
          variant === "extendedLight"
            ? styles.floorHighlightOver
            : styles.floorHighlightUnder
        }`}
        src={ASSETS.highlightExtendedLight}
        alt=""
        width={523}
        height={61}
        draggable={false}
        initial={false}
        animate={{ opacity: variant === "extendedLight" ? 1 : 0 }}
        transition={layerTransition(variant === "extendedLight")}
      />
    </div>
  );
}

function RightSideShadow({
  visible,
  transition,
}: {
  visible: boolean;
  transition: MotionTransition;
}) {
  return (
    <motion.div
      className={styles.rightSideShadowDouble}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={transition}
      aria-hidden
    >
      <img
        src={ASSETS.rightSideShadowDouble}
        alt=""
        width={287}
        height={680}
        draggable={false}
      />
    </motion.div>
  );
}

function DoubleColumnScene({
  expanded,
  mountExpanded,
  expandSpring,
  revealSpring,
  swapTransition,
  ledOn,
  onRest,
}: {
  expanded: boolean;
  mountExpanded: boolean;
  expandSpring: typeof EXPAND_SPRING | typeof EXPAND_SPRING_LIT | { duration: number };
  revealSpring: typeof REVEAL_SPRING | typeof REVEAL_SPRING_LIT | { duration: number };
  swapTransition: MotionTransition;
  ledOn: boolean;
  onRest: () => void;
}) {
  return (
    <>
      <motion.div
        className={styles.doubleBg}
        initial={{ opacity: mountExpanded ? 1 : 0 }}
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={swapTransition}
        aria-hidden
      >
        <img
          src={ASSETS.doubleBgExpanded}
          alt=""
          width={840}
          height={680}
          draggable={false}
        />
      </motion.div>

      <div
        className={`${styles.doubleColumnShift} ${
          ledOn ? styles.doubleColumnLitShift : ""
        }`}
      >
      <div className={styles.wardrobePiece1} aria-hidden>
        <motion.img
          className={styles.wardrobePiece1Img}
          src={ASSETS.wardrobePiece1}
          alt=""
          width={436}
          height={573}
          draggable={false}
          initial={false}
          animate={{ opacity: ledOn ? 0 : 1 }}
          transition={swapTransition}
        />
        <motion.img
          className={styles.wardrobePiece1Img}
          src={ASSETS.wardrobePiece1Light}
          alt=""
          width={436}
          height={573}
          draggable={false}
          initial={false}
          animate={{ opacity: ledOn ? 1 : 0 }}
          transition={swapTransition}
        />
      </div>

      <div className={styles.closetInside} aria-hidden>
        <motion.img
          className={styles.closetInsideImg}
          src={ASSETS.openedInterior}
          alt=""
          width={1152}
          height={928}
          draggable={false}
          initial={false}
          animate={{ opacity: ledOn ? 0 : 1 }}
          transition={swapTransition}
        />
      </div>

      <motion.div
        className={styles.closetInsideLit}
        initial={false}
        animate={{ opacity: ledOn ? 1 : 0 }}
        transition={swapTransition}
        aria-hidden
      >
        <img
          src={ASSETS.closetInsideLight}
          alt=""
          width={170}
          height={345}
          draggable={false}
        />
      </motion.div>

      <div className={styles.expandLayer} aria-hidden>
        <motion.span
          className={styles.expandReveal}
          initial={{ x: mountExpanded ? 0 : -EXPAND_REVEAL_X }}
          animate={{ x: expanded ? 0 : -EXPAND_REVEAL_X }}
          transition={revealSpring}
        >
          <motion.img
            className={styles.expandRevealImg}
            src={ASSETS.expandColumn}
            alt=""
            width={1152}
            height={928}
            draggable={false}
            initial={false}
            animate={{ opacity: ledOn ? 0 : 1 }}
            transition={swapTransition}
          />
          <motion.img
            className={styles.expandRevealLitImg}
            src={ASSETS.expandColumnLight}
            alt=""
            width={97}
            height={553}
            draggable={false}
            initial={false}
            animate={{ opacity: ledOn ? 1 : 0 }}
            transition={swapTransition}
          />
        </motion.span>
        <motion.span
          className={styles.expandBay}
          initial={{ x: mountExpanded ? EXPAND_X : 0 }}
          animate={{ x: expanded ? EXPAND_X : 0 }}
          transition={expandSpring}
          onAnimationComplete={(definition) => {
            if (
              !expanded &&
              typeof definition === "object" &&
              definition !== null &&
              "x" in definition &&
              definition.x === 0
            ) {
              onRest();
            }
          }}
        >
          <motion.img
            className={styles.expandBayImg}
            src={ASSETS.expandBay}
            alt=""
            width={436}
            height={573}
            draggable={false}
            initial={false}
            animate={{ opacity: ledOn ? 0 : 1 }}
            transition={swapTransition}
          />
          <motion.img
            className={styles.expandBayLitImg}
            src={ASSETS.expandBayLight}
            alt=""
            width={172}
            height={571}
            draggable={false}
            initial={false}
            animate={{ opacity: ledOn ? 1 : 0 }}
            transition={swapTransition}
          />
        </motion.span>
      </div>
      </div>
    </>
  );
}

export default function BaseWardrobeOpenedClosed({
  ledOn = false,
  onLedChange,
  doorPanel = "standard",
  interior = "single",
  opened,
  onOpenedChange,
}: {
  ledOn?: boolean;
  onLedChange?: (on: boolean) => void;
  doorPanel?: "standard" | "mirror";
  interior?: "single" | "double";
  opened: boolean;
  onOpenedChange: (open: boolean) => void;
}) {
  const [doubleMounted, setDoubleMounted] = useState(false);
  const [sweaterRun, setSweaterRun] = useState(0);
  const prevOpened = useRef(false);
  const prevIsDouble = useRef(interior === "double");
  const mountExpanded = useRef(false);
  const isDoubleRef = useRef(interior === "double");
  const reduceMotion = useReducedMotion();
  const rootRef = useStageScale();
  const fade = { duration: reduceMotion ? 0 : 0.18, ease: "easeOut" as const };
  const swapTransition: MotionTransition = reduceMotion
    ? { duration: 0 }
    : ledOn
      ? SWAP_FADE_LIT
      : SWAP_FADE;
  const expandSpring = reduceMotion
    ? { duration: 0 }
    : ledOn
      ? EXPAND_SPRING_LIT
      : EXPAND_SPRING;
  const revealSpring = reduceMotion
    ? { duration: 0 }
    : ledOn
      ? REVEAL_SPRING_LIT
      : REVEAL_SPRING;
  const isMirror = doorPanel === "mirror";
  const isDouble = interior === "double";
  const showSingleClosed = !opened && !isMirror && !isDouble;
  const showSingleMirror = !opened && isMirror && !isDouble;
  const showDoubleClosed = !opened && isDouble && !isMirror;
  const showDoubleMirror = !opened && isDouble && isMirror;
  const showSingleLed = opened && ledOn && !isDouble;
  const motionDisabled = Boolean(reduceMotion);

  isDoubleRef.current = isDouble;

  if (opened && isDouble && !doubleMounted) {
    mountExpanded.current = !prevOpened.current;
    setDoubleMounted(true);
  } else if (!opened && doubleMounted) {
    setDoubleMounted(false);
  }

  useEffect(() => {
    if (opened && !prevOpened.current) {
      setSweaterRun((run) => run + 1);
    }

    prevOpened.current = opened;
  }, [opened]);

  useEffect(() => {
    if (!opened) {
      prevIsDouble.current = isDouble;
      return;
    }

    if (prevIsDouble.current !== isDouble) {
      setSweaterRun((run) => run + 1);
      prevIsDouble.current = isDouble;
    }
  }, [isDouble, opened]);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.scene}>
        <div className={styles.room} aria-hidden>
          <img
            src={ASSETS.closedRoom}
            alt=""
            width={840}
            height={680}
            draggable={false}
          />
        </div>

        <div
          className={styles.closedDoor}
          aria-hidden
          style={{ opacity: showSingleClosed ? 1 : 0 }}
        >
          <span className={styles.closedGlass}>
            <img
              src={ASSETS.closedGlass}
              alt=""
              width={883}
              height={883}
              draggable={false}
            />
          </span>
        </div>

        {opened ? (
          <>
            <motion.div
              className={styles.openedRoom}
              initial={false}
              animate={{ opacity: isDouble ? 0 : 1 }}
              transition={swapTransition}
              aria-hidden
            >
              <img
                src={ASSETS.openedRoom}
                alt=""
                width={840}
                height={680}
                draggable={false}
              />
            </motion.div>

            <motion.div
              className={styles.openedInterior}
              initial={false}
              animate={{ opacity: isDouble ? 0 : 1 }}
              transition={swapTransition}
              aria-hidden
            >
              <img
                src={ASSETS.openedInterior}
                alt=""
                width={1152}
                height={928}
                draggable={false}
              />
            </motion.div>
          </>
        ) : null}

        <div
          className={styles.closedMirror}
          aria-hidden
          style={{ opacity: showSingleMirror ? 1 : 0 }}
        >
          <img
            src={ASSETS.closedMirror}
            alt=""
            width={840}
            height={680}
            draggable={false}
          />
        </div>

        <div
          className={styles.doubleClosed}
          aria-hidden
          style={{ opacity: showDoubleClosed ? 1 : 0 }}
        >
          <img
            src={ASSETS.doubleClosed}
            alt=""
            width={840}
            height={680}
            draggable={false}
          />
        </div>

        <div
          className={styles.doubleClosedMirror}
          aria-hidden
          style={{ opacity: showDoubleMirror ? 1 : 0 }}
        >
          <img
            src={ASSETS.doubleClosedMirror}
            alt=""
            width={840}
            height={680}
            draggable={false}
          />
        </div>

        {opened && doubleMounted ? (
          <DoubleColumnScene
            expanded={isDouble}
            mountExpanded={mountExpanded.current}
            expandSpring={expandSpring}
            revealSpring={revealSpring}
            swapTransition={swapTransition}
            ledOn={ledOn}
            onRest={() => {
              if (!isDoubleRef.current) {
                setDoubleMounted(false);
              }
            }}
          />
        ) : null}

        {opened ? (
          <>
            <FloorHighlight
              variant={
                isDouble
                  ? ledOn
                    ? "extendedLight"
                    : "extended"
                  : "base"
              }
              transition={swapTransition}
            />

            <RightSideShadow
              visible={isDouble}
              transition={swapTransition}
            />

            <motion.div
              className={styles.rectangle17}
              initial={false}
              animate={{ opacity: isDouble ? 0 : 1 }}
              transition={swapTransition}
              aria-hidden
            >
              <img src={ASSETS.rectangle17} alt="" draggable={false} />
            </motion.div>

            <motion.div
              className={styles.doorShadowOpened}
              initial={false}
              animate={{ opacity: isDouble ? 0 : 1 }}
              transition={swapTransition}
              aria-hidden
            >
              <img src={ASSETS.doorShadowOpened} alt="" draggable={false} />
            </motion.div>

            <div className={styles.leftDoorShadow} aria-hidden>
              <img src={ASSETS.floorShadow} alt="" draggable={false} />
            </div>

            <div
              className={`${styles.sweaterShift} ${
                isDouble && ledOn ? styles.sweaterShiftLit : ""
              }`}
            >
              <SweaterLayers
                sweaterRun={sweaterRun}
                reduceMotion={motionDisabled}
              />
            </div>
          </>
        ) : null}

        <AnimatePresence>
          {showSingleLed ? (
            <motion.div
              key="lit"
              className={styles.litOpen}
              initial={
                reduceMotion || doubleMounted
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
              animate={{ opacity: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={fade}
              aria-hidden
            >
              <img
                src={ASSETS.openedLight}
                alt=""
                width={840}
                height={680}
                draggable={false}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          className={`${styles.hotspot} ${opened ? styles.hotspotClose : ""}`}
          aria-label={opened ? "Close wardrobe" : "Open wardrobe"}
          aria-pressed={opened}
          onClick={() => onOpenedChange(!opened)}
        >
          <span className={styles.hotspotBubble} aria-hidden>
            <span className={styles.hotspotRing} />
            <span className={styles.hotspotDot} />
          </span>
          <span className={styles.openPopup} aria-hidden>
            {opened ? "Close wardrobe" : "Open wardrobe"}
          </span>
        </button>

        {opened ? (
          <button
            type="button"
            className={styles.lightBtn}
            aria-label={ledOn ? "Turn off interior light" : "Turn on interior light"}
            aria-pressed={ledOn}
            onClick={() => onLedChange?.(!ledOn)}
          >
            <span className={styles.lightBtnBubble} aria-hidden>
              <img
                src={ledOn ? ASSETS.lightBtnOn : ASSETS.lightBtnOff}
                alt=""
                width={40}
                height={40}
                draggable={false}
              />
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
