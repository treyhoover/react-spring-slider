import React, { useRef } from "react";
import { useTransition, animated } from "react-spring";
import { SliderState, Page } from "./useSlider";

type Props<T> = React.HTMLAttributes<HTMLDivElement> & {
  disableInitialAnimation?: boolean;
  state: SliderState<T>;
  children: (slide: T, index: number) => JSX.Element;
};

export default function Slider<T>({
  disableInitialAnimation = true,
  state: { page, dir, pageSize, pageIdx },
  style = {},
  children: renderSlide,
  ...props
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const transitions = useTransition<Page<T>, React.CSSProperties>(
    page,
    page => page.id,
    {
      from: { transform: `translateX(${dir === "RIGHT" ? "100" : "-100"}%)` },
      enter: { transform: `translateX(0%)` },
      leave: { transform: `translateX(${dir === "RIGHT" ? "-100" : "100"}%)` },
      config: {
        tension: 300,
        friction: 40
      },
      immediate: disableInitialAnimation && !containerRef.current
    }
  );

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden"
      }}
      {...props}
    >
      {transitions.map(({ item, props, key }) => {
        return (
          <animated.div
            key={key}
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              ...props
            }}
          >
            {item.slides.map((slide, i) => {
              const w = 100 / pageSize + "%";

              return (
                <div
                  key={`${key}-${i}`}
                  style={{ minWidth: w, width: w, maxWidth: w }}
                >
                  {renderSlide(slide, item.startIdx + i)}
                </div>
              );
            })}
          </animated.div>
        );
      })}
    </div>
  );
}
