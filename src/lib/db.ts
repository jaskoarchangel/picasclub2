import { db } from './firebase'; // Configuração do Firebase
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  updateDoc, 
  FirestoreDataConverter, 
  DocumentData, 
  QueryDocumentSnapshot 
} from 'firebase/firestore';

// Interface que define os dados de uma cifra
export interface Cifra {
  id?: string;
  titulo: string;
  autor: string;
  texto: string;
  videoUrl?: string; // Campo opcional
}

// Converter para mapear documentos do Firestore para objetos tipados
const cifraConverter: FirestoreDataConverter<Cifra> = {
  toFirestore(cifra: Cifra): DocumentData {
    const { titulo, autor, texto, videoUrl } = cifra;
    const data: DocumentData = { titulo, autor, texto };
    if (videoUrl) data.videoUrl = videoUrl; // Adiciona apenas se existir
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Cifra {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      titulo: data.titulo,
      autor: data.autor,
      texto: data.texto,
      videoUrl: data.videoUrl || undefined, // Converte para undefined, se não existir
    };
  },
};

// Obter todas as cifras
export const getCifras = async (): Promise<Cifra[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cifras').withConverter(cifraConverter));
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Erro ao carregar as cifras:', error);
    return [];
  }
};

// Salvar ou atualizar uma cifra
export const saveCifra = async (cifra: Cifra): Promise<boolean> => {
  try {
    const { id, ...data } = cifra; // Desestrutura para separar o ID dos dados
    if (id) {
      // Atualização
      const docRef = doc(db, 'cifras', id).withConverter(cifraConverter);
      await updateDoc(docRef, data);
      console.log('Cifra atualizada com sucesso!');
    } else {
      // Criação
      await addDoc(collection(db, 'cifras').withConverter(cifraConverter), data);
      console.log('Cifra criada com sucesso!');
    }
    return true;
  } catch (error) {
    console.error('Erro ao salvar ou atualizar cifra:', error);
    return false;
  }
};

// Obter uma cifra por ID
export const getCifraById = async (id: string): Promise<Cifra | null> => {
  try {
    const docRef = doc(db, 'cifras', id).withConverter(cifraConverter);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Erro ao obter cifra:', error);
    return null;
  }
};

// Excluir uma cifra
export const deleteCifra = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'cifras', id);
    await deleteDoc(docRef);
    console.log('Cifra excluída com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao excluir a cifra:', error);
    return false;
  }
};
