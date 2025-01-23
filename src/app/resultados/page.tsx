'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'; // Para pegar os parâmetros de query string

const Resultados = () => {
  const searchParams = useSearchParams(); // Pega os parâmetros da URL
  const searchQuery = searchParams.get('search'); // Obtém o valor do parâmetro "search"

  // Simulando uma lista de resultados
  const results = [
    'Resultado 1',
    'Resultado 2',
    'Resultado 3',
    'Resultado 4',
  ];

  const filteredResults = results.filter((result) =>
    result.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  return (
    <div className="container mx-auto px-2 md:px-28 py-4">
      <h1 className="font-montserrat text-4xl font-bold mb-4">Resultados da Pesquisa</h1>
      <p className="mb-4">Você está buscando por: <strong>{searchQuery}</strong></p>

      {filteredResults.length > 0 ? (
        <ul>
          {filteredResults.map((result, index) => (
            <li key={index} className="mb-2">
              {result}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum resultado encontrado.</p>
      )}
    </div>
  );
};

export default Resultados;
