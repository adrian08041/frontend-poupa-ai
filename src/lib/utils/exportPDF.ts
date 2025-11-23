import jsPDF from "jspdf";
import { ReportResponse } from "@/types/report";
import { formatCurrency, centsToReais } from "@/lib/utils/format";

/**
 * Gera e faz download de um PDF com o relatório financeiro
 */
export function exportReportToPDF(report: ReportResponse): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = 20;

  // Cores (definidas como tuplas para compatibilidade com jsPDF)
  const colors = {
    primary: [34, 139, 34] as [number, number, number], // Verde
    secondary: [100, 100, 100] as [number, number, number], // Cinza
    text: [40, 40, 40] as [number, number, number], // Cinza escuro
    lightGray: [240, 240, 240] as [number, number, number],
    success: [34, 139, 34] as [number, number, number],
    warning: [255, 165, 0] as [number, number, number],
    danger: [220, 53, 69] as [number, number, number],
  };

  // Função para verificar se precisa de nova página
  const checkNewPage = (spaceNeeded: number = 20) => {
    if (yPosition + spaceNeeded > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Função para adicionar linha horizontal
  const addLine = (color: [number, number, number] = colors.lightGray) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
  };

  // Função para adicionar título de seção
  const addSectionTitle = (title: string, color: [number, number, number] = colors.primary) => {
    checkNewPage(15);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...color);
    doc.text(title, margin, yPosition);
    yPosition += 7;
    addLine(color);
  };

  // Função para adicionar texto normal
  const addText = (
    text: string,
    options: {
      fontSize?: number;
      bold?: boolean;
      color?: [number, number, number];
      indent?: number;
      lineHeight?: number;
    } = {}
  ) => {
    const {
      fontSize = 10,
      bold = false,
      color = colors.text,
      indent = 0,
      lineHeight = 5,
    } = options;

    checkNewPage(lineHeight + 5);
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      checkNewPage(lineHeight + 2);
      doc.text(line, margin + indent, yPosition);
      yPosition += lineHeight;
    });
  };

  // Função para adicionar box com destaque
  const addHighlightBox = (
    title: string,
    content: string,
    bgColor: [number, number, number] = colors.lightGray
  ) => {
    checkNewPage(25);
    const boxHeight = 20;
    
    // Fundo
    doc.setFillColor(...bgColor);
    doc.rect(margin, yPosition - 5, contentWidth, boxHeight, "F");
    
    // Título
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.text);
    doc.text(title, margin + 5, yPosition);
    yPosition += 6;
    
    // Conteúdo
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(content, contentWidth - 10);
    lines.forEach((line: string) => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    
    yPosition += 5;
  };

  // ========== CABEÇALHO ==========
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Relatorio Financeiro", pageWidth / 2, 20, { align: "center" });
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${monthNames[report.period.month - 1]} de ${report.period.year}`,
    pageWidth / 2,
    30,
    { align: "center" }
  );
  
  yPosition = 50;

  // ========== SCORE DE SAÚDE FINANCEIRA ==========
  checkNewPage(35);
  doc.setFillColor(240, 255, 240);
  doc.rect(margin, yPosition - 5, contentWidth, 30, "F");
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.primary);
  doc.text("Saude Financeira", margin + 5, yPosition);
  
  doc.setFontSize(24);
  doc.text(
    `${report.insights.score.saudabilidadeFinanceira}/100`,
    pageWidth - margin - 5,
    yPosition + 5,
    { align: "right" }
  );
  
  yPosition += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.secondary);
  const justLines = doc.splitTextToSize(
    report.insights.score.justificativa,
    contentWidth - 10
  );
  justLines.forEach((line: string) => {
    doc.text(line, margin + 5, yPosition);
    yPosition += 4;
  });
  
  yPosition += 10;

  // ========== VISÃO GERAL ==========
  addSectionTitle("Visao Geral");
  addText(report.insights.visaoGeral, { fontSize: 10, lineHeight: 5 });
  yPosition += 5;

  // ========== RESUMO FINANCEIRO ==========
  addSectionTitle("Resumo Financeiro");
  
  const summaryData = [
    { label: "Receitas", value: report.summary.totalIncome, color: colors.success },
    { label: "Despesas", value: report.summary.totalExpenses, color: colors.danger },
    { label: "Investimentos", value: report.summary.totalInvestments, color: colors.primary },
    { label: "Saldo", value: report.summary.balance, color: report.summary.balance >= 0 ? colors.success : colors.danger },
  ];

  summaryData.forEach((item) => {
    checkNewPage(8);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.text);
    doc.text(item.label + ":", margin, yPosition);
    
    doc.setTextColor(...item.color);
    doc.text(
      formatCurrency(centsToReais(item.value)),
      pageWidth - margin,
      yPosition,
      { align: "right" }
    );
    yPosition += 7;
  });

  checkNewPage(8);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.secondary);
  doc.text(
    `Taxa de Poupanca: ${report.summary.savingsRate.toFixed(1)}%`,
    margin,
    yPosition
  );
  yPosition += 10;

  // ========== PONTOS POSITIVOS ==========
  if (report.insights.pontosPositivos.length > 0) {
    addSectionTitle("Pontos Positivos", colors.success);
    report.insights.pontosPositivos.forEach((ponto, index) => {
      checkNewPage(10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.text);
      
      // Bullet point
      doc.setFillColor(...colors.success);
      doc.circle(margin + 2, yPosition - 2, 1.5, "F");
      
      const lines = doc.splitTextToSize(ponto, contentWidth - 10);
      lines.forEach((line: string, idx: number) => {
        checkNewPage(5);
        doc.text(line, margin + 7, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });
    yPosition += 5;
  }

  // ========== PONTOS DE ATENÇÃO ==========
  if (report.insights.pontosAtencao.length > 0) {
    addSectionTitle("Pontos de Atencao", colors.warning);
    report.insights.pontosAtencao.forEach((ponto) => {
      checkNewPage(10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.text);
      
      // Bullet point
      doc.setFillColor(...colors.warning);
      doc.circle(margin + 2, yPosition - 2, 1.5, "F");
      
      const lines = doc.splitTextToSize(ponto, contentWidth - 10);
      lines.forEach((line: string) => {
        checkNewPage(5);
        doc.text(line, margin + 7, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });
    yPosition += 5;
  }

  // ========== DICAS PERSONALIZADAS ==========
  if (report.insights.dicasPersonalizadas.length > 0) {
    addSectionTitle("Dicas Personalizadas");
    
    report.insights.dicasPersonalizadas.forEach((dica, index) => {
      checkNewPage(30);
      
      // Box da dica
      const priorityColors: Record<string, [number, number, number]> = {
        alta: [255, 235, 235],
        media: [255, 250, 235],
        baixa: [235, 255, 235],
      };
      
      const bgColor: [number, number, number] = priorityColors[dica.prioridade] || colors.lightGray;
      
      // Calcular altura necessária
      const titleLines = doc.splitTextToSize(dica.titulo, contentWidth - 15);
      const descLines = doc.splitTextToSize(dica.descricao, contentWidth - 15);
      const impactoLines = doc.splitTextToSize(dica.impacto, contentWidth - 15);
      const boxHeight = 10 + (titleLines.length * 5) + (descLines.length * 4) + (impactoLines.length * 4);
      
      checkNewPage(boxHeight + 5);
      
      doc.setFillColor(...bgColor);
      doc.rect(margin, yPosition - 3, contentWidth, boxHeight, "F");
      
      // Título e prioridade
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.text);
      doc.text(dica.titulo, margin + 5, yPosition);
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      const priorityText = dica.prioridade.toUpperCase();
      doc.text(priorityText, pageWidth - margin - 5, yPosition, { align: "right" });
      yPosition += 6;
      
      // Descrição
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.secondary);
      descLines.forEach((line: string) => {
        doc.text(line, margin + 5, yPosition);
        yPosition += 4;
      });
      yPosition += 2;
      
      // Impacto
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...colors.primary);
      impactoLines.forEach((line: string) => {
        doc.text(`Impacto: ${line}`, margin + 5, yPosition);
        yPosition += 4;
      });
      
      yPosition += 8;
    });
  }

  // ========== METAS PARA PRÓXIMO MÊS ==========
  if (report.insights.metasProximoMes.length > 0) {
    addSectionTitle("Metas para o Proximo Mes");
    
    report.insights.metasProximoMes.forEach((meta) => {
      checkNewPage(12);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.text);
      doc.text(meta.descricao, margin, yPosition);
      
      doc.setTextColor(...colors.primary);
      doc.text(
        formatCurrency(centsToReais(meta.valorAlvo)),
        pageWidth - margin,
        yPosition,
        { align: "right" }
      );
      yPosition += 5;
      
      if (meta.categoria) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...colors.secondary);
        doc.text(`Categoria: ${meta.categoria}`, margin + 5, yPosition);
        yPosition += 5;
      }
      yPosition += 3;
    });
    yPosition += 5;
  }

  // ========== GASTOS POR CATEGORIA ==========
  if (report.categoryBreakdown.length > 0) {
    addSectionTitle("Gastos por Categoria");
    
    report.categoryBreakdown.slice(0, 5).forEach((cat, index) => {
      checkNewPage(12);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.text);
      doc.text(`${index + 1}. ${cat.category}`, margin, yPosition);
      
      doc.setFont("helvetica", "bold");
      doc.text(
        `${formatCurrency(centsToReais(cat.amount))} (${cat.percentage.toFixed(1)}%)`,
        pageWidth - margin,
        yPosition,
        { align: "right" }
      );
      yPosition += 5;
      
      // Barra de progresso
      const barWidth = contentWidth - 10;
      const fillWidth = (barWidth * cat.percentage) / 100;
      
      doc.setFillColor(220, 220, 220);
      doc.rect(margin + 5, yPosition, barWidth, 3, "F");
      
      doc.setFillColor(...colors.primary);
      doc.rect(margin + 5, yPosition, fillWidth, 3, "F");
      
      yPosition += 8;
    });
    yPosition += 5;
  }

  // ========== CURIOSIDADE ==========
  checkNewPage(20);
  doc.setFillColor(250, 245, 255);
  const curiosLines = doc.splitTextToSize(report.insights.curiosidade, contentWidth - 10);
  const curiosHeight = 15 + (curiosLines.length * 4);
  
  doc.rect(margin, yPosition - 3, contentWidth, curiosHeight, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.primary);
  doc.text("Voce Sabia?", margin + 5, yPosition);
  yPosition += 6;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.text);
  curiosLines.forEach((line: string) => {
    doc.text(line, margin + 5, yPosition);
    yPosition += 4;
  });

  // ========== RODAPÉ EM TODAS AS PÁGINAS ==========
  const totalPages = doc.getNumberOfPages();
  const generatedDate = new Date(report.generatedAt).toLocaleString("pt-BR");
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Linha superior do rodapé
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Texto do rodapé
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.secondary);
    doc.text(`Gerado em: ${generatedDate}`, margin, pageHeight - 10);
    doc.text(`Pagina ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  // Salvar o PDF
  const fileName = `relatorio-poupaai-${report.period.month}-${report.period.year}.pdf`;
  doc.save(fileName);
}
