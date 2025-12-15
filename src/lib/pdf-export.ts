import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportConfig {
  title: string;
  subtitle?: string;
  dateRange?: { start: string; end: string };
  type: "geral" | "deficiencia" | "regiao" | "estatistico";
}

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

interface ChartData {
  labels: string[];
  values: number[];
  title: string;
}

// Extend jsPDF type for autoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

const COLORS = {
  primary: [30, 64, 175] as [number, number, number], // Blue
  secondary: [100, 116, 139] as [number, number, number], // Slate
  success: [22, 163, 74] as [number, number, number], // Green
  header: [241, 245, 249] as [number, number, number], // Light gray
  text: [15, 23, 42] as [number, number, number], // Dark
  muted: [148, 163, 184] as [number, number, number], // Muted
};

export function generatePDFReport(config: ReportConfig): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;

  // Header background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SIMAP-PCD", margin, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema Integrado de Mapeamento de Pessoas com Deficiência", margin, 28);

  // Report info on header
  doc.setFontSize(9);
  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Gerado em: ${dateStr}`, pageWidth - margin, 20, { align: "right" });

  currentY = 55;

  // Report Title
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(config.title, margin, currentY);
  currentY += 8;

  if (config.subtitle) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.secondary);
    doc.text(config.subtitle, margin, currentY);
    currentY += 6;
  }

  if (config.dateRange) {
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Período: ${config.dateRange.start} a ${config.dateRange.end}`, margin, currentY);
    currentY += 6;
  }

  // Divider line
  currentY += 4;
  doc.setDrawColor(...COLORS.secondary);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  return doc;
}

export function addSummaryCards(
  doc: jsPDF,
  cards: { label: string; value: string | number; change?: string }[],
  startY: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const cardWidth = (pageWidth - margin * 2 - 15) / 4;
  const cardHeight = 25;

  cards.forEach((card, index) => {
    const x = margin + index * (cardWidth + 5);
    
    // Card background
    doc.setFillColor(...COLORS.header);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, "F");

    // Value
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(String(card.value), x + 5, startY + 10);

    // Label
    doc.setTextColor(...COLORS.secondary);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(card.label, x + 5, startY + 18);

    // Change indicator
    if (card.change) {
      doc.setTextColor(...COLORS.success);
      doc.setFontSize(7);
      doc.text(card.change, x + cardWidth - 5, startY + 10, { align: "right" });
    }
  });

  return startY + cardHeight + 10;
}

export function addTable(
  doc: jsPDF,
  tableData: TableData,
  title: string,
  startY: number
): number {
  const margin = 20;

  // Table title
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, startY);
  startY += 6;

  autoTable(doc, {
    startY: startY,
    head: [tableData.headers],
    body: tableData.rows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: COLORS.text,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: "auto" },
    },
  });

  return doc.lastAutoTable.finalY + 10;
}

export function addBarChart(
  doc: jsPDF,
  chartData: ChartData,
  startY: number
): number {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const chartWidth = pageWidth - margin * 2;
  const chartHeight = 50;
  const barPadding = 8;
  
  // Chart title
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(chartData.title, margin, startY);
  startY += 8;

  // Chart background
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, startY, chartWidth, chartHeight + 20, 2, 2, "F");

  const maxValue = Math.max(...chartData.values);
  const barWidth = (chartWidth - 20) / chartData.values.length - barPadding;

  chartData.values.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = margin + 10 + index * (barWidth + barPadding);
    const y = startY + chartHeight - barHeight + 5;

    // Bar
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(x, y, barWidth, barHeight, 1, 1, "F");

    // Value label
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), x + barWidth / 2, y - 2, { align: "center" });

    // Category label
    doc.setTextColor(...COLORS.secondary);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const label = chartData.labels[index].length > 10 
      ? chartData.labels[index].substring(0, 10) + "..." 
      : chartData.labels[index];
    doc.text(label, x + barWidth / 2, startY + chartHeight + 15, { align: "center" });
  });

  return startY + chartHeight + 25;
}

