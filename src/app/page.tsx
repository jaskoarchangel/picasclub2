'use client'; // Marca para rodar no cliente

import { useEffect, useState } from 'react';
import { getCifras } from '../lib/db';  // Importa a função para pegar as cifras do Firestore
import Link from 'next/link';  // Importa o Link do Next.js para navegação
import { auth } from '../lib/firebase';  // Importa a configuração do Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';  // Importa para monitorar o estado de autenticação e fazer o logout

// Definir o tipo da cifra, com id podendo ser string
type Cifra = {
  id: string;  // Garantido que 'id' sempre será uma string
  titulo: string;
  autor: string;
  texto: string;
};

export default function Home() {
  const [cifras, setCifras] = useState<Cifra[]>([]); // Estado tipado com o tipo Cifra
  const [loading, setLoading] = useState(true);   // Estado para controlar o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para armazenar possíveis erros
  const [userName, setUserName] = useState<string | null>(null);  // Estado para armazenar o nome de usuário

  useEffect(() => {
    // Função para carregar as cifras quando o componente é montado
    const loadCifras = async () => {
      try {
        const data = await getCifras();
        if (Array.isArray(data)) {
          const cifrasComIdValidado = data.map((cifra) => ({
            ...cifra,
            id: cifra.id || '', // Garante que o id sempre será uma string, caso contrário atribui uma string vazia
          }));
          setCifras(cifrasComIdValidado);
        } else {
          throw new Error('Dados não são um array de cifras');
        }
      } catch (err) {
        setError('Erro ao carregar as cifras. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false); // Define que o carregamento terminou
      }
    };

    loadCifras();

    // Verifica o usuário autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);  // Obtém o nome de usuário
      } else {
        setUserName(null);  // Caso não haja usuário logado
      }
    });

    // Limpeza do listener
    return () => unsubscribe();
  }, []); // O efeito será executado apenas uma vez ao carregar o componente

  // Função para realizar o logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desautentica o usuário
      setUserName(null);    // Limpa o nome do usuário do estado
    } catch (error) {
      console.error('Erro ao fazer logout', error); // Caso ocorra um erro no logout
    }
  };

  return (
    <div>
      <h1>Cifras Musicais</h1>
      {userName ? (
        <div>
          <p>Bem-vindo, {userName}!</p>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
        </div>
      ) : (
        <div>
          <p>Você não está logado.</p>
          <Link href="/login" className="bg-blue-500 text-white p-2 rounded mr-2">Login</Link>
        </div>
      )}

            {/* Botão de Enviar Cifra */}
            {userName && (
        <Link href="/enviar" className="bg-green-500 text-white p-2 rounded mt-4">
          <button>enviar</button>
        </Link>
      )}

      {loading && !error ? (
        <p>Carregando cifras...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {cifras.length > 0 ? (
            cifras.map((cifra) => (
              <div key={cifra.id} className="mb-5">
                                <Link href={`/cifras/${cifra.id}`} className="bg-blue-500 text-white p-2 rounded">
                <h2 className="text-xl font-bold">{cifra.titulo}</h2> {/* Exibe o título da cifra */}
                </Link>
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
