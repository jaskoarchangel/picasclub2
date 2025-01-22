import { db } from './firebase';  // Importa a configuração do Firebase
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

// src/lib/db.ts
export interface Cifra {  // Adicione o 'export' aqui
    id?: string;
    titulo: string;
    autor: string;
    texto: string;
}

// Converter documentos Firestore para objetos tipados
const cifraConverter: FirestoreDataConverter<Cifra> = {
  toFirestore(cifra: Cifra): DocumentData {
    return {
      titulo: cifra.titulo,
      autor: cifra.autor,
      texto: cifra.texto,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Cifra {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      titulo: data.titulo,
      autor: data.autor,
      texto: data.texto,
    };
  }
};

// Função para obter todas as cifras do Firestore
export const getCifras = async (): Promise<Cifra[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cifras').withConverter(cifraConverter)); // A coleção com o converter
    const cifrasList: Cifra[] = [];
    querySnapshot.forEach((doc) => {
      cifrasList.push(doc.data());
    });
    return cifrasList;
  } catch (error) {
    console.error('Erro ao carregar as cifras:', error);
    return [];
  }
};

// Função para salvar uma cifra no Firestore
export const saveCifra = async (cifra: Omit<Cifra, 'id'>): Promise<boolean> => {
  try {
    await addDoc(collection(db, 'cifras').withConverter(cifraConverter), cifra);
    console.log('Cifra salva com sucesso!');
    return true;
  } catch (error) {
    console.error("Erro ao salvar cifra:", error);
    return false;
  }
};

// Função para obter uma cifra específica pelo ID
export const getCifraById = async (id: string): Promise<Cifra | null> => {
  try {
    const docRef = doc(db, 'cifras', id).withConverter(cifraConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();  // Retorna o dado convertido
    } else {
      console.log("Cifra não encontrada");
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter cifra:', error);
    return null;
  }
};

// Função para deletar uma cifra pelo ID
export const deleteCifra = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'cifras', id);  // Referência ao documento
    await deleteDoc(docRef);  // Deleta o documento
    console.log('Cifra deletada com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao deletar cifra:', error);
    return false;
  }
};
