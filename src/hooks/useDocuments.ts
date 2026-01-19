import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/config';

export interface Document {
  id: string;
  name: string;
  type: string;
  category: 'ID' | 'License' | 'Policy' | 'Investment' | 'Other';
  fileData: string; // base64
  uploadedAt: string;
  userId: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'documents'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Document));
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, []);

  const addDocument = async (name: string, type: string, category: Document['category'], fileData: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'documents'), {
      name,
      type,
      category,
      fileData,
      uploadedAt: new Date().toISOString(),
      userId: user.uid
    });
  };

  const deleteDocument = async (id: string) => {
    await deleteDoc(doc(db, 'documents', id));
  };

  return { documents, addDocument, deleteDocument };
}
