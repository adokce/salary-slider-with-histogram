import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import { VictoryArea, VictoryChart, VictoryAxis } from "victory";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

import { AreaClosed } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveNatural } from "@visx/curve";
import { scaleLinear } from "@visx/scale";
import { localPoint } from "@visx/event";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";

const mockData = {
  defaultSalary: 51000,
  histogram: {
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
  }
};
export default function Draft() {
  return (
    <div>
      <br />
      <hr />
      <h3>ChartjsReact2</h3>
      <SalaryChartChartjsReact2 data={chartData} />

      <h3>Visx</h3>
      <SalaryChartVisx data={chartData} />

      <hr />

      <h3>Recharts</h3>
      <SalaryChartRecharts />

      <hr />

      <h3>Victory</h3>
      <SalaryChartVictory />

      <hr />

      <h3>Custom Svg</h3>
      <SalaryChartSvg {...mockData} />

      <hr />

      <br />
    </div>
  );
}

const SalaryChartChartjsReact2 = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.x),
    datasets: [
      {
        label: "Salary",
        data: data.map((d) => d.y),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.3)",
        pointRadius: 0,
        tension: 0.4
      }
    ]
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Salary"
        }
      },
      y: {
        title: {
          display: true,
          text: "Frequency"
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `x: ${context.parsed.x}, y: ${context.parsed.y.toFixed(2)}`
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

const width = 600;
const height = 400;
const margin = { top: 10, right: 30, bottom: 40, left: 40 };

const x = (d) => d.x;
const y = (d) => d.y;

const SalaryChartVisx = ({ data }) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip
  } = useTooltip();

  const xScale = scaleLinear({
    domain: [Math.min(...data.map(x)), Math.max(...data.map(x))],
    range: [margin.left, width - margin.right]
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map(y))],
    range: [height - margin.bottom, margin.top]
  });

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <AreaClosed
          data={data}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          yScale={yScale}
          strokeWidth={1}
          stroke="red"
          fill="rgba(255, 0, 0, 0.3)"
          curve={curveNatural}
          onMouseMove={(event) => {
            const point = localPoint(event);
            const index = Math.floor(xScale.invert(point.x));
            showTooltip({
              tooltipData: data[index],
              tooltipLeft: point.x,
              tooltipTop: point.y
            });
          }}
          onMouseLeave={() => hideTooltip()}
        />
        <AxisBottom top={yScale(0)} scale={xScale} />
        <AxisLeft scale={yScale} left={margin.left} />
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
          x: {tooltipData.x}, y: {tooltipData.y.toFixed(2)}
        </TooltipWithBounds>
      )}
    </div>
  );
};

const chartData = Object.entries(mockData.histogram).map(([x, y]) => ({
  x: parseInt(x, 10),
  y: parseFloat(y)
}));

const SalaryChartRecharts = () => {
  return (
    <AreaChart
      width={600}
      height={400}
      data={chartData}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="y"
        stroke="#c43a31"
        fill="#c43a31"
        fillOpacity={0.3}
      />
    </AreaChart>
  );
};

const SalaryChartVictory = () => {
  return (
    <VictoryChart domainPadding={{ x: [10, 10] }}>
      <VictoryAxis />
      <VictoryArea
        data={chartData}
        interpolation="natural"
        style={{
          data: { fill: "#c43a31", strokeWidth: 2, strokeLinecap: "round" }
        }}
      />
    </VictoryChart>
  );
};

const SalaryChartSvg = ({ histogram }) => {
  const data = Object.entries(histogram).map(([salary, value]) => ({
    salary: parseInt(salary, 10),
    value
  }));

  const maxValue = Math.max(...data.map(({ value }) => value));
  const chartHeight = 200;
  const chartWidth = 600;
  const barWidth = chartWidth / data.length;

  return (
    <svg width={chartWidth} height={chartHeight}>
      {data.map(({ salary, value }, index) => (
        <rect
          key={salary}
          x={index * barWidth}
          y={chartHeight - (value * chartHeight) / maxValue}
          width={barWidth - 1}
          height={(value * chartHeight) / maxValue}
          fill="#8884d8"
        />
      ))}
    </svg>
  );
};

// const ReactChartjs2Implementation = () => {
//   const middleIndex = Math.floor(filteredKeys.length / 2);
//   const [selectedValue, setSelectedValue] = useState(filteredKeys[middleIndex]);

