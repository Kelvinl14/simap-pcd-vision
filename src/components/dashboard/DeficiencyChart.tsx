//import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { dashboardService } from "@/services/dashboard.service";

const colorMap: Record<string, string> = {
  FISICA: "hsl(215, 70%, 35%)",
  VISUAL: "hsl(160, 60%, 35%)",
  AUDITIVA: "hsl(280, 50%, 45%)",
  INTELECTUAL: "hsl(40, 90%, 50%)",
  MULTIPLA: "hsl(0, 70%, 50%)",
  PSICOSSOCIAL: "hsl(340, 60%, 45%)",
};

const labelMap: Record<string, string> = {
  FISICA: "Física",
  VISUAL: "Visual",
  AUDITIVA: "Auditiva",
  INTELECTUAL: "Intelectual",
  MULTIPLA: "Múltipla",
  PSICOSSOCIAL: "Psicossocial",
};

export function DeficiencyChart() {
  const [chartData, setChartData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDisabilities = async () => {
      try {
        const rawData = await dashboardService.getByDisability();
        const formatted = rawData.map((d) => ({
          name: labelMap[d.type] || d.type,
          value: d.count,
          color: colorMap[d.type] || "hsl(200, 50%, 50%)",
        }));
        setChartData(formatted);
      } catch (error) {
        console.error("Erro ao carregar distribuição de deficiências:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisabilities();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 flex flex-col justify-center items-center h-[372px]">
        <span className="text-muted-foreground">Carregando dados...</span>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 flex flex-col justify-center items-center h-[372px]">
        <span className="text-muted-foreground">Nenhum dado cadastrado.</span>
      </div>
    );
  }

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
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
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
