import { useState, useEffect } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { EditableText } from './EditableText';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { shortTextSchema } from '@/lib/validation-schemas';
import { toast } from 'sonner';
import { z } from 'zod';

interface TrainingItem {
  id: string;
  course: string;
  progress: number;
}

interface EditableTrainingProps {
  storageKey: string;
  initialTraining: Array<{ course: string; progress: number }>;
}

export function EditableTraining({ storageKey, initialTraining }: EditableTrainingProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [training, setTraining] = useState<TrainingItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setTraining(JSON.parse(saved));
      } catch {
        const initialItems = initialTraining.map((item, idx) => ({
          id: `training_${idx}`,
          ...item
        }));
        setTraining(initialItems);
      }
    } else {
      const initialItems = initialTraining.map((item, idx) => ({
        id: `training_${idx}`,
        ...item
      }));
      setTraining(initialItems);
    }
  }, [storageKey, initialTraining]);

  useEffect(() => {
    if (training.length > 0) {
      try {
        const validated = training.map(item => ({
          ...item,
          course: shortTextSchema.parse(item.course),
          progress: z.number().min(0).max(100).parse(item.progress)
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
  }, [training, storageKey, syncContent]);

  const addTraining = () => {
    const newItem: TrainingItem = {
      id: `training_${Date.now()}`,
      course: 'New Course',
      progress: 0
    };
    setTraining([...training, newItem]);
    setHasUnsavedChanges(true);
  };

  const deleteTraining = (id: string) => {
    setTraining(training.filter(item => item.id !== id));
    setHasUnsavedChanges(true);
  };

  const updateProgress = (id: string, progress: number) => {
    const validProgress = Math.max(0, Math.min(100, progress));
    setTraining(training.map(item => 
      item.id === id ? { ...item, progress: validProgress } : item
    ));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-4">
      {training.map((item) => (
        <div key={item.id} className="relative group">
          <div className="flex justify-between text-sm mb-2">
            <EditableText
              id={`${storageKey}_${item.id}_course`}
              initialValue={item.course}
              className="text-foreground"
              as="span"
            />
            <div className="flex items-center gap-2">
              {isEditMode && (
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={item.progress}
                  onChange={(e) => updateProgress(item.id, parseInt(e.target.value) || 0)}
                  className="w-16 h-6 text-xs"
                />
              )}
              <span className="text-primary font-mono">{item.progress}%</span>
              {isEditMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteTraining(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
      {isEditMode && (
        <Button onClick={addTraining} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Training Course
        </Button>
      )}
    </div>
  );
}