//   const chartData = {
//     labels: histogramData.map(([x]) => x),
//     datasets: [
//       {
//         data: histogramData.map(([_, y]) => y),
//         borderColor: "purple",
//         pointRadius: 0,
//         borderWidth: 2
//       }
//     ]
//   };

//   const chartOptions = {
//     scales: {
//       x: {
//         type: "linear",
//         min: Math.min(...filteredKeys),
//         max: Math.max(...filteredKeys),
//         ticks: {
//           stepSize: 1000
//         }
//       },
//       y: {
//         min: 0,
//         max: Math.max(...histogramData.map(([_, y]) => y)) * 1.1
//       }
//     },
//     plugins: {
//       annotation: {
//         annotations: [
//           {
//             type: "line",
//             xMin: selectedValue,
//             xMax: selectedValue,
//             borderColor: "red",
//             borderWidth: 2
//           },
//           {
//             type: "box",
//             xMin: Math.min(...filteredKeys),
//             xMax: selectedValue,
//             backgroundColor: "rgba(128, 128, 128, 0.3)"
//           }
//         ]
//       },
//       tooltip: {
//         enabled: false
//       },
//       legend: {
//         display: false
//       }
//     },
//     maintainAspectRatio: false
//   };

//   return (
//     <div>
//       <div style={{ width: 600, height: 200 }}>
//         <Line
//           data={chartData}
//           options={chartOptions}
//           plugins={[annotationPlugin]}
//         />
//         <div
//           style={{
//             marginLeft: "3.5%",
//             marginRight: "1.5%"
//           }}
//         >
//           <Sliderio
//             defaultValue={[selectedValue]}
//             min={Math.min(...filteredKeys)}
//             max={Math.max(...filteredKeys)}
//             step={1}
//             onValueChange={(values) => setSelectedValue(values[0])}
//           />
//         </div>

//         <br />
//         <hr />
//         <br />

//         <label htmlFor="histogram-slider">
//           Selected Value: {selectedValue.toLocaleString()}
//         </label>
//       </div>
//     </div>
//   );
// };

// const CustomVisXChart2 = () => {
//   const middleIndex = Math.floor(filteredKeys.length / 2);
//   const [selectedValue, setSelectedValue] = useState(filteredKeys[middleIndex]);
//   const filteredData = histogramData.filter(([_, y]) => y !== 0); // Filter out data points with y values equal to 0

//   const data = filteredData.map(([x, y]) => ({ x, y }));

//   const width = 600;
//   const height = 200;
//   const margin = { top: 20, right: 20, bottom: 20, left: 20 };

//   const xScale = scaleLinear({
//     domain: [
//       Math.min(...data.map((d) => d.x)),
//       Math.max(...data.map((d) => d.x))
//     ],
//     range: [margin.left, width - margin.right]
//   });

//   const selectedValueX = xScale(selectedValue);

//   const yScale = scaleLinear({
//     domain: [0, Math.max(...data.map((d) => d.y)) * 1.1],
//     range: [height - margin.bottom, margin.top]
//   });

//   const minValue = Math.min(...data.map((d) => d.x));
//   const maxValue = Math.max(...data.map((d) => d.x));
//   const defaultSliderValue = minValue + (maxValue - minValue) / 2;

//   return (
//     <div
//       style={{
//         width
//       }}
//     >
//       <svg width={width} height={height}>
//         <defs>
//           <mask id="area-mask">
//             <rect
//               x={0}
//               y={margin.top}
//               width={selectedValueX}
//               height={height - margin.bottom}
//               fill="url(#gradient-left)"
//             />
//             <rect
//               x={selectedValueX}
//               y={margin.top}
//               width={width - margin.right - selectedValueX}
//               height={height - margin.bottom}
//               fill="url(#gradient-right)"
//             />
//           </mask>
//         </defs>
//         <LinearGradient
//           id="gradient-left"
//           from="red"
//           to="red"
//           fromOpacity={0.8}
//           toOpacity={0.1}
//         />
//         <LinearGradient
//           id="gradient-right"
//           from="blue"
//           to="blue"
//           fromOpacity={0.8}
//           toOpacity={0.1}
//         />
//         <AreaClosed
//           data={data}
//           x={(d) => xScale(d.x)}
//           y={(d) => yScale(d.y)}
//           yScale={yScale}
//           curve={curveMonotoneX}
//           mask="url(#area-mask)"
//           fill="black"
//           stroke="transparent"
//         />
//         <line
//           x1={selectedValueX}
//           x2={selectedValueX}
//           y1={margin.top}
//           y2={height - margin.bottom}
//           stroke="black"
//           strokeWidth={2}
//         />
//       </svg>

