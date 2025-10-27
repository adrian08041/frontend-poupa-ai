export interface ReportResponse {
  period: {
    month: number;
    year: number;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
    balance: number;
    savingsRate: number;
  };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  paymentMethodBreakdown: Array<{
    method: string;
    amount: number;
    transactionCount: number;
  }>;
  topExpenses: Array<{
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
  statistics: {
    transactionCount: number;
    averagePerDay: number;
    maxExpenseDay: string;
    maxExpenseAmount: number;
    daysWithoutExpenses: number;
  };
  comparison?: {
    previousPeriod: {
      month: number;
      year: number;
    };
    income: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    expenses: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    investments: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    balance: {
      current: number;
      previous: number;
      difference: number;
      percentage: number;
    };
    categoryComparison: Array<{
      category: string;
      currentAmount: number;
      previousAmount: number;
      difference: number;
      percentage: number;
    }>;
  };
  insights: AIInsights;
  generatedAt: string;
}

export interface AIInsights {
  visaoGeral: string;
  pontosPositivos: string[];
  pontosAtencao: string[];
  analiseCategoria: CategoryAnalysis[];
  dicasPersonalizadas: PersonalizedTip[];
  metasProximoMes: MonthlyGoal[];
  comparacao: ComparisonInsights;
  curiosidade: string;
  score: HealthScore;
}

export interface CategoryAnalysis {
  categoria: string;
  gasto: number;
  percentual: number;
  analise: string;
  oportunidade: string;
}

export interface PersonalizedTip {
  titulo: string;
  descricao: string;
  impacto: string;
  prioridade: "alta" | "media" | "baixa";
}

export interface MonthlyGoal {
  tipo: "economia" | "investimento" | "reducao";
  descricao: string;
  valorAlvo: number;
  categoria?: string;
}

export interface ComparisonInsights {
  resumo: string;
  melhorias: string[];
  retrocessos: string[];
  tendencia: "positiva" | "negativa" | "estavel";
}

export interface HealthScore {
  saudabilidadeFinanceira: number;
  justificativa: string;
}
