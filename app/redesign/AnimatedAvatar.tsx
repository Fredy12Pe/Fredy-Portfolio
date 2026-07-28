"use client";

import { motion, useReducedMotion } from "motion/react";

/** Icon local bounds from Figma (56:321 children) */
const ICON = { w: 90.301, h: 96.168 } as const;

const ASSETS = {
  hatShadow: "/images/redesign/assets/avatar-hat-shadow.svg",
  backHat: "/images/redesign/assets/avatar-back-hat.svg",
  head: "/images/redesign/assets/avatar-head.svg",
  rightBrow: "/images/redesign/assets/avatar-right-brow.svg",
  eyes: "/images/redesign/assets/avatar-eyes.svg",
  mouth: "/images/redesign/assets/avatar-mouth.svg",
  topHat: "/images/redesign/assets/avatar-top-hat.svg",
  hair: "/images/redesign/assets/avatar-hair.svg",
  frontHat: "/images/redesign/assets/avatar-front-hat.svg",
  teeth: "/images/redesign/assets/avatar-teeth.svg",
  beard: "/images/redesign/assets/avatar-beard.svg",
  mustache: "/images/redesign/assets/avatar-mustache.svg",
  tongue: "/images/redesign/assets/avatar-tongue.svg",
  ear: "/images/redesign/assets/avatar-ear.svg",
} as const;

/** Shared by Hat Shadow, Back Of Hat, Front of Hat (I56:684;56:323) */
const HAT_BOB = {
  animate: { x: [0, -0.231, 0], y: [0, 1.074, 0] },
  transition: {
    x: { duration: 2, times: [0, 0.5315, 1], ease: "easeInOut" as const, repeat: Infinity },
    y: { duration: 2, times: [0, 0.5315, 1], ease: "easeInOut" as const, repeat: Infinity },
  },
};

type LayerProps = {
  nodeId: string;
  name: string;
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  animate?: Record<string, number[]>;
  transition?: Record<string, unknown>;
  reduced: boolean;
};

function Layer({
  nodeId,
  name,
  src,
  left,
  top,
  width,
  height,
  animate,
  transition,
  reduced,
}: LayerProps) {
  const style = {
    position: "absolute" as const,
    left: `${(left / ICON.w) * 100}%`,
    top: `${(top / ICON.h) * 100}%`,
    width: `${(width / ICON.w) * 100}%`,
    height: `${(height / ICON.h) * 100}%`,
  };

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="absolute inset-0 block size-full max-w-none" draggable={false} />
  );

  if (!animate || reduced) {
    return (
      <div style={style} data-node-id={nodeId} data-name={name}>
        {img}
      </div>
    );
  }

  return (
    <motion.div
      style={style}
      data-node-id={nodeId}
      data-name={name}
      initial={{ x: 0, y: 0 }}
      animate={animate}
      transition={transition}
    >
      {img}
    </motion.div>
  );
}

type AnimatedAvatarProps = {
  className?: string;
};

