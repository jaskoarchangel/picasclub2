// src/lib/db.ts
import { db } from './firebase';  // Importa a configuração do Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Função para obter todas as cifras do Firestore
export const getCifras = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cifras')); // A coleção onde estão as cifras
    const cifrasList: any[] = [];
    querySnapshot.forEach((doc) => {
      cifrasList.push({ id: doc.id, ...doc.data() });
    });
    return cifrasList;
  } catch (error) {
    console.error("Erro ao obter cifras:", error);
    return [];
  }
};

// Função para salvar uma cifra no Firestore
export const saveCifra = async (cifra: { titulo: string; autor: string; texto: string }) => {
  try {
    // Salva a cifra na coleção 'cifras'
    await addDoc(collection(db, 'cifras'), cifra);
    console.log('Cifra salva com sucesso!');
    return true; // Retorna true caso a operação seja bem-sucedida
  } catch (error) {
    console.error("Erro ao salvar cifra:", error);
    return false; // Retorna false caso ocorra erro
  }
};
