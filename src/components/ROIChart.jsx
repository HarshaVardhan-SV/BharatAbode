import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function ROIChart({ ideas }) {
  const data = ideas.map((i) => ({ name: i.title.slice(0, 12), roi: i.valueIncrease }));
  if (!data.length) return null;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="roi" fill="#0ea5a4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
