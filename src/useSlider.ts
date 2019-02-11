import { useReducer } from "react";

type InternalSliderState = {
  pageIdx: number;
  pageSize: number;
  wrap: boolean;
  dir: "RIGHT" | "LEFT";
};

export type SliderState<T> = InternalSliderState & {
  page: Page<T>;
};

const defaultState: InternalSliderState = {
  pageSize: 1,
  wrap: true,
  pageIdx: 0,
  dir: "RIGHT"
};

export type Page<T> = {
  id: number;
  startIdx: number;
  slides: T[];
};

type Options = {
  pageSize?: number;
  wrap?: boolean;
};

const reducer = (
  state: InternalSliderState,
  action: any
): InternalSliderState => {
  switch (action.type) {
    case "PAGE_RIGHT":
      return {
        ...state,
        ...action.payload,
        dir: "RIGHT"
      };
    case "PAGE_LEFT":
      return {
        ...state,
        ...action.payload,
        dir: "LEFT"
      };
    default:
      return state;
  }
};

export default function useSlider<T>(
  items: T[] = [],
  { pageSize = 1, wrap = true }: Options
) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    pageSize,
    wrap
  });
  const { pageIdx } = state;

  const maxPageIdx = Math.ceil(items.length / pageSize);

  const resolveItemIdx = (x: number) => (x + items.length) % items.length;

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

  const getPage = (idx: number): Page<T> => {
    const slides = [];

    for (let i = 0; i < pageSize; i++) {
      const itemIdx = resolveItemIdx(idx * pageSize + i);

      slides.push(items[itemIdx]);
    }

    return {
      id: pageIdx,
      startIdx: pageSize * idx,
      slides
    };
  };

  return {
    state: {
      ...state,
      page: getPage(pageIdx)
    },
    actions: {
      pageLeft,
      pageRight
    }
  };
}
