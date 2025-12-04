import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { region: "Centro", total: 845 },
  { region: "Norte", total: 632 },
  { region: "Sul", total: 728 },
  { region: "Leste", total: 456 },
  { region: "Oeste", total: 523 },
  { region: "Rural", total: 272 },
];

export function RegionChart() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Distribuição por Região</h3>
        <p className="text-sm text-muted-foreground">
          Cadastros agrupados por zona
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="region"
              type="category"
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              cursor={{ fill: "hsl(var(--muted))" }}
            />
            <Bar
              dataKey="total"
              fill="hsl(160, 60%, 35%)"
              radius={[0, 4, 4, 0]}
              name="Total"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
