"use client";

import { useEffect, useRef, type ImgHTMLAttributes } from "react";

export default function StageImage({
  onReady,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { onReady?: () => void }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const notified = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    notified.current = false;
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) {
      notified.current = true;
      onReadyRef.current?.();
    }
  }, [props.src]);

  return (
    <img
      {...props}
      alt={props.alt ?? ""}
      ref={imgRef}
      onLoad={() => {
        if (notified.current) {
          return;
        }
        notified.current = true;
        onReadyRef.current?.();
      }}
    />
  );
}
