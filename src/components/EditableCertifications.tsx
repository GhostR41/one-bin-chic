import { useState, useEffect } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { EditableText } from './EditableText';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { shortTextSchema } from '@/lib/validation-schemas';
import { toast } from 'sonner';
import { z } from 'zod';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface EditableCertificationsProps {
  storageKey: string;
  initialCerts: Array<{ name: string; issuer: string; year: string }>;
}

export function EditableCertifications({ storageKey, initialCerts }: EditableCertificationsProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setCertifications(JSON.parse(saved));
      } catch {
        const initialItems = initialCerts.map((cert, idx) => ({
          id: `cert_${idx}`,
          ...cert
        }));
        setCertifications(initialItems);
      }
    } else {
      const initialItems = initialCerts.map((cert, idx) => ({
        id: `cert_${idx}`,
        ...cert
      }));
      setCertifications(initialItems);
    }
  }, [storageKey, initialCerts]);

  useEffect(() => {
    if (certifications.length > 0) {
      try {
        const validated = certifications.map(cert => ({
          ...cert,
          name: shortTextSchema.parse(cert.name),
          issuer: shortTextSchema.parse(cert.issuer),
          year: shortTextSchema.parse(cert.year)
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
  }, [certifications, storageKey, syncContent]);

  const addCertification = () => {
    const newCert: Certification = {
      id: `cert_${Date.now()}`,
      name: 'New Certification',
      issuer: 'Issuer',
      year: '2024'
    };
    setCertifications([...certifications, newCert]);
    setHasUnsavedChanges(true);
  };

  const deleteCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="border-l-2 border-primary pl-4 relative group">
            <EditableText
              id={`${storageKey}_${cert.id}_name`}
              initialValue={cert.name}
              className="text-foreground font-bold text-sm"
              as="h3"
            />
            <EditableText
              id={`${storageKey}_${cert.id}_issuer`}
              initialValue={cert.issuer}
              className="text-xs text-muted-foreground"
              as="p"
            />
            <EditableText
              id={`${storageKey}_${cert.id}_year`}
              initialValue={cert.year}
              className="text-xs text-primary mt-1"
              as="p"
            />
            {isEditMode && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteCertification(cert.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {isEditMode && (
        <Button onClick={addCertification} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      )}
    </div>
  );
}
