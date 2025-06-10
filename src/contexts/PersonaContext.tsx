"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

export type Persona = 'Admin' | 'Manager' | 'Analyst';

interface PersonaContextType {
  persona: Persona;
  setPersona: Dispatch<SetStateAction<Persona>>;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>('Admin'); // Default to Admin

  const value = useMemo(() => ({ persona, setPersona }), [persona]);

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona(): PersonaContextType {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
