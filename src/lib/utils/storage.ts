import { ReportResponse } from "@/types/report";

const REPORT_STORAGE_KEY = "poupaai_current_report";

/**
 * Salva um relatório no localStorage
 */
export function saveReport(report: ReportResponse): void {
  try {
    const reportData = JSON.stringify(report);
    localStorage.setItem(REPORT_STORAGE_KEY, reportData);
  } catch (error) {
    console.error("Erro ao salvar relatório no localStorage:", error);
    throw new Error("Não foi possível salvar o relatório");
  }
}

/**
 * Carrega o relatório salvo do localStorage
 */
export function loadReport(): ReportResponse | null {
  try {
    const reportData = localStorage.getItem(REPORT_STORAGE_KEY);
    if (!reportData) {
      return null;
    }
    return JSON.parse(reportData) as ReportResponse;
  } catch (error) {
    console.error("Erro ao carregar relatório do localStorage:", error);
    // Se houver erro ao parsear, limpa o storage corrompido
    clearReport();
    return null;
  }
}

/**
 * Remove o relatório salvo do localStorage
 */
export function clearReport(): void {
  try {
    localStorage.removeItem(REPORT_STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar relatório do localStorage:", error);
  }
}

/**
 * Obtém metadados básicos do relatório salvo sem carregar todos os dados
 */
export function getReportMetadata(): {
  period: { month: number; year: number };
  generatedAt: string;
} | null {
  try {
    const reportData = localStorage.getItem(REPORT_STORAGE_KEY);
    if (!reportData) {
      return null;
    }
    const report = JSON.parse(reportData) as ReportResponse;
    return {
      period: report.period,
      generatedAt: report.generatedAt,
    };
  } catch (error) {
    console.error("Erro ao obter metadados do relatório:", error);
    return null;
  }
}
