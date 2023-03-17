// import React, { useState } from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   ReferenceLine,
//   LinearGradient,
//   Defs
// } from "recharts";
// import * as SliderPrimitive from "@radix-ui/react-slider";
// import cn from "classnames";

// const histogram = {
//   30000: 0.0,
//   31000: 0.0,
//   42000: 0.0,
//   43000: 0.0,
//   44000: 0.0,
//   45000: 0.0,
//   46000: 0.05,
//   47000: 0.12,
//   48000: 0.32,
//   49000: 1.0,
//   50000: 0.84,
//   51000: 0.6,
//   52000: 0.84,
//   53000: 0.45,
//   54000: 0.24,
//   55000: 0.08,
//   56000: 0.01,
//   57000: 0.0,
//   58000: 0.0,
//   59000: 0.0,
//   60000: 0.0,
//   61000: 0.0,
//   62000: 0.0,
//   63000: 0.0,
//   64000: 0.0,
//   65000: 0.0
// };

// const histogramData = Object.entries(histogram).map(([key, value]) => ({
//   x: Number(key),
//   y: value
// }));

// const CustomRechartsChart = () => {
//   const filteredKeys = histogramData
//     .filter(({ y }) => y !== 0)
//     .map(({ x }) => x);

//   const middleIndex = Math.floor(filteredKeys.length / 2);
//   const [selectedValue, setSelectedValue] = useState(filteredKeys[middleIndex]);

//   const handleChange = (event, newValue) => {
//     setSelectedValue(newValue);
//   };

//   const leftData = histogramData.slice(
//     0,
//     histogramData.findIndex(({ x }) => x === selectedValue) + 1
//   );
//   const rightData = histogramData.slice(
//     histogramData.findIndex(({ x }) => x === selectedValue)
//   );

//   return (
//     <div>
//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart>
//           <XAxis dataKey="x" />
//           <YAxis />
//           <Area
//             type="monotone"
//             dataKey="y"
//             stroke="#8884d8"
//             fill="#8884d8"
//             fillOpacity={0.5}
//             isAnimationActive={false}
//             data={leftData}
//           />
//           <Area
//             type="monotone"
//             dataKey="y"
//             stroke="#82ca9d"
//             fill="#82ca9d"
//             fillOpacity={0.5}
//             isAnimationActive={false}
//             data={rightData}
//           />
//           <ReferenceLine x={selectedValue} stroke="red" />
//         </AreaChart>
//       </ResponsiveContainer>

//       <div
//         style={{
//           marginLeft: "1.5%",
//           marginRight: "1.5%"
//         }}
//       >
//         {/* <Slider
//           value={selectedValue}
//           min={Math.min(...filteredKeys)}
//           max={Math.max(...filteredKeys)}
//           step={1000}
//           onChange={handleChange}
//           valueLabelDisplay="auto"
//           aria-labelledby="range-slider"
//           marks={filteredKeys.map((value) => ({ value }))}
//         /> */}
//       </div>
//     </div>
//   );
// };
// export default CustomRechartsChart;

// const Sliderio = React.forwardRef(({ className, ...props }, ref) => (
//   <SliderPrimitive.Root
//     ref={ref}
//     className={cn(
//       "relative flex w-full touch-none select-none items-center",
//       className
//     )}
//     {...props}
//   >
//     <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
//       <SliderPrimitive.Range className="absolute h-full bg-slate-900  dark:bg-slate-400" />
//     </SliderPrimitive.Track>
//     <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-100 dark:bg-slate-400 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900" />
//   </SliderPrimitive.Root>
// ));

// Sliderio.displayName = SliderPrimitive.Root.displayName;

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine
} from "recharts";
// import * as SliderPrimitive from "@radix-ui/react-slider";
// import cn from "classnames";
import Sliderio from "./Sliderio";

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

const histogramData = Object.entries(histogram).map(([key, value]) => ({
  x: Number(key),
  y: value
}));

const CustomRechartsChart = () => {
  const filteredKeys = histogramData
    .filter(({ y }) => y !== 0)
    .map(({ x }) => x);

  const middleIndex = Math.floor(filteredKeys.length / 2);
  const [selectedValue, setSelectedValue] = useState(filteredKeys[middleIndex]);

  const leftData = histogramData.slice(
    0,
    histogramData.findIndex(({ x }) => x === selectedValue) + 1
  );
  const rightData = histogramData.slice(
    histogramData.findIndex(({ x }) => x === selectedValue)
  );

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart>
          <XAxis dataKey="x" />
          <YAxis />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.5}
            isAnimationActive={false}
            data={leftData}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.5}
            isAnimationActive={false}
            data={rightData}
          />
          <ReferenceLine x={selectedValue} stroke="red" />
        </AreaChart>
      </ResponsiveContainer>

      <div
        style={{
          marginLeft: "1.5%",
          marginRight: "1.5%"
        }}
      >
        <Sliderio
          value={[selectedValue]}
          min={Math.min(...filteredKeys)}
          max={Math.max(...filteredKeys)}
          step={1000}
          onValueChange={(values) => setSelectedValue(values[0])}
        />
      </div>
    </div>
  );
};

export default CustomRechartsChart;
