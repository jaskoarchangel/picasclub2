'use client'; // Indica que este é um componente do lado do cliente

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCifraById, deleteCifra, saveCifra } from '@/lib/db';
import { Cifra } from '@/lib/db';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';


const acordeRegex = new RegExp(
  "[A-G](b|#)?(maj|min|m|M|\\+|-|dim|aug|7)?[0-9]*(sus)?[0-9]*(\\/([A-G](b|#)?)?)?",
  "g"
);

export default function CifraPage() {
  const { id } = useParams();
  const router = useRouter();

  const [cifra, setCifra] = useState<Cifra | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitulo, setEditedTitulo] = useState('');
  const [editedTexto, setEditedTexto] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1); // Velocidade inicial do scroll
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchCifra = async () => {
        const result = await getCifraById(id as string);
        setCifra(result);
        setLoading(false);

        if (result) {
          setEditedTitulo(result.titulo);
          setEditedTexto(result.texto);
        }
      };

      fetchCifra();
    }
  }, [id]);

  const highlightAcordes = (texto: string) => {
    return texto.replace(acordeRegex, (match) => `<span class="text-orange-500 font-bold">${match}</span>`);
  };

  const handleDelete = async () => {
    if (!cifra || !cifra.id) return;

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

  const handleSave = async () => {
    if (!editedTitulo || !editedTexto || !cifra?.id) return;

    const updatedCifra = {
      ...cifra,
      titulo: editedTitulo,
      texto: editedTexto,
    };

    delete updatedCifra.videoLink;

    try {
      const success = await saveCifra(updatedCifra);
      if (success) {
        alert('Cifra atualizada com sucesso!');
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

  const toggleScroll = () => {
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
          window.scrollBy(0, scrollSpeed) ;
        }
      }, 60);
      setIsScrolling(true);
    }
  };

  if (loading) return <p className="font-montserrat text-orange-700 text-4xl font-bold flex items-center justify-center"></p>;

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
        <input
          type="text"
          value={editedTitulo}
          onChange={(e) => setEditedTitulo(e.target.value)}
          className="text-2xl font-bold p-2 mb-4 w-full border border-gray-300 rounded "
        />
      ) : (
        <h1 className="font-montserrat text-black text-4xl font-bold">{cifra.titulo}</h1>
      )}
      <p className="font-montserrat text-xl mt-1">
        <strong>Enviado por </strong>
        <span className="text-orange-600 font-bold ">{cifra.autor}</span>
      </p>

      <div className="mt-4">
        {user && cifra.autor === user.displayName && (
          <div className="mt-4 ">
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
                Enviar
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
      </div>

      <div className="mt-4 ">
        {isEditing ? (
          <textarea
            value={editedTexto}
            onChange={(e) => setEditedTexto(e.target.value)}
            className="bg-gray-100 p-4 mt-2 rounded w-full"
            rows={10}
          />
        ) : (
          <pre
            className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap "
            dangerouslySetInnerHTML={{ __html: highlightAcordes(cifra.texto) }}
          />
        )}
      </div>
    </div>
  );
}
