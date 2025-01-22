'use client'; // Indica que este é um componente do lado do cliente

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';  // Captura parâmetros da URL no App Router
import { getCifraById } from '@/lib/db'; // Caminho correto para importar do db
import { Cifra } from '@/lib/db';  // Importando a interface Cifra

// Regex para detectar acordes
const acordeRegex = /\b[A-G](#|b)?(m|maj|min|dim|aug|sus)?\d*(\/[A-G](#|b)?)?\b/g;

export default function CifraPage() {
  const { id } = useParams();  // Obtém o parâmetro 'id' da URL

  const [cifra, setCifra] = useState<Cifra | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchCifra = async () => {
        const result = await getCifraById(id as string);  // Chama a função para buscar a cifra pelo ID
        setCifra(result);
        setLoading(false);
      };

      fetchCifra();
    }
  }, [id]); // Recarrega a cifra quando o ID mudar

  // Função para destacar acordes no texto
  const highlightAcordes = (texto: string) => {
    return texto.replace(acordeRegex, (match) => `<span class="text-orange-500 font-bold">${match}</span>`);
  };

  if (loading) return <p>Carregando...</p>;  // Exibe enquanto carrega

  if (!cifra) return <p>Cifra não encontrada.</p>;  // Caso não tenha encontrado a cifra

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{cifra.titulo}</h1>
      <p className="text-xl mt-2"><strong>enviado por</strong> {cifra.autor}</p>
      <div className="mt-4">

        {/* Renderiza o texto da cifra com acordes destacados */}
        <pre
          className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightAcordes(cifra.texto) }}
        />
      </div>
    </div>
  );
}
