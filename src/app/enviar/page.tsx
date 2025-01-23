'use client'; // Marca para rodar no cliente

import { useState, useEffect, useCallback } from 'react';
import { saveCifra } from '../../lib/db';
import { auth } from '../../lib/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';  
import { useRouter } from 'next/navigation';  // Importa o hook useRouter

export default function EnviarCifra() {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [autor, setAutor] = useState<string | null>(null);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<string | null>(null);  

  const router = useRouter();  // Inicializa o hook useRouter

  // Usamos useCallback para garantir que o efeito não seja chamado repetidamente
  const fetchUser = useCallback(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAutor(user?.displayName ?? null);  // Se o usuário estiver logado, pega o displayName, caso contrário, limpa
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchUser();
    return unsubscribe;  // Cleanup listener quando o componente for desmontado
  }, [fetchUser]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!autor) {
      setError('Você precisa estar logado para enviar uma cifra.');
      return;
    }

    setLoading(true);
    setError(null);  // Limpa qualquer erro anterior

    try {
      const result = await saveCifra({ titulo, autor, texto });
      if (result) {
        alert('Cifra enviada com sucesso!');
        setTitulo('');
        setTexto('');
        router.push('/');  // Redireciona para a página inicial após o envio
      } else {
        setError('Erro ao enviar cifra!');
      }
    } catch (error) {
      setError('Erro desconhecido ao enviar a cifra.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 >Enviar Cifra</h2>
      {error && <p className="text-red-500">{error}</p>}  

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          className="outline outline-1 outline-gray-400"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Texto da Cifra"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="font-montserrat bg-orange-500 hover:bg-orange-600 text-white p-2 rounded mr-2" >
          {loading ? 'Enviando...' : 'Enviar'}
        </button >
      </form>
    </div>
  );
}
