'use client';  // Esta diretiva informa que o componente é um componente do lado do cliente.

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';  // Importando updateProfile para definir o nome de usuário
import { auth } from '../../lib/firebase';  // Certifique-se de que o caminho está correto
import { useRouter } from 'next/navigation';  // Agora isso funcionará corretamente no cliente

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');  // Estado para o nome de usuário
  const [loading, setLoading] = useState(false);  // Estado para controle do botão de carregamento
  const [error, setError] = useState<string | null>(null);  // Estado para erros
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica dos campos
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

    setError(null);  // Limpa qualquer erro anterior
    setLoading(true);  // Desabilita o botão enquanto registra

    try {
      // Criação do usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Atualiza o perfil do usuário com o nome de usuário
      await updateProfile(userCredential.user, {
        displayName: username,  // Adiciona o nome de usuário ao perfil
      });

      router.push('/login');  // Redireciona para a página de login após o registro
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);  // Exibe o erro
      } else {
        setError('Ocorreu um erro desconhecido.');  // Caso de erro inesperado
      }
    } finally {
      setLoading(false);  // Reabilita o botão de envio
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        {error && <div style={{ color: 'red' }}>{error}</div>}  {/* Exibe o erro caso exista */}
        
        <div>
          <label>Nome de usuário</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}  {/* Exibe o texto de carregamento */}
        </button>
      </form>
    </div>
  );
}
