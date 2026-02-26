import { BondForm } from './components/BondForm';
import { BondResults } from './components/BondResults';
import { CashFlowTable } from './components/CashFlowTable';
import { useBondCalculation } from './hooks/useBondCalculation';

function App() {
  const { form, result, loading, error, handleSubmit, updateField } = useBondCalculation();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Bond Yield Calculator
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Current yield, YTM, total interest, and cash flow schedule
          </p>
        </header>

        <BondForm
          form={form}
          onChange={updateField}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
          >
            {error}
          </div>
        )}

        {result && (
          <section className="space-y-8" aria-live="polite">
            <BondResults result={result} />
            <CashFlowTable
              schedule={result.cashFlowSchedule}
              totalInterest={result.totalInterest}
              faceValue={form.faceValue}
              marketPrice={form.marketPrice}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
