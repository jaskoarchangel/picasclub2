// src/lib/db.ts
import { db } from './firebase';  // Importa a configuração do Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Definir uma interface para o tipo da Cifra
interface Cifra {
  id?: string;  // id será opcional porque é gerado automaticamente pelo Firestore
  titulo: string;
  autor: string;
  texto: string;
}

// Função para obter todas as cifras do Firestore
export const getCifras = async (): Promise<Cifra[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cifras')); // A coleção onde estão as cifras
    const cifrasList: Cifra[] = [];
    querySnapshot.forEach((doc) => {
      cifrasList.push({ id: doc.id, ...doc.data() } as Cifra); // Assegura que a cifra esteja de acordo com o tipo Cifra
    });
    return cifrasList;
  } catch (error) {
    console.error("Erro ao obter cifras:", error);
    return [];  // Retorna uma lista vazia caso ocorra erro
  }
};

// Função para salvar uma cifra no Firestore
export const saveCifra = async (cifra: Cifra): Promise<boolean> => {
  try {
    // Salva a cifra na coleção 'cifras'
    await addDoc(collection(db, 'cifras'), cifra);
    console.log('Cifra salva com sucesso!');
    return true;  // Retorna true caso a operação seja bem-sucedida
  } catch (error) {
    console.error("Erro ao salvar cifra:", error);
    return false;  // Retorna false caso ocorra erro
  }
};
