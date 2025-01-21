'use client'; // Indica que este é um componente do lado do cliente

import { useEffect, useState } from 'react';
import { getCifras } from '../lib/db';  // Importa a função para pegar as cifras do Firestore

export default function Home() {
  const [cifras, setCifras] = useState<any[]>([]); // Estado para armazenar as cifras
  const [loading, setLoading] = useState(true);   // Estado para controlar o carregamento

  useEffect(() => {
    // Função para carregar as cifras quando o componente é montado
    const loadCifras = async () => {
      const data = await getCifras();
      setCifras(data);
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
