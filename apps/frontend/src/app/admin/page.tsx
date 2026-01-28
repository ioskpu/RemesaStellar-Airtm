'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, ArrowLeft, Filter, Search } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  status: 'PENDING' | 'RECEIVED' | 'COMPLETED' | 'FAILED';
  amount_usd: string;
  amount_xlm: string;
  deposit_address: string;
  stellar_hash: string | null;
  airtm_voucher_id: string | null;
  airtm_status: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

      const response = await fetch(`${apiUrl}/admin/transactions`, {
        headers: {
          'X-Admin-Key': adminKey || '',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('No autorizado. Verifica la API Key.');
        throw new Error('Error al cargar las transacciones');
      }

      const data = await response.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'ALL' || tx.status === filter;
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (tx.stellar_hash?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      RECEIVED: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '-';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-2 text-sm font-medium transition-colors">
              <ArrowLeft size={16} />
              Volver al simulador
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-slate-500 mt-1">Monitoreo global de transacciones de remesas</p>
          </div>
          
          <button 
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Actualizar datos
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID o Hash..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="RECEIVED">Recibidos</option>
              <option value="COMPLETED">Completados</option>
              <option value="FAILED">Fallidos</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-bottom border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Fecha</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto (USD)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Depósito Stellar</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hash / Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      No se encontraron transacciones.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr 
                      key={tx.id} 
                      className={`hover:bg-slate-50 transition-colors ${tx.status === 'COMPLETED' ? 'bg-green-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 truncate w-32" title={tx.id}>
                          #{tx.id.split('-')[0]}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {formatDate(tx.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-900">${tx.amount_usd}</div>
                        <div className="text-xs text-slate-500">{tx.amount_xlm} XLM</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block">
                          {formatAddress(tx.deposit_address)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tx.stellar_hash ? (
                          <a 
                            href={`https://stellar.expert/explorer/testnet/tx/${tx.stellar_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 mb-1 font-medium"
                          >
                            Ver en Explorer <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Sin hash aún</span>
                        )}
                        {tx.airtm_voucher_id && (
                          <div className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded inline-block mt-1 font-mono">
                            Voucher: {tx.airtm_voucher_id}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Info */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>Total: {filteredTransactions.length} transacciones</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p>Modo Demo - API Protegida por Key</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">💡 Nota de Seguridad para la Demo</h3>
          <p className="text-xs text-blue-700 leading-relaxed">
            En esta implementación de prueba, el panel está protegido por una clave de API configurada en variables de entorno. 
            En un entorno de producción real, este panel debería estar detrás de un sistema de autenticación robusto (ej: JWT, Auth0, Supabase Auth) 
            con roles de usuario y sesiones seguras en el servidor.
          </p>
        </div>
      </div>
    </div>
  );
}
