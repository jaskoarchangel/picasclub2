'use client';  // Esta diretiva informa que o componente é um componente do lado do cliente.

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';  // Certifique-se de que o caminho está correto
import { useRouter } from 'next/navigation';  // Agora isso funcionará corretamente no cliente


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Criação do usuário com email e senha
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/login');  // Redireciona para a página de login após o registro
    } catch (error: unknown) {  // Usando 'unknown' para o erro
      if (error instanceof Error) {
        alert(error.message);  // Exibe o erro em um alerta, caso ocorra
      } else {
        alert('Ocorreu um erro desconhecido.');  // Em caso de erro não esperado
      }
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}