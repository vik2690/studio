
"use client";

import { usePersona, type Persona } from '@/contexts/PersonaContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserCog } from 'lucide-react';

export function PersonaSwitcher() {
  const { persona, setPersona } = usePersona();

  const handlePersonaChange = (value: string) => {
    setPersona(value as Persona);
  };

  return (
    <div className="flex items-center gap-2">
      <UserCog className="h-5 w-5 text-muted-foreground" />
      <Label htmlFor="persona-select" className="text-sm text-muted-foreground sr-only md:not-sr-only">
        Persona:
      </Label>
      <Select value={persona} onValueChange={handlePersonaChange}>
        <SelectTrigger id="persona-select" className="w-[120px] h-9 text-sm">
          <SelectValue placeholder="Select Persona" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Manager">Manager</SelectItem>
          <SelectItem value="Analyst">Analyst</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
