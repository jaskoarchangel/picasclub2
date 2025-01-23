'use client'; // Marca para rodar no cliente

import './styles/global.css';
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from 'react-feather'; // Importando o ícone de pesquisa
import { auth } from '../lib/firebase'; // Assumindo que você tem o arquivo de configuração do Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface LayoutProps {
  children: ReactNode;
}


export default function RootLayout({ children }: LayoutProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserName(null);
    } catch (error) {
      console.error('Erro ao fazer logout', error);
    }
  };

  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Picas Club - seu site de rolas e picas duras</title>
        {/* Link para a fonte Montserrat do Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Cabeçalho */}
        <header className="bg-white p-1.5 border-b border-gray-300 w-full">
          <div className="container mx-auto flex flex-wrap justify-between items-center px-4 md:px-28">
            {/* Logotipo */}
            <div className="flex items-center space-x-4 flex-grow">
              <Link href="/" className="hover:text-gray-800">
                <Image
                  src="/images/logo.png"
                  alt="Logo do PicasClub"
                  width={100}
                  height={100}
                  className="rounded"
                />
              </Link>

              {/* Barra de pesquisa */}
              <div className="relative flex items-center w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Em que você quer tocar hoje?"
                  className="outline outline-1 outline-gray-400 p-2 w-full rounded-lg bg-white text-black pr-10 pl-4 hidden md:block"
                />
                <Link
                  href={`/resultados?search=${searchQuery}`}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg transition-transform duration-300 hover:transform hover:scale-105 hidden md:block"
                  aria-label="Buscar"
                >
                  <Search size={17} stroke="white" strokeWidth={3} />
                </Link>
              </div>
            </div>

            {/* Navegação */}
            <nav className="text-sm text-black font-bold flex space-x-8 mt-2 md:mt-0 flex-wrap justify-center md:justify-start">
              <Link href="/" className="hover:text-orange-800">
                Home
              </Link>
              <Link href="/enviar" className="hover:text-orange-800">
                Enviar
              </Link>
              {/* Verifica se o usuário está logado */}
              {userName ? (
                <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                  Sair
                </button>
              ) : (
                <Link href="/login" className="text-orange-600 hover:text-orange-800">
                  Penetrar
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Renderiza o conteúdo das páginas */}
        <main>{children}</main>
      </body>
    </html>
  );
}
