//import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dashboardService } from "@/services/dashboard.service";

export function RegionChart() {
  const [chartData, setChartData] = useState<Array<{ region: string; total: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const rawData = await dashboardService.getByCity();
        const formatted = rawData.map((c) => ({
          region: c.city,
          total: c.count,
        }));
        setChartData(formatted);
      } catch (error) {
        console.error("Erro ao carregar distribuição por cidade:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
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
        <h3 className="font-semibold">Distribuição por Município</h3>
        <p className="text-sm text-muted-foreground">
          Cadastros agrupados por cidade
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="region"
              type="category"
              tick={{ fontSize: 12 }}
              width={70}
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
