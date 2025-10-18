export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray mt-2">
          Visão geral das suas finanças
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Saldo */}
        <div className="bg-white dark:bg-background-02 rounded-lg shadow dark:shadow-none p-6 border border-gray-200 dark:border-dark-gray">
          <h3 className="text-sm font-medium text-gray">Saldo Total</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">R$ 0,00</p>
        </div>

        {/* Card Receitas */}
        <div className="bg-white dark:bg-background-02 rounded-lg shadow dark:shadow-none p-6 border border-gray-200 dark:border-dark-gray">
          <h3 className="text-sm font-medium text-gray">Receitas</h3>
          <p className="text-2xl font-bold text-green mt-2">R$ 0,00</p>
        </div>

        {/* Card Despesas */}
        <div className="bg-white dark:bg-background-02 rounded-lg shadow dark:shadow-none p-6 border border-gray-200 dark:border-dark-gray">
          <h3 className="text-sm font-medium text-gray">Despesas</h3>
          <p className="text-2xl font-bold text-red mt-2">R$ 0,00</p>
        </div>
      </div>

      <div className="bg-white dark:bg-background-02 rounded-lg shadow dark:shadow-none p-6 border border-gray-200 dark:border-dark-gray">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transações Recentes
        </h2>
        <p className="text-gray text-sm">
          Nenhuma transação encontrada
        </p>
      </div>
    </div>
  );
}
