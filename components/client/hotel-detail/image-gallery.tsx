"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid2x2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: { url: string; alt?: string | null }[];
  hotelName: string;
}

export const ImageGallery = ({ images, hotelName }: ImageGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const primary = images[0];
  const thumbs = images.slice(1, 5);
  const hasMore = images.length > 5;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i != null && i > 0 ? i - 1 : i)),
    [],
  );
  const next = useCallback(
    () =>
      setLightboxIndex((i) => (i != null && i < images.length - 1 ? i + 1 : i)),
    [images.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next]);

  if (!primary) return null;

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-muted">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-72 sm:h-96">
          <div
            className="col-span-2 row-span-2 relative cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={primary.url}
              alt={primary.alt ?? hotelName}
              fill
              className="object-cover"
              priority
            />
          </div>

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
                className="object-cover"
              />
              {i === thumbs.length - 1 && hasMore && (
                <div className="absolute inset-0 bg-foreground/50 flex flex-col items-center justify-center gap-1">
                  <Images className="w-5 h-5 text-background" />
                  <span className="text-background text-sm font-semibold">
                    +{images.length - 5}
                  </span>
                </div>
              )}
            </div>
          ))}

          {Array.from({ length: Math.max(0, 4 - thumbs.length) }).map(
            (_, i) => (
              <div key={`empty-${i}`} className="bg-muted" />
            ),
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 right-3 gap-1.5 text-xs shadow-md bg-background/90 text-foreground border-border hover:bg-background"
          onClick={() => openLightbox(0)}
        >
          <Grid2x2 className="w-3.5 h-3.5" />
          Xem tất cả {images.length} ảnh
        </Button>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          onClick={closeLightbox}
        >
          <div className="absolute inset-0 bg-foreground/95 backdrop-blur-sm" />

          <div
            className="relative z-10 flex items-center justify-between px-5 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium text-background/80">
              {hotelName}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-background/40 tabular-nums">
                {lightboxIndex + 1} / {images.length}
              </span>
              <button
                onClick={closeLightbox}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-background/10 hover:bg-background/20 text-background"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="relative z-10 flex-1 flex items-center justify-center px-14 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prev}
              disabled={lightboxIndex === 0}
              className="absolute left-4 flex items-center justify-center w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 disabled:opacity-20 disabled:cursor-not-allowed text-background"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative w-full h-full max-h-[70vh]">
              <Image
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].alt ?? hotelName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
              />
            </div>

            <button
              onClick={next}
              disabled={lightboxIndex === images.length - 1}
              className="absolute right-4 flex items-center justify-center w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 disabled:opacity-20 disabled:cursor-not-allowed text-background"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative z-10 flex justify-center gap-2 px-4 pb-5 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`relative shrink-0 w-14 h-10 rounded-md overflow-hidden ${
                  i === lightboxIndex
                    ? "ring-2 ring-background opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
