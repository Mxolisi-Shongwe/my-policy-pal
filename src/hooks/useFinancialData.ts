import { useState, useEffect } from 'react';
import { auth, db } from '@/integrations/firebase/config';
import { collection, addDoc, query, where, onSnapshot, Unsubscribe, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Policy, Investment, Alert } from '@/types/financial';

export function useFinancialData() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubPolicies: Unsubscribe | undefined;
    let unsubInvestments: Unsubscribe | undefined;
    let unsubAlerts: Unsubscribe | undefined;

    const setupListeners = () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const policiesQuery = query(collection(db, 'policies'), where('userId', '==', user.uid));
      const investmentsQuery = query(collection(db, 'investments'), where('userId', '==', user.uid));
      const alertsQuery = query(collection(db, 'alerts'), where('userId', '==', user.uid));

      unsubPolicies = onSnapshot(policiesQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Policy));
        setPolicies(data);
        setLoading(false);
      });

      unsubInvestments = onSnapshot(investmentsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
        setInvestments(data);
      });

      unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
        
        // Update priority based on current date
        data.forEach(async (alert) => {
          if (alert.dueDate) {
            const daysUntilDue = Math.floor(
              (new Date(alert.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            let newPriority: 'low' | 'medium' | 'high';
            if (daysUntilDue <= 7) {
              newPriority = 'high';
            } else if (daysUntilDue <= 30) {
              newPriority = 'medium';
            } else {
              newPriority = 'low';
            }
            
            // Update if priority changed
            if (alert.priority !== newPriority) {
              await updateDoc(doc(db, 'alerts', alert.id), { priority: newPriority });
            }
          }
        });
        
        setAlerts(data);
      });
    };

    // Setup listeners immediately if user is already loaded
    if (auth.currentUser) {
      setupListeners();
    }

    // Also listen for auth state changes
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setupListeners();
      } else {
        setPolicies([]);
        setInvestments([]);
        setAlerts([]);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      unsubPolicies?.();
      unsubInvestments?.();
      unsubAlerts?.();
    };
  }, []);

  const addPolicy = async (policy: Omit<Policy, 'id'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const policyRef = await addDoc(collection(db, 'policies'), {
      ...policy,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });

    // Auto-create expiry alert with dynamic priority
    const expiryDate = new Date(policy.expiryDate);
    const alertDate = new Date(expiryDate);
    alertDate.setDate(alertDate.getDate() - 30);

    if (alertDate > new Date()) {
      const daysUntilExpiry = Math.floor(
        (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Dynamic priority based on days until expiry
      let priority: 'low' | 'medium' | 'high';
      if (daysUntilExpiry <= 30) {
        priority = 'high';
      } else if (daysUntilExpiry <= 60) {
        priority = 'medium';
      } else {
        priority = 'low';
      }

      await addDoc(collection(db, 'alerts'), {
        type: 'renewal',
        title: `${policy.name} Renewal Due`,
        description: `Your ${policy.type} policy expires on ${expiryDate.toLocaleDateString()}. Consider renewing soon.`,
        dueDate: alertDate.toISOString().split('T')[0],
        priority,
        relatedItemId: policyRef.id,
        relatedItemType: 'policy',
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    await addDoc(collection(db, 'investments'), {
      ...investment,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });
  };

  const addAlert = async (alert: Omit<Alert, 'id'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    await addDoc(collection(db, 'alerts'), {
      ...alert,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });
  };

  const updateAlert = async (id: string, alert: Omit<Alert, 'id'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    await updateDoc(doc(db, 'alerts', id), alert);
  };

  const deleteAlert = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    await deleteDoc(doc(db, 'alerts', id));
  };

  return { policies, investments, alerts, addPolicy, addInvestment, addAlert, updateAlert, deleteAlert, loading };
}
