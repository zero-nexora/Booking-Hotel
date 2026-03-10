"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid2x2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: { url: string; alt?: string | null }[];
  hotelName: string;
}

export function ImageGallery({ images, hotelName }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const primary = images[0];
  const thumbs = images.slice(1, 5);
  const hasMore = images.length > 5;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i != null ? Math.max(0, i - 1) : 0));
  const next = () =>
    setLightboxIndex((i) =>
      i != null ? Math.min(images.length - 1, i + 1) : 0,
    );

  if (!primary) return null;

  return (
    <>
      {/* Grid layout */}
      <div className="relative rounded-2xl overflow-hidden bg-muted">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-105 sm:h-120">
          {/* Primary large */}
          <div
            className="col-span-2 row-span-2 relative cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={primary.url}
              alt={primary.alt ?? hotelName}
              fill
              className="object-cover hover:brightness-90 transition-[filter]"
              priority
            />
          </div>

          {/* Thumbs */}
          {thumbs.map((img, i) => (
            <div
              key={i}
              className="relative cursor-pointer"
              onClick={() => openLightbox(i + 1)}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${hotelName} ${i + 2}`}
                fill
                className="object-cover hover:brightness-90 transition-[filter]"
              />
              {/* Show more overlay on last thumb */}
              {i === thumbs.length - 1 && hasMore && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                  <Images className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-medium">
                    +{images.length - 5}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Fill empty slots if < 5 images */}
          {Array.from({ length: Math.max(0, 4 - thumbs.length) }).map(
            (_, i) => (
              <div key={`empty-${i}`} className="bg-muted" />
            ),
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 right-3 gap-1.5 text-xs shadow"
          onClick={() => openLightbox(0)}
        >
          <Grid2x2 className="w-3.5 h-3.5" />
          Xem tất cả {images.length} ảnh
        </Button>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-4/3 w-full">
              <Image
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].alt ?? hotelName}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-9 w-9 shadow"
                onClick={prev}
                disabled={lightboxIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-9 w-9 shadow"
                onClick={next}
                disabled={lightboxIndex === images.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 rounded-full h-8 w-8"
              onClick={closeLightbox}
            >
              <X className="w-4 h-4" />
            </Button>

            <p className="text-center text-white/60 text-xs mt-2">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
