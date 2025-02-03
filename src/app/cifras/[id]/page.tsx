'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCifraById, deleteCifra, saveCifra } from '@/lib/db';
import { Cifra } from '@/lib/db'; // Certifique-se de que a interface Cifra está correta
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import DOMPurify from 'dompurify'; // Para sanitizar o HTML

const acordeRegex = new RegExp(
  "[A-G](b|#)?(maj|min|m|M|\\+|-|dim|aug|7)?[0-9]*(sus)?[0-9]*(\\/([A-G](b|#)?)?)?",
  "g"
);



export default function CifraPage() {
  const { id } = useParams();
  const router = useRouter();

  const [cifra, setCifra] = useState<Cifra | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitulo, setEditedTitulo] = useState('');
  const [editedTexto, setEditedTexto] = useState('');
  const [editedVideoUrl, setEditedVideoUrl] = useState<string | null>(null); // Novo estado para editar o videoUrl
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [showVideo, setShowVideo] = useState(false); // Estado para controlar a exibição do vídeo
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Hook para autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Hook para carregar a cifra
  useEffect(() => {
    if (!id) return;

    const fetchCifra = async () => {
      try {
        const result = await getCifraById(id as string);
        if (result) {
          setCifra(result);
          setEditedTitulo(result.titulo);
          setEditedTexto(result.texto);
          setEditedVideoUrl(result.videoUrl || null); // Carrega a URL do vídeo da database
          console.log('Video URL:', result.videoUrl); // Verifique o valor de videoUrl
        } else {
          setError('Cifra não encontrada.');
        }
      } catch (error) {
        setError('Erro ao carregar a cifra.');
      } finally {
        setLoading(false);
      }
    };

    fetchCifra();
  }, [id]);

  // Função para destacar acordes
  const highlightAcordes = useCallback((texto: string) => {
    return texto.replace(acordeRegex, (match) => `<span class="text-orange-500 font-bold">${match}</span>`);
  }, []);

  // Sanitiza o HTML antes de renderizar
  const sanitizedTexto = useMemo(() => {
    return cifra ? DOMPurify.sanitize(highlightAcordes(cifra.texto)) : '';
  }, [cifra, highlightAcordes]);

  // Função para deletar a cifra
  const handleDelete = async () => {
    if (!cifra?.id) return;

    const confirmDelete = confirm('Tem certeza que deseja excluir esta cifra?');
    if (!confirmDelete) return;

    try {
      await deleteCifra(cifra.id);
      alert('Cifra excluída com sucesso!');
      router.push('/');
    } catch (error) {
      console.error('Erro ao excluir a cifra:', error);
      alert('Erro ao excluir a cifra. Tente novamente mais tarde.');
    }
  };

  // Função para salvar a cifra
  const handleSave = async () => {
    if (!editedTitulo || !editedTexto || !cifra?.id) return;

    const updatedCifra = {
      ...cifra,
      titulo: editedTitulo,
      texto: editedTexto,
      videoUrl: editedVideoUrl || null, // Inclui o videoUrl atualizado
    };

    try {
      const success = await saveCifra(updatedCifra);
      if (success) {
        alert('Cifraa atualizada com sucesso!');
        setIsEditing(false);
        setCifra(updatedCifra);
      } else {
        alert('Erro ao salvar as edições. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar a cifra:', error);
      alert('Erro ao salvar as edições. Tente novamente.');
    }
  };

  // Função para controlar o scroll automático
  const toggleScroll = useCallback(() => {
    if (isScrolling) {
      clearInterval(scrollInterval.current!);
      scrollInterval.current = null;
      setIsScrolling(false);
    } else {
      scrollInterval.current = setInterval(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight) {
          clearInterval(scrollInterval.current!);
          setIsScrolling(false);
        } else {
          window.scrollBy(0, scrollSpeed);
        }
      }, 60);
      setIsScrolling(true);
    }
  }, [isScrolling, scrollSpeed]);

  // Limpa o intervalo ao desmontar o componente
  useEffect(() => {
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  // Função para exibir o vídeo do YouTube
  const handleShowVideo = () => {
    setShowVideo(true);
  };

  if (loading) return <p className="font-montserrat text-orange-700 text-4xl font-bold flex items-center justify-center">Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!cifra) return <p>Cifra não encontrada.</p>;


  return (
    <div className="container mx-auto px-2 md:px-28 py-4">
      <div className="fixed bottom-4 right-4 flex items-center space-x-4">
        <button
          onClick={toggleScroll}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          {isScrolling ? 'Parar' : 'Rolar'}
        </button>
        <input
          type="range"
          min="1"
          max="4"
          step="0.4"
          value={scrollSpeed}
          onChange={(e) => setScrollSpeed(Number(e.target.value))}
          className="w-32"
        />
      </div>

      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitulo}
            onChange={(e) => setEditedTitulo(e.target.value)}
            className="text-2xl font-bold p-2 mb-4 w-full border border-gray-300 rounded"
            placeholder="Título da cifra"
          />
          <textarea
            value={editedTexto}
            onChange={(e) => setEditedTexto(e.target.value)}
            className="bg-gray-100 p-4 mt-2 rounded w-full"
            rows={10}
            placeholder="Texto da cifra"
          />
          <input
            type="text"
            value={editedVideoUrl || ''}
            onChange={(e) => setEditedVideoUrl(e.target.value)}
            className="bg-gray-100 p-4 mt-2 rounded w-full"
            placeholder="Link do vídeo do YouTube"
          />
        </div>
      ) : (
        <h1 className="font-montserrat text-black text-4xl font-bold">{cifra.titulo}</h1>
      )}

      <p className="font-montserrat text-xl mt-1">
        <strong>Enviado por </strong>
        <span className="text-orange-600 font-bold">{cifra.autor}</span>
      </p>

      {user && cifra.autor === user.displayName && (
        <div className="mt-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              Mexer
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              Jogar dentro
            </button>
          )}
          <button
            onClick={handleDelete}
            className="ml-2 bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-900"
          >
            Cortar fora
          </button>
        </div>
      )}

{/* Se houver URL do vídeo e não estiver mostrando o vídeo, exibimos a thumbnail */}
{cifra.videoUrl && cifra.videoUrl.trim() !== '' && !showVideo && (
  <div className="mt-4 flex justify-start">
    <img
      className="w-1/3 h-[250px] rounded-lg shadow-lg cursor-pointer"
      src={`https://img.youtube.com/vi/${cifra.videoUrl.split('v=')[1]}/hqdefault.jpg`}
      alt="Thumbnail do vídeo"
      onClick={handleShowVideo} // Chama a função para exibir o vídeo
    />
  </div>
)}

      {/* Mensagem de depuração */}
      {!cifra.videoUrl && (
        <p className="text-gray-500 mt-4">Nenhum vídeo disponível para esta cifra.</p>
      )}

      {/* Exibir o vídeo do YouTube */}
      {showVideo && cifra.videoUrl && (
        <div className="mt-4 flex justify-start">
  <iframe
    className="w-1/3 h-[250px] rounded-lg shadow-lg"
    src={`https://www.youtube.com/embed/${cifra.videoUrl.split('v=')[1]}`}
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>
      )}

      <div className="mt-4">
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
            dangerouslySetInnerHTML={{ __html: sanitizedTexto }}
          />
        )}
      </div>
    </div>
  );
}