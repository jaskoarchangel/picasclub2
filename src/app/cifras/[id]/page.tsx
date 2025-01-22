'use client'; // Indica que este é um componente do lado do cliente

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';  // Captura parâmetros da URL no App Router
import { getCifraById, deleteCifra, saveCifra } from '@/lib/db'; // Caminho correto para importar do db
import { Cifra } from '@/lib/db';  // Importando a interface Cifra
import { auth } from '@/lib/firebase';  // Importando a instância de auth do Firebase
import { onAuthStateChanged, User } from 'firebase/auth';  // Importando a função do Firebase para checar a autenticação


// Criando a expressão regular para corresponder a padrões de acordes
const acordeRegex = new RegExp(
  "[A-G](b|#)?(maj|min|m|M|\\+|-|dim|aug|7)?[0-9]*(sus)?[0-9]*(\\/([A-G](b|#)?)?)?",
  "g"
);

export default function CifraPage() {
  const { id } = useParams();  // Obtém o parâmetro 'id' da URL
  const router = useRouter();  // Para redirecionar após a exclusão

  const [cifra, setCifra] = useState<Cifra | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);  // Armazena o usuário autenticado
  const [isEditing, setIsEditing] = useState(false);  // Controla o estado de edição
  const [editedTitulo, setEditedTitulo] = useState('');  // Estado para o título editado
  const [editedTexto, setEditedTexto] = useState('');  // Estado para o texto editado

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Atualiza o estado com o usuário autenticado (ou null se não estiver logado)
    });

    return () => unsubscribe();  // Limpeza do listener ao desmontar o componente
  }, []);

  useEffect(() => {
    if (id) {
      const fetchCifra = async () => {
        const result = await getCifraById(id as string);  // Chama a função para buscar a cifra pelo ID
        setCifra(result);
        setLoading(false);

        // Configura os valores editáveis
        if (result) {
          setEditedTitulo(result.titulo);
          setEditedTexto(result.texto);
        }
      };

      fetchCifra();
    }
  }, [id]); // Recarrega a cifra quando o ID mudar

  // Função para destacar acordes no texto
  const highlightAcordes = (texto: string) => {
    return texto.replace(acordeRegex, (match) => `<span class="text-orange-500 font-bold">${match}</span>`);
  };

  // Função para excluir a cifra
  const handleDelete = async () => {
    if (!cifra || !cifra.id) return; // Verifica se o id está presente

    const confirmDelete = confirm('Tem certeza que deseja excluir esta cifra?');
    if (!confirmDelete) return;

    try {
      await deleteCifra(cifra.id); // Chama a função para excluir a cifra
      alert('Cifra excluída com sucesso!');
      router.push('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao excluir a cifra:', error);
      alert('Erro ao excluir a cifra. Tente novamente mais tarde.');
    }
  };

  // Função para salvar as edições
  const handleSave = async () => {
    if (!editedTitulo || !editedTexto || !cifra?.id) return;  // Verifica se os campos são válidos

    const updatedCifra = {
      ...cifra,
      titulo: editedTitulo,
      texto: editedTexto,
    };

    try {
      const success = await saveCifra(updatedCifra); // Chama a função para salvar a cifra atualizada
      if (success) {
        alert('Cifra atualizada com sucesso!');
        setIsEditing(false);  // Desativa o modo de edição
        setCifra(updatedCifra);  // Atualiza a cifra exibida
      } else {
        alert('Erro ao salvar as edições. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar a cifra:', error);
      alert('Erro ao salvar as edições. Tente novamente.');
    }
  };

  // Função de rolagem lenta
  const slowScrollToBottom = () => {
    const distance = document.documentElement.scrollHeight - window.scrollY; // Distância até o fundo
    const step = distance / 40000; // Tamanho do "passo" de rolagem
    let currentPosition = window.scrollY;

    const scrollInterval = setInterval(() => {
      currentPosition += step;
      if (currentPosition >= document.documentElement.scrollHeight) {
        clearInterval(scrollInterval); // Para quando chegar ao final
      } else {
        window.scrollTo(0, currentPosition); // Rola lentamente
      }
    }, 10); // Intervalo entre cada "passo" (quanto menor, mais lento)
  };

  if (loading) return <p>Carregando...</p>;  // Exibe enquanto carrega

  if (!cifra) return <p>Cifra não encontrada.</p>;  // Caso não tenha encontrado a cifra

  return (
    <div className="p-4">
      {/* Botão fixado no topo da página */}
      <button 
        onClick={slowScrollToBottom}
        className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
      >
        Rolar
      </button>

      {/* Exibe o título como um campo de input se estiver no modo de edição */}
      {isEditing ? (
        <input
          type="text"
          value={editedTitulo}
          onChange={(e) => setEditedTitulo(e.target.value)}
          className="text-2xl font-bold p-2 mb-4 w-full border border-gray-300 rounded"
        />
      ) : (
        <h1 className="text-2xl font-bold">{cifra.titulo}</h1>
      )}
      <p className="text-xl mt-2"><strong>enviado por</strong> {cifra.autor}</p>
      <div className="mt-4">

        {/* Renderiza o texto da cifra com acordes destacados */}
        {isEditing ? (
          <textarea
            value={editedTexto}
            onChange={(e) => setEditedTexto(e.target.value)}
            className="bg-gray-100 p-4 mt-2 rounded w-full"
            rows={10}
          />
        ) : (
          <pre
            className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightAcordes(cifra.texto) }}
          />
        )}
      </div>

      {/* Exibe o botão de exclusão somente se o autor for o usuário autenticado */}
      {user && cifra.autor === user.displayName  && (
        <div className="mt-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Editar Cifra
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Salvar Edições
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
          >
            Excluir Cifra
          </button>
        </div>
      )}
    </div>
  );
}
