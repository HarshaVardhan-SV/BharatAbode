import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { ideasApi, userApi } from '../services/api';

export const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [users, setUsers] = useState([]);
  const [propertyForm, setPropertyForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshIdeas = async () => setIdeas(await ideasApi.list());
  const refreshSaved = async () => setSavedIdeas(user ? await userApi.getSavedIdeas(user.id) : []);
  const refreshUsers = async () => setUsers(user?.role === 'admin' ? await userApi.listUsers() : []);
  const refreshProperty = async () => setPropertyForm(user ? await userApi.getPropertyForm(user.id) : null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await refreshIdeas();
      await Promise.all([refreshSaved(), refreshUsers(), refreshProperty()]);
      setLoading(false);
    };
    run();
  }, [user]);

  const value = useMemo(() => ({
    ideas,
    savedIdeas,
    users,
    propertyForm,
    loading,
    saveIdea: async (ideaId) => {
      if (!user) return;
      await userApi.saveIdea(user.id, ideaId);
      await refreshSaved();
    },
    removeSavedIdea: async (ideaId) => {
      if (!user) return;
      await userApi.removeSavedIdea(user.id, ideaId);
      await refreshSaved();
    },
    savePropertyForm: async (form) => {
      if (!user) return;
      await userApi.savePropertyForm(user.id, form);
      await refreshProperty();
    },
    addIdea: async (payload) => {
      await ideasApi.create(payload);
      await refreshIdeas();
    },
    editIdea: async (id, updates) => {
      await ideasApi.update(id, updates);
      await refreshIdeas();
      await refreshSaved();
    },
    deleteIdea: async (id) => {
      await ideasApi.remove(id);
      await refreshIdeas();
      await refreshSaved();
    }
  }), [ideas, savedIdeas, users, propertyForm, loading, user]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