export default function AnimatedAvatar({ className }: AnimatedAvatarProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={className}
      data-node-id="56:321"
      data-name="Icon"
      initial={reduced ? false : { x: 0, y: 0 }}
      animate={
        reduced
          ? undefined
          : {
              x: [0, -0.049, 0],
              y: [0, 16, 0],
            }
      }
      transition={
        reduced
          ? undefined
          : {
              x: {
                duration: 2,
                times: [0, 0.4995, 1],
                ease: "easeInOut",
                repeat: Infinity,
              },
              y: {
                duration: 2,
                times: [0, 0.4995, 1],
                ease: "easeInOut",
                repeat: Infinity,
              },
            }
      }
    >
      {/* Static group 56:322 — children position against Icon box */}
      <div className="absolute inset-0" data-node-id="56:322">
        <Layer
          nodeId="56:323"
          name="Hat Shadow"
          src={ASSETS.hatShadow}
          left={45.52}
          top={8}
          width={44.781}
          height={30.842}
          animate={HAT_BOB.animate}
          transition={HAT_BOB.transition}
          reduced={reduced}
        />
        <Layer
          nodeId="56:324"
          name="Back Of Hat"
          src={ASSETS.backHat}
          left={43.65}
          top={9.97}
          width={44.607}
          height={29.391}
          animate={HAT_BOB.animate}
          transition={HAT_BOB.transition}
          reduced={reduced}
        />
        <Layer
          nodeId="56:325"
          name="Head"
          src={ASSETS.head}
          left={7.8}
          top={17.68}
          width={76.095}
          height={78.426}
          reduced={reduced}
        />
        <Layer
          nodeId="56:326"
          name="Right Brow"
          src={ASSETS.rightBrow}
          left={66.44}
          top={32.13}
          width={11.136}
          height={4.305}
          animate={{ y: [0, 1.719, 0] }}
          transition={{
            y: { duration: 2, times: [0, 0.503, 1], ease: "easeInOut", repeat: Infinity },
          }}
          reduced={reduced}
        />
        <Layer
          nodeId="56:327"
          name="Eyes & Brows"
          src={ASSETS.eyes}
          left={34.98}
          top={33.06}
          width={40.743}
          height={15.863}
          animate={{ y: [0, 2.004, 0] }}
          transition={{
            y: { duration: 2, times: [0, 0.4877, 1], ease: "easeInOut", repeat: Infinity },
          }}
          reduced={reduced}
        />
        <Layer
          nodeId="56:328"
          name="Mouth"
          src={ASSETS.mouth}
          left={49.67}
          top={61.21}
          width={25.571}
          height={21.2}
          reduced={reduced}
        />
        <Layer
          nodeId="56:338"
          name="Top of Hat"
          src={ASSETS.topHat}
          left={3.5}
          top={0}
          width={63.734}
          height={47.422}
          animate={{ y: [0, 0.999, 0] }}
          transition={{
            y: {
              duration: 2,
              times: [0, 0.5365, 1],
              ease: ["linear", "easeInOut"],
              repeat: Infinity,
            },
          }}
          reduced={reduced}
        />
        <Layer
          nodeId="56:330"
          name="Har"
          src={ASSETS.hair}
          left={0}
          top={31.82}
          width={26.335}
          height={32.187}
          animate={{ y: [0, 1, 0] }}
          transition={{
            y: { duration: 2, times: [0, 0.535, 1], ease: "linear", repeat: Infinity },
          }}
          reduced={reduced}
        />
        <Layer
          nodeId="56:331"
          name="Front of Hat"
          src={ASSETS.frontHat}
          left={23.28}
          top={9.14}
          width={56.896}
          height={24.564}
          animate={HAT_BOB.animate}
          transition={HAT_BOB.transition}
          reduced={reduced}
        />
        <Layer
          nodeId="56:332"
          name="Teeth"
          src={ASSETS.teeth}
          left={49.42}
          top={61.27}
          width={25.815}
          height={7.218}
          reduced={reduced}
        />
        <Layer
          nodeId="56:333"
          name="Beard"
          src={ASSETS.beard}
          left={15.93}
          top={58.54}
          width={61.513}
          height={37.628}
          reduced={reduced}
        />
        <Layer
          nodeId="56:334"
          name="Mustache"
          src={ASSETS.mustache}
          left={46.34}
          top={56.65}
          width={32.096}
          height={14.77}
          reduced={reduced}
        />
        <Layer
          nodeId="56:335"
          name="Tongue"
          src={ASSETS.tongue}
          left={51.24}
          top={74.02}
          width={17.622}
          height={8.511}
          reduced={reduced}
        />
        <Layer
          nodeId="56:336"
          name="Ear"
          src={ASSETS.ear}
          left={2.58}
          top={49.03}
          width={21.874}
          height={25.321}
          reduced={reduced}
        />
      </div>
    </motion.div>
  );
}
