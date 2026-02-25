import { mockIdeas, mockUsers } from '../data/mockData';

const API = import.meta.env.VITE_API_URL || null;

const KEYS = {
  users: 'ba_users',
  currentUser: 'ba_current_user',
  ideas: 'ba_ideas',
  savedIdeas: 'ba_saved_ideas',
  propertyForm: 'ba_property_form'
};

const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const read = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const TITLE_IMAGE_MAP = {
  'Reflective Roof Coating': [
    'https://images.unsplash.com/photo-1635424824849-1b09bdcc55b1?auto=format&fit=crop&w=1200&q=80'
  ],
  'Modular Kitchen Refresh': [
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80'
  ],
  'Balcony Green Corner': [
    'https://images.unsplash.com/photo-1685092056529-8885ad54e512?auto=format&fit=crop&w=1200&q=80'
  ],
  'Smart Home': [
    'https://plus.unsplash.com/premium_photo-1727483376866-1422c45951a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1655976796910-b239b1a1a41c?auto=format&fit=crop&w=1200&q=80'
  ],
  'Smart Home Upgrade': [
    'https://plus.unsplash.com/premium_photo-1727483376866-1422c45951a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1655976796910-b239b1a1a41c?auto=format&fit=crop&w=1200&q=80'
  ],
  'Smart Lighting + Sensors': [
    'https://plus.unsplash.com/premium_photo-1727483376866-1422c45951a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1655976796910-b239b1a1a41c?auto=format&fit=crop&w=1200&q=80'
  ],
  'Parking Surface & Marking': [
    'https://plus.unsplash.com/premium_photo-1678677941108-17f8845c17ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551394846-d03c5a4bc4bc?auto=format&fit=crop&w=1200&q=80'
  ],
  'Bathroom Waterproofing': [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=1200&q=80'
  ],
  'Bathroom Waterproofing Upgrade': [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=1200&q=80'
  ]
};

const normalizeIdeas = (ideas) =>
  ideas.map((idea) => {
    const mappedImages = TITLE_IMAGE_MAP[idea.title];
    if (mappedImages) {
      return { ...idea, images: mappedImages, imageUrl: mappedImages[0] };
    }
    if (Array.isArray(idea.images) && idea.images.length) return { ...idea, imageUrl: idea.images[0] };
    if (idea.imageUrl) return { ...idea, images: [idea.imageUrl], imageUrl: idea.imageUrl };
    return idea;
  });

const init = () => {
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, mockUsers);
  if (!localStorage.getItem(KEYS.ideas)) {
    write(KEYS.ideas, normalizeIdeas(mockIdeas));
  } else {
    const existingIdeas = read(KEYS.ideas, []);
    write(KEYS.ideas, normalizeIdeas(existingIdeas));
  }
  if (!localStorage.getItem(KEYS.savedIdeas)) write(KEYS.savedIdeas, {});
  if (!localStorage.getItem(KEYS.propertyForm)) write(KEYS.propertyForm, {});
};

const request = async (path, options = {}) => {
  if (!API) return null;
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) throw new Error('Request failed');
  return res.status === 204 ? null : res.json();
};

init();

export const authApi = {
  async register(payload) {
    if (API) return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    await wait();
    const users = read(KEYS.users, []);
    const exists = users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) throw new Error('Email already registered');
    const user = { id: `u-${Date.now()}`, ...payload, role: 'user' };
    write(KEYS.users, [...users, user]);
    return { id: user.id, name: user.name, email: user.email, city: user.city, role: user.role };
  },
  async login(payload) {
    if (API) return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    await wait();
    const users = read(KEYS.users, []);
    const match = users.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password
    );
    if (!match) throw new Error('Invalid credentials. Register first, then login.');
    const safe = { id: match.id, name: match.name, email: match.email, city: match.city, role: match.role };
    write(KEYS.currentUser, safe);
    return safe;
  },
  async currentUser() {
    if (API) return request('/auth/me');
    await wait(80);
    return read(KEYS.currentUser, null);
  },
  async logout() {
    if (API) return request('/auth/logout', { method: 'POST' });
    localStorage.removeItem(KEYS.currentUser);
  }
};

export const ideasApi = {
  async list() {
    if (API) return request('/ideas');
    await wait();
    return read(KEYS.ideas, []);
  },
  async create(payload) {
    if (API) return request('/ideas', { method: 'POST', body: JSON.stringify(payload) });
    const ideas = read(KEYS.ideas, []);
    const next = { id: `idea-${Date.now()}`, ...payload };
    write(KEYS.ideas, [next, ...ideas]);
    return next;
  },
  async update(id, updates) {
    if (API) return request(`/ideas/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
    const ideas = read(KEYS.ideas, []).map((i) => (i.id === id ? { ...i, ...updates } : i));
    write(KEYS.ideas, ideas);
    return ideas.find((i) => i.id === id);
  },
  async remove(id) {
    if (API) return request(`/ideas/${id}`, { method: 'DELETE' });
    const ideas = read(KEYS.ideas, []).filter((i) => i.id !== id);
    write(KEYS.ideas, ideas);
  }
};

export const userApi = {
  async listUsers() {
    if (API) return request('/users');
    await wait();
    return read(KEYS.users, []).map(({ password, ...rest }) => rest);
  },
  async getSavedIdeas(userId) {
    if (API) return request(`/users/${userId}/saved-ideas`);
    const ids = read(KEYS.savedIdeas, {})[userId] || [];
    const ideas = read(KEYS.ideas, []);
    return ideas.filter((i) => ids.includes(i.id));
  },
  async saveIdea(userId, ideaId) {
    if (API) return request(`/users/${userId}/saved-ideas`, { method: 'POST', body: JSON.stringify({ ideaId }) });
    const map = read(KEYS.savedIdeas, {});
    const ids = map[userId] || [];
    if (!ids.includes(ideaId)) write(KEYS.savedIdeas, { ...map, [userId]: [...ids, ideaId] });
  },
  async removeSavedIdea(userId, ideaId) {
    if (API) return request(`/users/${userId}/saved-ideas/${ideaId}`, { method: 'DELETE' });
    const map = read(KEYS.savedIdeas, {});
    const ids = map[userId] || [];
    write(KEYS.savedIdeas, { ...map, [userId]: ids.filter((id) => id !== ideaId) });
  },
  async savePropertyForm(userId, payload) {
    if (API) return request(`/users/${userId}/property-form`, { method: 'POST', body: JSON.stringify(payload) });
    const map = read(KEYS.propertyForm, {});
    write(KEYS.propertyForm, { ...map, [userId]: payload });
  },
  async getPropertyForm(userId) {
    if (API) return request(`/users/${userId}/property-form`);
    return read(KEYS.propertyForm, {})[userId] || null;
  }
};
