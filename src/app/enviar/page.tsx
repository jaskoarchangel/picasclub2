'use client'; // Marca para rodar no cliente

import { useState } from 'react';
import { saveCifra } from '../../lib/db';

export default function EnviarCifra() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [texto, setTexto] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await saveCifra({ titulo, autor, texto });

    if (result) {
      alert('Cifra enviada com sucesso!');
      setTitulo('');
      setAutor('');
      setTexto('');
    } else {
      alert('Erro ao enviar cifra!');
    }
  };

  return (
    <div>
      <h2>Enviar Cifra</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <textarea
          placeholder="Texto da Cifra"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
