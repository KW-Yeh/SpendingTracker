export const customPieLabel = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  value: number;
}) => {
  const { cx, cy, midAngle, outerRadius, name } = props;
  const x = cx + outerRadius * 1.25 * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + outerRadius * 1.35 * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="rounded-md fill-gray-200 p-1 text-xs"
    >
      {name}
    </text>
  );
};
