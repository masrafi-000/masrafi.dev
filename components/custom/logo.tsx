"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function MasrafiLogo() {
  const textRef = useRef<SVGTextElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!textRef.current || !pathRef.current || !dotRef.current) return;

    const totalTextLen = 800;
    const totalPathLen = 400;

    // Set initial states — fill is already gradient, we animate fillOpacity instead
    gsap.set(textRef.current, {
      strokeDasharray: totalTextLen,
      strokeDashoffset: totalTextLen,
      fillOpacity: 0,
    });
    gsap.set(pathRef.current, {
      strokeDasharray: totalPathLen,
      strokeDashoffset: totalPathLen,
      opacity: 0,
    });
    gsap.set(dotRef.current, {
      opacity: 0,
      scale: 0,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    tl
      // 1. Draw the text stroke
      .to(textRef.current, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
      })
      // 2. Smoothly fade in the gradient fill using fillOpacity — no snap!
      .to(
        textRef.current,
        {
          fillOpacity: 1,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "-=0.8",
      )
      // 3. Fade in and draw the underline simultaneously with fill
      .to(
        pathRef.current,
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1.2",
      )
      // 4. Pop in the dot
      .to(
        dotRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(2)",
        },
        "-=0.6",
      )
      // 5. Hold the complete logo for 3.5s
      .to({}, { duration: 3.5 })
      // 6. Fade everything out gracefully
      .to([textRef.current, pathRef.current, dotRef.current], {
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
        stagger: 0.08,
      })
      // 7. Reset invisibly for the next loop iteration
      .set(textRef.current, {
        strokeDashoffset: totalTextLen,
        fillOpacity: 0,
        opacity: 1,
      })
      .set(pathRef.current, {
        strokeDashoffset: totalPathLen,
        opacity: 0,
      })
      .set(dotRef.current, { opacity: 0, scale: 0 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div style={{ background: "transparent", display: "inline-block" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');

        .logo-text {
          font-family: 'Caveat', cursive;
          font-weight: 700;
          font-size: 64px;
          fill: url(#logoGradient);
          stroke: url(#logoGradient);
          stroke-width: 1;
        }

        .logo-underline {
          stroke: #c96442;
          stroke-width: 2;
          stroke-linecap: round;
        }

        .logo-dot {
          fill: #c96442;
        }
      `}</style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 10 420 90"
        width="420"
        height="90"
        style={{ background: "transparent" }}
        className="w-36 sm:w-44 md:w-56 h-auto drop-shadow-md"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#b05730", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#c96442", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <g>
          <text ref={textRef} x="20" y="75" className="logo-text">
            Masrafi.dev
          </text>

          <path
            ref={pathRef}
            d="M25 90 Q 150 110 400 80"
            fill="none"
            className="logo-underline"
          />

          <circle ref={dotRef} cx="395" cy="77" r="5" className="logo-dot" />
        </g>
      </svg>
    </div>
  );
}
