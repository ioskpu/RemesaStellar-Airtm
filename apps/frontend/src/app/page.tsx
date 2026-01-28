'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTransaction } from '@/lib/api';
import { ArrowRight, Globe, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [amountUsd, setAmountUsd] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const amount = parseFloat(amountUsd);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Por favor, ingresa un monto válido');
      }

      const response = await createTransaction(amount);
      router.push(`/pago/${response.transactionId}`);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600 to-transparent opacity-10 pointer-events-none" />
      
      <div className="w-full max-w-md relative">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Crypto<span className="text-blue-600">Remit</span>
          </h1>
          <p className="mt-3 text-slate-600 dark:text-zinc-400 font-medium">
            Simulador de remesas con Stellar & Airtm
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-zinc-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="amount" 
                className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2"
              >
                ¿Cuánto quieres enviar?
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-8 pr-16 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl text-xl font-bold text-slate-900 dark:text-white transition-all outline-none"
                  required
                  min="1"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold uppercase text-xs">USD</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full group relative flex items-center justify-center py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Procesando...</span>
                </div>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-8">
            <div className="flex items-start space-x-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Instantáneo</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">Red Stellar</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Seguro</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500">Airtm Mock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-400 dark:text-zinc-600 text-xs">
          Esta es una demostración técnica usando Stellar Testnet. <br/>
          No envíes fondos reales.
        </p>
      </div>
    </main>
  );
}