//       <div
//         style={{
//           marginLeft: "1.5%",
//           marginRight: "1.5%"
//         }}
//       >
//         <Sliderio
//           defaultValue={[defaultSliderValue]}
//           min={minValue}
//           max={maxValue}
//           step={1}
//           onValueChange={(values) => setSelectedValue(values[0])}
//         />
//       </div>
//       <br />
//     </div>
//   );
// };

// export const CustomVisXChart0 = () => {
//   const middleIndex = Math.floor(filteredKeys.length / 2);
//   const [selectedValue, setSelectedValue] = useState(filteredKeys[middleIndex]);
//   const filteredData = histogramData.filter(([_, y]) => y !== 0); // Filter out data points with y values equal to 0

//   const data = filteredData.map(([x, y]) => ({ x, y }));

//   const width = 600;
//   const height = 200;
//   const margin = { top: 20, right: 20, bottom: 20, left: 20 };

//   const xScale = scaleLinear({
//     domain: [
//       Math.min(...data.map((d) => d.x)),
//       Math.max(...data.map((d) => d.x))
//     ],
//     range: [margin.left, width - margin.right]
//   });

//   const selectedValueX = xScale(selectedValue);

//   const yScale = scaleLinear({
//     domain: [0, Math.max(...data.map((d) => d.y)) * 1.1],
//     range: [height - margin.bottom, margin.top]
//   });

//   const minValue = Math.min(...data.map((d) => d.x));
//   const maxValue = Math.max(...data.map((d) => d.x));
//   const defaultSliderValue = minValue + (maxValue - minValue) / 2;

//   return (
//     <div
//       style={{
//         width
//       }}
//     >
//       <svg width={width} height={height}>
//         <defs>
//           <clipPath id="left-clip">
//             <rect
//               x={0}
//               y={margin.top}
//               width={selectedValueX}
//               height={height - margin.bottom}
//             />
//           </clipPath>
//           <clipPath id="right-clip">
//             <rect
//               x={selectedValueX}
//               y={margin.top}
//               width={width - margin.right - selectedValueX}
//               height={height - margin.bottom}
//             />
//           </clipPath>
//         </defs>
//         <AreaClosed
//           data={data}
//           x={(d) => xScale(d.x)}
//           y={(d) => yScale(d.y)}
//           yScale={yScale}
//           curve={curveMonotoneX}
//           clipPath="url(#left-clip)"
//           fill="gray"
//           stroke="transparent"
//         />
//         <AreaClosed
//           data={data}
//           x={(d) => xScale(d.x)}
//           y={(d) => yScale(d.y)}
//           yScale={yScale}
//           curve={curveMonotoneX}
//           clipPath="url(#right-clip)"
//           fill="purple"
//           stroke="transparent"
//         />
//         <line
//           x1={selectedValueX}
//           x2={selectedValueX}
//           y1={margin.top}
//           y2={height - margin.bottom}
//           stroke="black"
//           strokeWidth={2}
//         />
//       </svg>

//       <div
//         style={{
//           marginLeft: "1.5%",
//           marginRight: "1.5%"
//         }}
//       >
//         <Sliderio
//           defaultValue={[defaultSliderValue]}
//           min={minValue}
//           max={maxValue}
//           step={1}
//           onValueChange={(values) => setSelectedValue(values[0])}
//         />
//       </div>
//     </div>
//   );
// };

// import { AreaClosed } from "@visx/shape";
// import { curveMonotoneX } from "@visx/curve";
// import { curveBasis } from "@visx/curve"; // Changed from curveMonotoneX
// import { scaleLinear } from "@visx/scale";
// import { forwardRef, useState } from "react";
// import * as SliderPrimitive from "@radix-ui/react-slider";
// import cn from "classnames";
// import { bisectLeft } from "d3-array";

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

