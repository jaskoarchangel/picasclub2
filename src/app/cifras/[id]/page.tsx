'use client'; // Indica que este é um componente do lado do cliente

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCifraById, deleteCifra, saveCifra } from '@/lib/db';
import { Cifra } from '@/lib/db';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'react-feather';
import { signOut } from 'firebase/auth';


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
  const [userName, setUserName] = useState<string | null>(null);

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

  const slowScrollToBottom = () => {
    const distance = document.documentElement.scrollHeight - window.scrollY;
    const step = distance / 40000;
    let currentPosition = window.scrollY;

    const scrollInterval = setInterval(() => {
      currentPosition += step;
      if (currentPosition >= document.documentElement.scrollHeight) {
        clearInterval(scrollInterval);
      } else {
        window.scrollTo(0, currentPosition);
      }
    }, 10);
  };

  if (loading) return <p>Carregando...</p>;

  if (!cifra) return <p>Cifra não encontrada.</p>;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserName(null);
    } catch (error) {
      console.error('Erro ao fazer logout', error);
    }
  };


  return (


    
    <div className="container mx-auto px-2 md:px-28 py-4">



      <button 
        onClick={slowScrollToBottom}
        className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
      >
        Rolar
      </button>

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

      <div className="mt-4">
        {user && cifra.autor === user.displayName && (
          <div className="mt-4 ">
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
                Salvar Alterações
              </button>
            )}

            <button
              onClick={handleDelete}
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
