'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push('/'); // Redireciona para a página inicial após o login
    } catch (error) {
      console.error("Erro ao fazer login", error);  // Registra o erro no console
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-phgray rounded-lg shadow-lg">
        <h2 className="text-3xl font-montserrat text-center text-orange-500 dark:text-ph mb-8">Penetrar</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-phggray text-black dark:text-white rounded-lg border border-gray-300 dark:border-phggray focus:outline-none focus:ring-2 focus:ring-ph"
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-phggray text-black dark:text-white rounded-lg border border-gray-300 dark:border-phggray focus:outline-none focus:ring-2 focus:ring-ph"
          />
          <button
            type="submit"
            className="w-full p-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-ph hover:dark:bg-yellow-600"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/registro"
            className="text-sm text-orange-500 dark:text-orange-400 hover:underline"
          >
            É sua primeira vez?
          </Link>
        </div>
      </div>
    </div>
  );
}
