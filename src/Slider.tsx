import React, { useReducer, useRef } from "react";
import { useTransition, animated } from "react-spring";

type State = {
  pageIdx: number;
  dir: "RIGHT" | "LEFT";
  animating: boolean;
};

const defaultState: State = {
  pageIdx: 0,
  dir: "RIGHT",
  animating: false
};

const reducer = (state: State, action: any) => {
  switch (action.type) {
    case "STOP_ANIMATING":
      return {
        ...state,
        animating: false
      };
    case "PAGE_RIGHT":
      return {
        ...state,
        ...action.payload,
        dir: "RIGHT",
        animating: true
      };
    case "PAGE_LEFT":
      return {
        ...state,
        ...action.payload,
        dir: "LEFT",
        animating: true
      };
    default:
      return state;
  }
};

type Props<T> = {
  items?: T[];
  pageSize?: number;
  wrap?: boolean;
  disableInitialAnimation?: boolean;
};

type Page<T> = {
  id: number;
  slides: T[];
};

export default function Slider<T>({
  items = [],
  pageSize = 1,
  wrap = true,
  disableInitialAnimation = true
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { pageIdx, dir, animating } = state;

  const maxPageIdx = Math.ceil(items.length / pageSize);

  const pageRight = () => {
    const isMax = pageIdx === maxPageIdx;

    if (!isMax || wrap) {
      dispatch({
        type: "PAGE_RIGHT",
        payload: {
          pageIdx: isMax ? 0 : pageIdx + 1
        }
      });
    }
  };

  const pageLeft = () => {
    const isMin = pageIdx === 0;

    if (!isMin || wrap) {
      dispatch({
        type: "PAGE_LEFT",
        payload: {
          pageIdx: isMin ? maxPageIdx : pageIdx - 1
        }
      });
    }
  };

  const resolveItemIdx = (x: number) => (x + items.length) % items.length;

  const getPage = (idx: number): Page<T> => {
    const slides = [];

    for (let i = 0; i < pageSize; i++) {
      const itemIdx = resolveItemIdx(idx * pageSize + i);

      slides.push(items[itemIdx]);
    }

    return {
      id: pageIdx,
      slides
    };
  };

  const page = getPage(pageIdx);

  const handleKeyDown: React.KeyboardEventHandler = e => {
    if (animating) return;

    if (e.key === "ArrowLeft") {
      pageLeft();
    } else if (e.key === "ArrowRight") {
      pageRight();
    }
  };

  const transitions = useTransition<Page<T>, any>(page, page => page.id, {
    from: { transform: `translateX(${dir === "RIGHT" ? "100" : "-100"}%)` },
    enter: { transform: `translateX(0%)` },
    leave: { transform: `translateX(${dir === "RIGHT" ? "-100" : "100"}%)` },
    config: {
      tension: 300,
      friction: 40
    },
    immediate: disableInitialAnimation && !containerRef.current,
    onRest: () => {
      dispatch({ type: "STOP_ANIMATING" });
    }
  });

  return (
    <div
      className="h5 relative overflow-hidden"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      {transitions.map(({ item, props, key }) => {
        return (
          <animated.div
            key={key}
            className="absolute absolute--fill flex"
            style={props}
          >
            {item.slides.map((slide, i) => (
              <div key={i} className={`flex-auto bg-${slide}`} />
            ))}
          </animated.div>
        );
      })}
    </div>
  );
}