export function addPieChart(
  doc: jsPDF,
  chartData: ChartData,
  startY: number
): number {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Chart title
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(chartData.title, margin, startY);
  startY += 8;

  // Chart container
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, startY, pageWidth - margin * 2, 70, 2, 2, "F");

  const centerX = margin + 45;
  const centerY = startY + 35;
  const radius = 25;
  const total = chartData.values.reduce((a, b) => a + b, 0);
  
  const pieColors: [number, number, number][] = [
    [59, 130, 246],   // Blue
    [34, 197, 94],    // Green
    [249, 115, 22],   // Orange
    [168, 85, 247],   // Purple
    [236, 72, 153],   // Pink
    [20, 184, 166],   // Teal
  ];

  let currentAngle = -Math.PI / 2;

  chartData.values.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const color = pieColors[index % pieColors.length];

    // Draw pie slice as a filled path
    doc.setFillColor(...color);
    
    // Simple wedge approximation using triangles
    const steps = 20;
    const stepAngle = sliceAngle / steps;
    
    for (let i = 0; i < steps; i++) {
      const angle1 = currentAngle + i * stepAngle;
      const angle2 = currentAngle + (i + 1) * stepAngle;
      
      const x1 = centerX + radius * Math.cos(angle1);
      const y1 = centerY + radius * Math.sin(angle1);
      const x2 = centerX + radius * Math.cos(angle2);
      const y2 = centerY + radius * Math.sin(angle2);

      doc.triangle(centerX, centerY, x1, y1, x2, y2, "F");
    }

    currentAngle += sliceAngle;
  });

  // Legend
  const legendX = margin + 100;
  let legendY = startY + 15;

  chartData.labels.forEach((label, index) => {
    const color = pieColors[index % pieColors.length];
    const percentage = ((chartData.values[index] / total) * 100).toFixed(1);

    // Color box
    doc.setFillColor(...color);
    doc.rect(legendX, legendY - 3, 8, 8, "F");

    // Label
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${label}: ${chartData.values[index]} (${percentage}%)`, legendX + 12, legendY + 2);

    legendY += 12;
  });

  return startY + 80;
}

export function addFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(...COLORS.secondary);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);

    // Footer text
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    doc.text("SIMAP-PCD - Documento gerado automaticamente", 20, pageHeight - 10);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: "right" });
  }
}

export function generateGeralReport(): void {
  const doc = generatePDFReport({
    title: "Relatório Geral de Cadastros",
    subtitle: "Visão completa de todos os cadastros do sistema",
    dateRange: { start: "01/01/2024", end: new Date().toLocaleDateString("pt-BR") },
    type: "geral",
  });

  let currentY = 85;

  // Summary cards
  currentY = addSummaryCards(doc, [
    { label: "Total de Cadastros", value: "2.847", change: "+12%" },
    { label: "Cadastros Ativos", value: "2.456", change: "+8%" },
    { label: "Novos este mês", value: "156", change: "+23%" },
    { label: "Regiões Atendidas", value: "12" },
  ], currentY);

  // Recent registrations table
  currentY = addTable(doc, {
    headers: ["Nome", "CPF", "Tipo Deficiência", "Região", "Status", "Data"],
    rows: [
      ["Maria Silva Santos", "123.456.789-00", "Física", "Centro", "Ativo", "15/12/2024"],
      ["João Pedro Oliveira", "234.567.890-11", "Visual", "Norte", "Ativo", "14/12/2024"],
      ["Ana Clara Costa", "345.678.901-22", "Auditiva", "Sul", "Pendente", "13/12/2024"],
      ["Pedro Henrique Lima", "456.789.012-33", "Intelectual", "Leste", "Ativo", "12/12/2024"],
      ["Carla Fernanda Souza", "567.890.123-44", "Múltipla", "Oeste", "Ativo", "11/12/2024"],
      ["Lucas Gabriel Santos", "678.901.234-55", "Física", "Centro", "Ativo", "10/12/2024"],
      ["Fernanda Lima Costa", "789.012.345-66", "Visual", "Norte", "Pendente", "09/12/2024"],
      ["Roberto Carlos Silva", "890.123.456-77", "Auditiva", "Sul", "Ativo", "08/12/2024"],
    ],
  }, "Cadastros Recentes", currentY);

  addFooter(doc);
  doc.save("relatorio-geral-simap-pcd.pdf");
}

export function generateDeficienciaReport(): void {
  const doc = generatePDFReport({
    title: "Relatório por Tipo de Deficiência",
    subtitle: "Cadastros agrupados por categoria de deficiência",
    dateRange: { start: "01/01/2024", end: new Date().toLocaleDateString("pt-BR") },
    type: "deficiencia",
  });

  let currentY = 85;

  // Summary cards
  currentY = addSummaryCards(doc, [
    { label: "Física", value: "892", change: "31%" },
    { label: "Visual", value: "634", change: "22%" },
    { label: "Auditiva", value: "521", change: "18%" },
    { label: "Outras", value: "800", change: "29%" },
  ], currentY);

  // Pie chart
  currentY = addPieChart(doc, {
    title: "Distribuição por Tipo de Deficiência",
    labels: ["Física", "Visual", "Auditiva", "Intelectual", "Múltipla", "Psicossocial"],
    values: [892, 634, 521, 412, 245, 143],
  }, currentY);

  // Detailed table
  currentY = addTable(doc, {
    headers: ["Tipo de Deficiência", "Total", "Ativos", "Pendentes", "Inativos", "%"],
    rows: [
      ["Física", "892", "845", "32", "15", "31.3%"],
      ["Visual", "634", "598", "24", "12", "22.3%"],
      ["Auditiva", "521", "489", "21", "11", "18.3%"],
      ["Intelectual", "412", "387", "18", "7", "14.5%"],
      ["Múltipla", "245", "228", "12", "5", "8.6%"],
      ["Psicossocial", "143", "132", "8", "3", "5.0%"],
    ],
  }, "Detalhamento por Categoria", currentY);

  addFooter(doc);
  doc.save("relatorio-deficiencia-simap-pcd.pdf");
}

export function generateRegiaoReport(): void {
  const doc = generatePDFReport({
    title: "Relatório por Região",
    subtitle: "Distribuição geográfica dos cadastros",
    dateRange: { start: "01/01/2024", end: new Date().toLocaleDateString("pt-BR") },
    type: "regiao",
  });

  let currentY = 85;

  // Summary cards
  currentY = addSummaryCards(doc, [
    { label: "Centro", value: "687", change: "24%" },
    { label: "Norte", value: "523", change: "18%" },
    { label: "Sul", value: "612", change: "22%" },
    { label: "Outras", value: "1.025", change: "36%" },
  ], currentY);

  // Bar chart
  currentY = addBarChart(doc, {
    title: "Cadastros por Região",
    labels: ["Centro", "Norte", "Sul", "Leste", "Oeste", "Rural"],
    values: [687, 523, 612, 489, 398, 138],
  }, currentY);

  // Detailed table
  currentY = addTable(doc, {
    headers: ["Região", "Total", "Física", "Visual", "Auditiva", "Outras", "%"],
    rows: [
      ["Centro", "687", "215", "154", "123", "195", "24.1%"],
      ["Sul", "612", "192", "137", "110", "173", "21.5%"],
      ["Norte", "523", "164", "117", "94", "148", "18.4%"],
      ["Leste", "489", "153", "109", "88", "139", "17.2%"],
      ["Oeste", "398", "125", "89", "71", "113", "14.0%"],
      ["Zona Rural", "138", "43", "28", "35", "32", "4.8%"],
    ],
  }, "Detalhamento por Região", currentY);

  addFooter(doc);
  doc.save("relatorio-regiao-simap-pcd.pdf");
}

export function generateEstatisticoReport(): void {
  const doc = generatePDFReport({
    title: "Relatório Estatístico",
    subtitle: "Análise estatística com indicadores de desempenho",
    dateRange: { start: "01/01/2024", end: new Date().toLocaleDateString("pt-BR") },
    type: "estatistico",
  });

  let currentY = 85;

  // Summary cards
  currentY = addSummaryCards(doc, [
    { label: "Taxa de Crescimento", value: "+15.3%", change: "mensal" },
    { label: "Média Diária", value: "12.4", change: "cadastros" },
    { label: "Taxa Ativação", value: "94.2%", change: "+2.1%" },
    { label: "Cobertura", value: "78.5%", change: "+5.3%" },
  ], currentY);

  // Monthly evolution chart
  currentY = addBarChart(doc, {
    title: "Evolução Mensal de Cadastros",
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    values: [298, 312, 287, 345, 367, 412],
  }, currentY);

  // Distribution chart
  currentY = addPieChart(doc, {
    title: "Distribuição por Status",
    labels: ["Ativos", "Pendentes", "Em Análise", "Inativos"],
    values: [2456, 215, 123, 53],
  }, currentY);

  // Statistics table
  addTable(doc, {
    headers: ["Indicador", "Valor Atual", "Mês Anterior", "Variação", "Meta"],
    rows: [
      ["Total de Cadastros", "2.847", "2.691", "+5.8%", "3.000"],
      ["Cadastros Ativos", "2.456", "2.312", "+6.2%", "2.700"],
      ["Taxa de Ativação", "94.2%", "92.1%", "+2.1pp", "95%"],
      ["Tempo Médio Análise", "2.3 dias", "2.8 dias", "-17.9%", "2 dias"],
      ["Cobertura Regional", "78.5%", "73.2%", "+5.3pp", "85%"],
    ],
  }, "Indicadores de Desempenho", currentY);

  addFooter(doc);
  doc.save("relatorio-estatistico-simap-pcd.pdf");
}
