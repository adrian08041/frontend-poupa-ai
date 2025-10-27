"use client";

import { useState, useEffect } from "react";
import { generateReport } from "@/lib/api/transaction";
import { ReportResponse } from "@/types/report";
import { formatCurrency } from "@/lib/utils/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function ReportsPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await generateReport({
        month: selectedMonth,
        year: selectedYear,
        includeComparison: true,
      });
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Erro ao gerar relatório");
      console.error("Erro ao gerar relatório:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateReport();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "text-red-600 bg-red-50";
      case "media":
        return "text-yellow-600 bg-yellow-50";
      case "baixa":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Relatório Financeiro</h1>
      </div>

      {/* Filtros */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Mês</label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Ano</label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="bg-green hover:bg-green/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Relatório"
            )}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {report && (
        <>
          {/* Score de Saúde Financeira */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Saúde Financeira: {report.insights.score.saudabilidadeFinanceira}/100
                </h2>
                <p className="text-gray-700">
                  {report.insights.score.justificativa}
                </p>
              </div>
              <div className="text-6xl font-bold text-green">
                {report.insights.score.saudabilidadeFinanceira}
              </div>
            </div>
          </Card>

          {/* Visão Geral */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Visão Geral</h2>
            <p className="text-lg text-gray-700">{report.insights.visaoGeral}</p>
          </Card>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-green" />
                <h3 className="font-semibold">Receitas</h3>
              </div>
              <p className="text-2xl font-bold text-green">
                {formatCurrency(report.summary.totalIncome)}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="text-red-500" />
                <h3 className="font-semibold">Despesas</h3>
              </div>
              <p className="text-2xl font-bold text-red-500">
                {formatCurrency(report.summary.totalExpenses)}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-blue-500" />
                <h3 className="font-semibold">Investimentos</h3>
              </div>
              <p className="text-2xl font-bold text-blue-500">
                {formatCurrency(report.summary.totalInvestments)}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="text-purple-500" />
                <h3 className="font-semibold">Saldo</h3>
              </div>
              <p
                className={`text-2xl font-bold ${
                  report.summary.balance >= 0 ? "text-green" : "text-red-500"
                }`}
              >
                {formatCurrency(report.summary.balance)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Taxa de poupança: {report.summary.savingsRate.toFixed(1)}%
              </p>
            </Card>
          </div>

          {/* Pontos Positivos */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-green" />
              <h2 className="text-xl font-bold">Pontos Positivos</h2>
            </div>
            <ul className="space-y-2">
              {report.insights.pontosPositivos.map((ponto, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>{ponto}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Pontos de Atenção */}
          {report.insights.pontosAtencao.length > 0 && (
            <Card className="p-6 bg-yellow-50">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-yellow-600" />
                <h2 className="text-xl font-bold">Pontos de Atenção</h2>
              </div>
              <ul className="space-y-2">
                {report.insights.pontosAtencao.map((ponto, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">⚠</span>
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Dicas Personalizadas */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-500" />
              <h2 className="text-xl font-bold">Dicas Personalizadas</h2>
            </div>
            <div className="space-y-4">
              {report.insights.dicasPersonalizadas.map((dica, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${getPriorityColor(dica.prioridade)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{dica.titulo}</h3>
                    <span className="text-xs uppercase font-semibold">
                      {dica.prioridade}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{dica.descricao}</p>
                  <p className="text-xs font-semibold">💡 {dica.impacto}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Metas para Próximo Mês */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Metas para o Próximo Mês</h2>
            <div className="space-y-3">
              {report.insights.metasProximoMes.map((meta, idx) => (
                <div key={idx} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{meta.descricao}</p>
                      {meta.categoria && (
                        <p className="text-sm text-gray-600">
                          Categoria: {meta.categoria}
                        </p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-green">
                      {formatCurrency(meta.valorAlvo)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Curiosidade */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <h2 className="text-xl font-bold mb-2">💡 Você Sabia?</h2>
            <p className="text-gray-700">{report.insights.curiosidade}</p>
          </Card>

          {/* Gastos por Categoria */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Gastos por Categoria</h2>
            <div className="space-y-3">
              {report.categoryBreakdown.slice(0, 5).map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{cat.category}</span>
                    <span className="font-bold">
                      {formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green h-2 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
