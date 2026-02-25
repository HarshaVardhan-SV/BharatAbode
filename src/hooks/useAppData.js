import { useContext } from 'react';
import { AppDataContext } from '../context/AppDataContext';

export const useAppData = () => useContext(AppDataContext);
