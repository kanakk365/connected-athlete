"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { clsx, type ClassValue } from "clsx";
import * as Color from "color-bits";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback: string = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;
  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const el = document.createElement("div");
      el.style.color = cssColor;
      document.body.appendChild(el);
      const computed = window.getComputedStyle(el).color;
      document.body.removeChild(el);
      return Color.formatRGBA(Color.parse(computed));
    }
    return Color.formatRGBA(Color.parse(cssColor));
  } catch {
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

// ── Flickering Grid ─────────────────────────────────────────────────────────

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, w, h);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w;
      maskCanvas.height = h;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, w / (2 * dpr), h / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const sw = squareSize * dpr;
          const sh = squareSize * dpr;
          const maskData = maskCtx.getImageData(x, y, sw, sh).data;
          const hasText = maskData.some(
            (v, idx) => idx % 4 === 0 && v > 0,
          );
          const opacity = squares[i * rows + j];
          const finalOpacity = hasText
            ? Math.min(1, opacity * 3 + 0.4)
            : opacity;
          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, sw, sh);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cols = Math.ceil(w / (squareSize + gridGap));
      const rows = Math.ceil(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime)
          squares[i] = Math.random() * maxOpacity;
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateSize = () => {
      const nw = width || container.clientWidth;
      const nh = height || container.clientHeight;
      setCanvasSize({ width: nw, height: nh });
      gridParams = setupCanvas(canvas, nw, nh);
    };

    updateSize();
    let lastTime = 0;

    const animate = (time: number) => {
      if (!isInView) return;
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, dt);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
      animationFrameId = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    const io = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      io.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
};

// ── Media Query Hook ─────────────────────────────────────────────────────────

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    const check = () => setValue(window.matchMedia(query).matches);
    check();
    window.addEventListener("resize", check);
    const mq = window.matchMedia(query);
    mq.addEventListener("change", check);
    return () => {
      window.removeEventListener("resize", check);
      mq.removeEventListener("change", check);
    };
  }, [query]);
  return value;
}

// ── Site config ──────────────────────────────────────────────────────────────

const footerLinks = [
  {
    title: "Platform",
    links: [
      { id: 1, title: "Dashboard", url: "/dashboard" },
      { id: 2, title: "Wearables", url: "#" },
      { id: 3, title: "Analytics", url: "#" },
      { id: 4, title: "API", url: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { id: 5, title: "About", url: "#" },
      { id: 6, title: "Blog", url: "#" },
      { id: 7, title: "Careers", url: "#" },
      { id: 8, title: "Contact", url: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { id: 9,  title: "Privacy", url: "#" },
      { id: 10, title: "Terms", url: "#" },
      { id: 11, title: "Security", url: "#" },
      { id: 12, title: "Support", url: "#" },
    ],
  },
];

// ── Footer Component ─────────────────────────────────────────────────────────

export function FlickeringFooter() {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer
      id="footer"
      className="w-full border-t border-[#1a1a1a] bg-[#080808]"
    >
      {/* Top section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between px-6 lg:px-12 pt-16 pb-10 container mx-auto border-x border-[#1a1a1a]">
        {/* Brand */}
        <div className="flex flex-col items-start gap-y-5 max-w-xs">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#7C5CFC]" />
            <span className="font-sans font-bold tracking-[0.14em] uppercase text-white text-sm">
              Connected Athlete
            </span>
          </Link>
          <p className="text-[14px] leading-[1.6] text-[#666] font-mono">
            One unified platform aggregating biometric data from every wearable.
            Built for performance coaches who demand precision.
          </p>
          <p className="text-[11px] font-mono text-[#333] uppercase tracking-widest">
            ALL RIGHTS RESERVED © 2026
          </p>
        </div>

        {/* Links */}
        <div className="pt-10 md:pt-0 md:w-1/2">
          <div className="flex flex-col items-start md:flex-row md:justify-between gap-10 md:gap-5 lg:pl-10">
            {footerLinks.map((col, i) => (
              <ul key={i} className="flex flex-col gap-y-2">
                <li className="mb-2 text-[11px] font-mono font-semibold text-[#555] uppercase tracking-widest">
                  {col.title}
                </li>
                {col.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center gap-1 text-[14px] text-[#666] hover:text-[#e8e8e8] transition-colors"
                  >
                    <Link href={link.url}>{link.title}</Link>
                    <div className="flex size-4 items-center justify-center border border-[#333] rounded translate-x-0 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRightIcon className="h-3 w-3 text-[#7C5CFC]" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Flickering grid banner */}
      <div className="w-full h-44 md:h-56 relative mt-8 z-0 overflow-hidden">
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #080808 0%, transparent 40%, transparent 60%, #080808 100%)",
          }}
        />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text={tablet ? "Connected" : "Connected Athlete"}
            fontSize={tablet ? 64 : 88}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#7C5CFC"
            maxOpacity={0.25}
            flickerChance={0.09}
          />
        </div>
      </div>
    </footer>
  );
}
