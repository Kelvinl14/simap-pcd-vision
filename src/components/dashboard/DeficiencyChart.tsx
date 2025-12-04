import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Física", value: 1245, color: "hsl(215, 70%, 35%)" },
  { name: "Visual", value: 856, color: "hsl(160, 60%, 35%)" },
  { name: "Auditiva", value: 634, color: "hsl(280, 50%, 45%)" },
  { name: "Intelectual", value: 423, color: "hsl(40, 90%, 50%)" },
  { name: "Múltipla", value: 298, color: "hsl(0, 70%, 50%)" },
];

export function DeficiencyChart() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Distribuição por Tipo de Deficiência</h3>
        <p className="text-sm text-muted-foreground">
          Total de cadastros por categoria
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
