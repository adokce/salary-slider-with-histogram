import { AreaClosed } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { curveBasis } from "@visx/curve"; // Changed from curveMonotoneX
import { scaleLinear } from "@visx/scale";
import { forwardRef, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import cn from "classnames";
import { bisectLeft } from "d3-array";
import { LinearGradient } from "@visx/gradient";

const histogram = {
  30000: 0.0,
  31000: 0.0,
  42000: 0.0,
  43000: 0.0,
  44000: 0.0,
  45000: 0.0,
  46000: 0.05,
  47000: 0.12,
  48000: 0.32,
  49000: 1.0,
  50000: 0.84,
  51000: 0.6,
  52000: 0.84,
  53000: 0.45,
  54000: 0.24,
  55000: 0.08,
  56000: 0.01,
  57000: 0.0,
  58000: 0.0,
  59000: 0.0,
  60000: 0.0,
  61000: 0.0,
  62000: 0.0,
  63000: 0.0,
  64000: 0.0,
  65000: 0.0
};

const histogramData = Object.entries(histogram).map(([key, value]) => [
  Number(key),
  value
]);

const filteredKeys = histogramData
  .filter(([_, y]) => y !== 0)
  .map(([key]) => Number(key));

const purple = "#E5E0FD";
const gray = "#E6E6E6";
const lineColor = "#8951B5";

const CustomVisXChart = () => {
  const middleIndex = Math.floor(filteredKeys.length / 2);
  const [selectedValue, setSelectedValue] = useState(filteredKeys[middleIndex]);
  const filteredData = histogramData.filter(([_, y]) => y !== 0); // Filter out data points with y values equal to 0

  const data = filteredData.map(([x, y]) => ({ x, y }));

  const width = 600;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 0, left: 20 };

  const xScale = scaleLinear({
    domain: [
      Math.min(...data.map((d) => d.x)),
      Math.max(...data.map((d) => d.x))
    ],
    range: [margin.left, width - margin.right]
  });

  const selectedValueX = xScale(selectedValue);

  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map((d) => d.y)) * 1.1],
    range: [height - margin.bottom, margin.top]
  });

  const minValue = Math.min(...data.map((d) => d.x));
  const maxValue = Math.max(...data.map((d) => d.x));
  const defaultSliderValue = minValue + (maxValue - minValue) / 2;

  return (
    <div
      style={{
        width
      }}
    >
      <svg width={width} height={height}>
        <defs>
          <clipPath id="left-clip">
            <rect
              x={0}
              y={margin.top}
              width={selectedValueX}
              height={height - margin.bottom}
            />
          </clipPath>

          <clipPath id="right-clip">
            <rect
              x={selectedValueX}
              y={margin.top}
              width={width - margin.right - selectedValueX}
              height={height - margin.bottom}
            />
          </clipPath>

          <clipPath id="line-clip">
            <rect
              x={selectedValueX - 3}
              y={margin.top}
              width={3}
              height={height - margin.bottom}
            />
          </clipPath>

          <linearGradient id="line-fill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="10%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="10%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="20%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="20%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="30%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="30%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="40%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="40%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="60%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="60%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="70%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="70%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="80%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="80%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="90%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="90%" stopColor="transparent" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0.1" />
            {/* Add more stops here to cover the entire height of the chart */}
          </linearGradient>
        </defs>

        <AreaClosed
          data={data}
          x={(d) => xScale(d.x)}
          y={(d) => yScale(d.y)}
          yScale={yScale}
          curve={curveBasis}
          clipPath="url(#left-clip)"
          fill={gray}
          stroke="transparent"
        />
        <AreaClosed
          data={data}
          x={(d) => xScale(d.x)}
          y={(d) => yScale(d.y)}
          yScale={yScale}
          curve={curveBasis}
          clipPath="url(#right-clip)"
          fill={purple}
          stroke="transparent"
        />

        <LinearGradient
          id="line-fill"
          from="blue"
          to="blue"
          fromOpacity={0.8}
          toOpacity={0.1}
        />

        {/* simulate a line with line-clip and color with line-fill*/}
        <AreaClosed
          data={data}
          x={(d) => xScale(d.x)}
          y={(d) => yScale(d.y)}
          yScale={yScale}
          curve={curveBasis}
          clipPath="url(#line-clip)"
          // fill="url(#line-fill)"
          fill="url(#line-fill2)"
        />
      </svg>

      <div
        style={{
          marginLeft: "1%",
          marginRight: "1%"
        }}
      >
        <Sliderio
          defaultValue={[defaultSliderValue]}
          min={minValue}
          max={maxValue}
          step={1}
          onValueChange={(values) => setSelectedValue(values[0])}
        />
      </div>
    </div>
  );
};

export default CustomVisXChart;

const Sliderio = forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <SliderPrimitive.Range className="absolute h-full bg-slate-900  dark:bg-slate-400" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-8 w-8 rounded-full border-2 border-slate-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-100 dark:bg-slate-400 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900" />
  </SliderPrimitive.Root>
));

Sliderio.displayName = SliderPrimitive.Root.displayName;
