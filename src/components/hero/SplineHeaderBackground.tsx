"use client";
import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineHeaderBackground() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const appRef = useRef<any | null>(null);

  return (
    <>
      {/* Spline Background */}
      <div className="absolute inset-0 w-full h-full">
        <Spline
          scene="https://prod.spline.design/y6VQAELiqSkox8pc/scene.splinecode"
          onLoad={(app) => { 
            appRef.current = app; 
            setSplineLoaded(true);
            console.log('Header Spline loaded successfully');
          }}
          style={{ 
            width: "100%", 
            height: "100%", 
            display: "block", 
            background: "transparent"
          }}
        />
      </div>

      {/* Loading overlay with white background */}
      {!splineLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-white"
        >
          <div className="text-center">
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto"></div>
            </div>
            <div className="text-black text-sm font-medium">Loading...</div>
          </div>
        </div>
      )}
    </>
  );
}
