'use client'; // Marca para rodar no cliente

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');  // Renomeado para 'erro' para manter o idioma consistente
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push('/'); // Redireciona para a página inicial após o login
    } catch (error) {
      setErro('Erro ao fazer login. Verifique seu e-mail e senha.');  // Exibe a mensagem de erro
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}  {/* Exibe a mensagem de erro caso haja */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
