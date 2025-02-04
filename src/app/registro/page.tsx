'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || username.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-montserrat text-center text-orange-500 dark:text-orange-400 mb-8">
          Cadastro
        </h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nome de usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Já tem uma conta?{' '}
            <a href="/login" className="text-orange-500 hover:underline">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
