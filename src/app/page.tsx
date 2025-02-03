'use client'; // Marca para rodar no cliente

import { useEffect, useState } from 'react';
import { getCifras } from '../lib/db';
import Link from 'next/link';
import Image from 'next/image';

// Definir o tipo da cifra, com id podendo ser string
type Cifra = {
  id: string;
  titulo: string;
  texto: string;
  autor: string;
  videoUrl?: string; // Adicione esta linha
};

export default function Home() {
  const [cifras, setCifras] = useState<Cifra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCifras = async () => {
      try {
        const data = await getCifras();
        if (Array.isArray(data)) {
          // Garantir que todas as cifras tenham um ID válido
          const cifrasComIdValidado: Cifra[] = data.map((cifra) => ({
            ...cifra,
            id: cifra.id || '',
          }));

          // Ordenar as cifras por título em ordem alfabética
          const cifrasOrdenadas = cifrasComIdValidado.sort((a, b) =>
            a.titulo.localeCompare(b.titulo)
          );

          setCifras(cifrasOrdenadas);
        } else {
          throw new Error('Dados não são um array de cifras');
        }
      } catch {
        setError('Erro ao carregar as cifras. Tente novamente mais tarde.');
        console.error('Erro ao carregar as cifras');
      } finally {
        setLoading(false);
      }
    };

    loadCifras();
  }, []);

  return (
    <div>
      {/* Cabeçalho */}
      {/* ... Aqui você pode manter o código do cabeçalho se necessário ... */}

      {/* Botão acima do banner */}
      <div className="container mx-auto px-2 md:px-28 py-4">
        <button
          className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-700 transition duration-300"
        >
          Todos
        </button>
      </div>

      {/* Banner abaixo do botão */}
      <div className="container mx-auto px-2 md:px-28 relative overflow-hidden">
        <Link href={`cifras/0y7w8QTG9AUjJnaEdtFc`} className="block w-full text-center">
          <Image
            src="/images/banner.jpg"
            alt="Banner do PicasClub"
            width={1300}
            height={500}
            className="object-contain transition-transform duration-300 ease-in-out transform hover:scale-105 hover:origin-center rounded-lg"
          />
        </Link>
      </div>

      {/* Conteúdo principal */}
      <main className="font-montserrat container mx-auto px-4 md:px-28 mt-6">
        {loading && !error ? (
          <p>Carregando picas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {cifras.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
                {cifras.map((cifra) => (
                  <div key={cifra.id} className="mb-2 flex justify-center">
                    <Link href={`/cifras/${cifra.id}`} className="block w-full text-center">
                      <h2 className="text-left text-black text-xl font-bold hover:text-orange-600">{cifra.titulo}</h2>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma cifra encontrada.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}