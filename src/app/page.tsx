
"use client";

import { useState, useEffect } from 'react';
import type { Garment, CapturedItem } from '@/lib/types';
import Header from '@/components/header';
import ARView from '@/components/ar-view';
import GarmentSelector from '@/components/garment-selector';
import CapturedMediaGallery from '@/components/captured-media-gallery';
import { picsum_images } from '@/lib/placeholder-images.json';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { initiateAnonymousSignIn, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

const garments: Garment[] = [
    { id: 1, name: 'Red Dress', image: picsum_images.red_dress.src, 'data-ai-hint': 'red dress' },
    { id: 2, name: 'Denim Jacket', image: picsum_images.denim_jacket.src, 'data-ai-hint': 'denim jacket' },
    { id: 3, name: 'White Blouse', image: picsum_images.white_blouse.src, 'data-ai-hint': 'white blouse' },
    { id: 4, name: 'Black Pants', image: picsum_images.black_pants.src, 'data-ai-hint': 'black pants' },
    { id: 5, name: 'Floral Skirt', image: picsum_images.floral_skirt.src, 'data-ai-hint': 'floral skirt' },
    { id: 6, name: 'Leather Jacket', image: picsum_images.leather_jacket.src, 'data-ai-hint': 'leather jacket' },
    { id: 7, name: 'Blue Jeans', image: picsum_images.blue_jeans.src, 'data-ai-hint': 'blue jeans' },
    { id: 8, name: 'Summer Dress', image: picsum_images.summer_dress.src, 'data-ai-hint': 'summer dress' },
];

export default function Home() {
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);
  
  const capturedMediaRef = useMemoFirebase(() => 
    user ? collection(firestore, 'users', user.uid, 'capturedMedia') : null
  , [user, firestore]);

  const { data: capturedItems, isLoading: isLoadingCapturedItems } = useCollection<CapturedItem>(capturedMediaRef);

  const handleCapture = (dataUrl: string, type: 'photo' | 'video') => {
    if (!user || !selectedGarment) return;

    const newItem: Omit<CapturedItem, 'id'> = {
      userId: user.uid,
      mediaType: type,
      mediaUrl: dataUrl,
      timestamp: serverTimestamp(),
      garmentId: selectedGarment.id.toString(),
      garmentName: selectedGarment.name,
      garmentImage: selectedGarment.image,
    };
    addDocumentNonBlocking(capturedMediaRef!, newItem);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 w-full">
            <ARView 
              selectedGarment={selectedGarment} 
              onCapture={handleCapture} 
            />
          </div>
          <div className="flex flex-col gap-8 w-full">
            <GarmentSelector 
              garments={garments} 
              onSelectGarment={setSelectedGarment} 
              selectedGarment={selectedGarment}
            />
            <CapturedMediaGallery items={capturedItems || []} isLoading={isLoadingCapturedItems} />
          </div>
        </div>
      </main>
    </div>
  );
}
