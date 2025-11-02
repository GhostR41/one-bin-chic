import { useState, useEffect } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { EditableText } from './EditableText';
import { Button } from './ui/button';
import { Plus, X } from 'lucide-react';
import { shortTextSchema } from '@/lib/validation-schemas';
import { toast } from 'sonner';
import { z } from 'zod';

interface TechItem {
  id: string;
  name: string;
}

interface EditableTechStackProps {
  storageKey: string;
  initialTechs: string[];
}

export function EditableTechStack({ storageKey, initialTechs }: EditableTechStackProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [techs, setTechs] = useState<TechItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setTechs(JSON.parse(saved));
      } catch {
        const initialItems = initialTechs.map((tech, idx) => ({
          id: `tech_${idx}`,
          name: tech
        }));
        setTechs(initialItems);
      }
    } else {
      const initialItems = initialTechs.map((tech, idx) => ({
        id: `tech_${idx}`,
        name: tech
      }));
      setTechs(initialItems);
    }
  }, [storageKey, initialTechs]);

  useEffect(() => {
    if (techs.length > 0) {
      try {
        const validated = techs.map(tech => ({
          ...tech,
          name: shortTextSchema.parse(tech.name)
        }));
        const data = JSON.stringify(validated);
        localStorage.setItem(storageKey, data);
        syncContent(storageKey, data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error(`Validation error: ${error.errors[0].message}`);
        }
      }
    }
  }, [techs, storageKey, syncContent]);

  const addTech = () => {
    const newTech: TechItem = {
      id: `tech_${Date.now()}`,
      name: 'New Tech'
    };
    setTechs([...techs, newTech]);
    setHasUnsavedChanges(true);
  };

  const deleteTech = (id: string) => {
    setTechs(techs.filter(tech => tech.id !== id));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {techs.map((tech) => (
        <div
          key={tech.id}
          className="tactical-border rounded bg-card/50 p-3 text-center hover:bg-primary/10 transition-all relative group"
        >
          <EditableText
            id={`${storageKey}_${tech.id}`}
            initialValue={tech.name}
            className="text-xs text-foreground"
            as="span"
          />
          {isEditMode && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteTech(tech.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
      {isEditMode && (
        <button
          onClick={addTech}
          className="tactical-border rounded bg-card/50 p-3 text-center hover:bg-primary/10 transition-all border-dashed flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Add Tech</span>
        </button>
      )}
    </div>
  );
}
