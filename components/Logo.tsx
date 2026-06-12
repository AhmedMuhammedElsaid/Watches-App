import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { useThemeColor } from '@/components/Themed';

const C = 50;
const D2R = Math.PI / 180;
const pt = (deg: number, L: number): [number, number] => [
  C + L * Math.sin(deg * D2R),
  C - L * Math.cos(deg * D2R),
];

/** Minimal single-colour Elaraby Watches dial mark; inherits the brand tint. */
export function Logo({ size = 40, color }: { size?: number; color?: string }) {
  const tint = useThemeColor({}, 'tint');
  const stroke = color ?? tint;
  const R = 42;

  const markers = Array.from({ length: 12 }, (_, i) => {
    const [x1, y1] = pt(i * 30, R * 0.82);
    const [x2, y2] = pt(i * 30, R * 0.7);
    return (
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={i % 3 === 0 ? R * 0.04 : R * 0.02}
        strokeLinecap="round"
      />
    );
  });

  const [hx, hy] = pt(305, R * 0.48);
  const [mx, my] = pt(60, R * 0.7);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={C} cy={C} r={R} fill="none" stroke={stroke} strokeWidth={R * 0.06} />
      <Rect
        x={C + R}
        y={C - R * 0.09}
        width={R * 0.09}
        height={R * 0.18}
        rx={R * 0.03}
        fill={stroke}
      />
      {markers}
      <Line x1={C} y1={C} x2={hx} y2={hy} stroke={stroke} strokeWidth={R * 0.055} strokeLinecap="round" />
      <Line x1={C} y1={C} x2={mx} y2={my} stroke={stroke} strokeWidth={R * 0.042} strokeLinecap="round" />
      <Circle cx={C} cy={C} r={R * 0.06} fill={stroke} />
    </Svg>
  );
}
