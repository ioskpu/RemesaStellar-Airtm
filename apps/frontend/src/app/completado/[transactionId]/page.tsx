'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTransactionStatus, TransactionResponse } from '@/lib/api';
import { CheckCircle2, ArrowRight, Share2, Download, ExternalLink, Gift } from 'lucide-react';

export default function CompletadoPage() {
  const { transactionId } = useParams();
  const router = useRouter();
  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getTransactionStatus(transactionId as string);
        setTx(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [transactionId]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400">
      <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
      {/* Confetti effect simulation with background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-green-500 to-transparent opacity-10 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">¡Envío Exitoso!</h1>
            <p className="text-slate-500 dark:text-zinc-400 font-medium mb-8">Tu remesa ha llegado a su destino.</p>

            {/* Voucher Details */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-3xl p-6 mb-8 border border-slate-100 dark:border-zinc-700/50 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Airtm Voucher</span>
                </div>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black px-2 py-1 rounded-lg uppercase">Pagado</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Monto entregado</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">${tx?.amountUsd || '0.00'} <span className="text-sm font-bold text-slate-400">USD</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">ID del Voucher</p>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 break-all bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                    {tx?.airtmVoucherId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4" />
                <span>Recibo</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Compartir</span>
              </button>
            </div>

            <button 
              onClick={() => router.push('/')}
              className="w-full group flex items-center justify-center py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98]"
            >
              <span>Nueva Remesa</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Explorer Link */}
          <div className="bg-slate-50 dark:bg-zinc-800/80 p-4 border-t border-slate-100 dark:border-zinc-700/50">
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${tx?.stellarHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              <span>Ver en Stellar Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 dark:text-zinc-600 text-[10px] font-medium uppercase tracking-widest">
          Transacción finalizada con éxito
        </p>
      </div>
    </main>
  );
}
