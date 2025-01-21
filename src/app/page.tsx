'use client'; // Indica que este é um componente do lado do cliente

import { useEffect, useState } from 'react';
import { getCifras } from '../lib/db';  // Importa a função para pegar as cifras do Firestore

// Definir o tipo da cifra, com id podendo ser string
type Cifra = {
  id: string;  // Alterado para garantir que 'id' sempre seja uma string
  titulo: string;
  autor: string;
  texto: string;
};

export default function Home() {
  const [cifras, setCifras] = useState<Cifra[]>([]); // Estado tipado com o tipo Cifra
  const [loading, setLoading] = useState(true);   // Estado para controlar o carregamento

  useEffect(() => {
    // Função para carregar as cifras quando o componente é montado
    const loadCifras = async () => {
      const data = await getCifras();
      if (Array.isArray(data)) {
        const cifrasComIdValidado = data.map((cifra) => ({
          ...cifra,
          id: cifra.id || '', // Garante que o id sempre será uma string, caso contrário atribui uma string vazia
        }));
        setCifras(cifrasComIdValidado);
      } else {
        console.error("Erro: Dados não são um array de cifras.");
      }
      setLoading(false); // Define que o carregamento terminou
    };

    loadCifras();
  }, []); // O efeito será executado apenas uma vez ao carregar o componente

  return (
    <div>
      <h1>Cifras Musicais</h1>
      {loading ? (
        <p>Carregando cifras...</p>
      ) : (
        <div>
          {cifras.length > 0 ? (
            cifras.map((cifra) => (
              <div key={cifra.id} style={{ marginBottom: '20px' }}>
                <h2>{cifra.titulo}</h2> {/* Exibe o título da cifra */}
                <p><strong>Autor:</strong> {cifra.autor}</p> {/* Exibe o autor */}
                <pre>{cifra.texto}</pre> {/* Exibe o texto da cifra */}
              </div>
            ))
          ) : (
            <p>Nenhuma cifra encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