// const histogramData = Object.entries(histogram).map(([key, value]) => [
//   Number(key),
//   value
// ]);

// const filteredKeys = histogramData
//   .filter(([_, y]) => y !== 0)
//   .map(([key]) => Number(key));

// const purple = "#E5E0FD";
// const gray = "#E6E6E6";
// const lineColor = "#8951B5";

// const CustomVisXChart = () => {
//   const middleIndex = Math.floor(filteredKeys.length / 2);
//   const [selectedValue, setSelectedValue] = useState(filteredKeys[middleIndex]);
//   const filteredData = histogramData.filter(([_, y]) => y !== 0); // Filter out data points with y values equal to 0

//   const data = filteredData.map(([x, y]) => ({ x, y }));

//   const width = 600;
//   const height = 200;
//   const margin = { top: 20, right: 20, bottom: 20, left: 20 };

//   const xScale = scaleLinear({
//     domain: [
//       Math.min(...data.map((d) => d.x)),
//       Math.max(...data.map((d) => d.x))
//     ],
//     range: [margin.left, width - margin.right]
//   });

//   const selectedValueX = xScale(selectedValue);

//   const yScale = scaleLinear({
//     domain: [0, Math.max(...data.map((d) => d.y)) * 1.1],
//     range: [height - margin.bottom, margin.top]
//   });

//   const minValue = Math.min(...data.map((d) => d.x));
//   const maxValue = Math.max(...data.map((d) => d.x));
//   const defaultSliderValue = minValue + (maxValue - minValue) / 2;

//   // experiment

//   const xValues = filteredData.map(([x, _]) => x);
//   const selectedValueIndex = bisectLeft(xValues, selectedValue);

//   let selectedValueY;
//   if (selectedValueIndex === 0) {
//     selectedValueY = filteredData[0][1];
//   } else if (selectedValueIndex === filteredData.length) {
//     selectedValueY = filteredData[filteredData.length - 1][1];
//   } else {
//     const left = filteredData[selectedValueIndex - 1];
//     const right = filteredData[selectedValueIndex];
//     const t = (selectedValue - left[0]) / (right[0] - left[0]);
//     selectedValueY = left[1] * (1 - t) + right[1] * t;
//   }

//   //

//   return (
//     <div
//       style={{
//         width
//       }}
//     >
//       <svg width={width} height={height}>
//         <defs>
//           <clipPath id="left-clip">
//             <rect
//               x={0}
//               y={margin.top}
//               width={selectedValueX}
//               height={height - margin.bottom}
//             />
//           </clipPath>
//           <clipPath id="right-clip">
//             <rect
//               x={selectedValueX}
//               y={margin.top}
//               width={width - margin.right - selectedValueX}
//               height={height - margin.bottom}
//             />
//           </clipPath>
//         </defs>
//         <AreaClosed
//           data={data}
//           x={(d) => xScale(d.x)}
//           y={(d) => yScale(d.y)}
//           yScale={yScale}
//           curve={curveBasis}
//           clipPath="url(#left-clip)"
//           fill={gray}
//           stroke="transparent"
//         />
//         <AreaClosed
//           data={data}
//           x={(d) => xScale(d.x)}
//           y={(d) => yScale(d.y)}
//           yScale={yScale}
//           curve={curveBasis}
//           clipPath="url(#right-clip)"
//           fill={purple}
//           stroke="transparent"
//         />
//         <line
//           x1={selectedValueX}
//           x2={selectedValueX}
//           // y1={yScale(selectedValueY)}
//           // y2={yScale(0)} // clip line at the top of the chart
//           y1={margin.top}
//           y2={height - margin.bottom}
//           stroke={lineColor}
//           strokeDasharray="5 5"
//           strokeWidth={2}
//         />
//       </svg>

//       <div
//         style={{
//           marginLeft: "1.5%",
//           marginRight: "1.5%"
//         }}
//       >
//         <Sliderio
//           defaultValue={[defaultSliderValue]}
//           min={minValue}
//           max={maxValue}
//           step={1}
//           onValueChange={(values) => setSelectedValue(values[0])}
//         />
//       </div>
//     </div>
//   );
// };

// export default CustomVisXChart;

// const Sliderio = forwardRef(({ className, ...props }, ref) => (
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
