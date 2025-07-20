'use client';

import Image from 'next/image';
import type { Garment } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Video } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ARViewProps {
  selectedGarment: Garment | null;
  onCapture: (type: 'photo' | 'video') => void;
}

export default function ARView({ selectedGarment, onCapture }: ARViewProps) {
  return (
    <div className="relative w-full">
      <Card className="w-full aspect-[9/16] max-h-[75vh] overflow-hidden relative shadow-lg bg-muted/30">
        <Image
          src="https://placehold.co/900x1600.png"
          alt="User view"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
          data-ai-hint="woman posing"
        />
        <AnimatePresence>
          {selectedGarment && (
            <motion.div
              key={selectedGarment.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <Image
                src={selectedGarment.image}
                alt={selectedGarment.name}
                width={400}
                height={600}
                objectFit="contain"
                className="drop-shadow-2xl"
                data-ai-hint={selectedGarment['data-ai-hint']}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <Button
          size="lg"
          className="rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm text-primary hover:bg-background shadow-lg"
          variant="outline"
          aria-label="Take Photo"
          onClick={() => onCapture('photo')}
        >
          <Camera className="h-7 w-7" />
        </Button>
        <Button
          size="lg"
          className="rounded-full h-16 w-16 bg-accent/90 backdrop-blur-sm text-accent-foreground hover:bg-accent shadow-lg"
          aria-label="Record Video"
          onClick={() => onCapture('video')}
        >
          <Video className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
