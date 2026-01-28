'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTransactionStatus, TransactionResponse } from '@/lib/api';
import QRCode from 'react-qr-code';
import { Copy, CheckCircle2, Clock, ExternalLink, ArrowLeft, Info } from 'lucide-react';

export default function PagoPage() {
  const { transactionId } = useParams();
  const router = useRouter();
  const [tx, setTx] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getTransactionStatus(transactionId as string);
        setTx(data);
        if (data.status === 'COMPLETED') {
          router.push(`/completado/${transactionId}`);
        }
      } catch (err) {
        setError('No se pudo cargar la información del pago');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [transactionId, router]);

  const copyToClipboard = () => {
    if (tx?.depositAddress) {
      navigator.clipboard.writeText(tx.depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        <p className="font-medium">Cargando transacción...</p>
      </div>
    </div>
  );

  if (error || !tx) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl text-center max-w-sm w-full border border-red-100 dark:border-red-900/30">
        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full inline-block mb-4">
          <Info className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¡Ups! Algo salió mal</h2>
        <p className="text-slate-600 dark:text-zinc-400 mb-6">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
      <div className="w-full max-w-xl">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Cancelar</span>
          </button>
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Esperando Pago</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Completa tu envío</h1>
              <p className="text-slate-500 dark:text-zinc-500 font-medium">Escanea o copia los datos para pagar</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* QR Code Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-3xl border-4 border-slate-50 dark:border-zinc-800 shadow-sm">
                  <QRCode 
                    value={`stellar:${tx.depositAddress}?amount=${tx.amountXlm}`}
                    size={160}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Testnet Active</span>
                </div>
              </div>

              {/* Data Section */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">Monto a enviar</label>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{tx.amountXlm}</span>
                    <span className="text-sm font-bold text-blue-600">XLM</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">Dirección de depósito</label>
                  <div className="relative group">
                    <div className="bg-slate-50 dark:bg-zinc-800 p-4 rounded-2xl border border-slate-100 dark:border-zinc-700 break-all font-mono text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {tx.depositAddress}
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="absolute right-2 top-2 p-2 bg-white dark:bg-zinc-700 shadow-sm rounded-xl border border-slate-100 dark:border-zinc-600 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert / Info Banner */}
          <div className="bg-blue-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <Clock className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Sincronizando con Stellar...</p>
                <p className="text-blue-100 text-[10px]">No cierres esta ventana hasta completar el pago.</p>
              </div>
            </div>
            <a 
              href={`https://stellar.expert/explorer/testnet/account/${tx.depositAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Transaction ID Footer */}
        <p className="mt-6 text-center text-slate-400 dark:text-zinc-600 text-[10px] font-medium uppercase tracking-widest">
          Transaction ID: {transactionId}
        </p>
      </div>
    </main>
  );
}
