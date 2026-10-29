import React from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";
import useTheme from "../context/useTheme";

const GaugeCard = ({
  gauge = {},
  colorInfo = {},
  timeFrameLabel = "",
  highlightNegative = false,
  currency = "$",
}) => {
  const { isDark } = useTheme();
  const { name = "Metric", value = 0, max = 100 } = gauge;
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  // For negative values, we'll show the absolute value in the chart but indicate it's negative in text
  const chartValue = isNegative ? absValue : value;
  const percentage = Math.min((absValue / max) * 100, 100);

  // Determine colors based on whether value is negative
  const gradientStart = isNegative ? '#ef4444' : (colorInfo.gradientStart || '#00C49F');
  const gradientEnd = isNegative ? '#dc2626' : (colorInfo.gradientEnd || '#0088FE');
  const textColor = isNegative
    ? 'text-red-600 dark:text-red-400'
    : (colorInfo.text || 'text-gray-800 dark:text-white');
  const percentColor = isNegative ? 'text-red-500' : 'text-gray-500 dark:text-slate-300';

  const svgTextColor = isNegative ? '#ef4444' : (isDark ? '#ffffff' : '#1f2937');
  const svgPercentColor = isNegative ? '#f87171' : (isDark ? '#cbd5e1' : '#6b7280');

  return (
    <div className="bg-white dark:bg-[#141530] rounded-2xl p-6 shadow-sm flex flex-col items-center border border-gray-100 dark:border-[#252752] overflow-visible">
      {/* Card heading with proper bottom spacing */}
      <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>
        {name}
      </h3>

      {/* Gauge chart container with ample vertical space so the arc is never cut off */}
      <div className="w-full h-52 relative flex items-center justify-center overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[{ ...gauge, value: chartValue }]}
            cx="50%"
            cy="65%"
            startAngle={180}
            endAngle={0}
            innerRadius="72%"
            outerRadius="96%"
            margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, max]}
              angleAxisId={0}
              tick={false}
              allowDataOverflow
            />

            <RadialBar
              minAngle={15}
              background={{ fill: isDark ? '#252752' : '#f3f4f6' }}
              dataKey="value"
              cornerRadius="50%"
              fill={`url(#${name}Gradient)`}
            />

            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={svgTextColor}
              className={`text-2xl font-bold ${textColor}`}
            >
              {isNegative ? '-' : ''}{currency}{Math.round(absValue).toLocaleString()}
            </text>
            <text
              x="50%"
              y="70%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={svgPercentColor}
              className={`text-sm ${percentColor}`}
            >
              {Math.round(percentage)}%
            </text>

            <defs>
              <linearGradient id={`${name}Gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientStart} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-2">
        {isNegative && highlightNegative && (
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
            Negative savings
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-slate-300">
          {timeFrameLabel} data
        </p>
      </div>
    </div>
  );
};

export default GaugeCard;
