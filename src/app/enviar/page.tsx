'use client';

import { useState, useEffect, useCallback } from 'react';
import { saveCifra } from '../../lib/db';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function EnviarCifra() {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [autor, setAutor] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchUser = useCallback(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAutor(user?.displayName ?? null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchUser();
    return unsubscribe;
  }, [fetchUser]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!autor) {
      setError('Você precisa estar logado para enviar uma cifra.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await saveCifra({ titulo, autor, texto, videoUrl });
      if (result) {
        alert('Cifra enviada com sucesso!');
        setTitulo('');
        setTexto('');
        setVideoUrl('');
        router.push('/');
      } else {
        setError('Erro ao enviar a cifra!');
      }
    } catch (error) {
      setError('Erro desconhecido ao enviar a cifra.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-montserrat text-center text-orange-500 dark:text-orange-400 mb-8">
          Enviar Cifra
        </h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Título</label>
            <input
              type="text"
              placeholder="Insira aqui"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Texto da Cifra</label>
            <textarea
              placeholder="Coloque os acordes em linhas paralelas às letras."
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[400px]"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Vídeo</label>
            <input
              type="text"
              placeholder="Insira a URL do youtube"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}
