"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid2x2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i! > 0 ? i! - 1 : images.length - 1));
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i! < images.length - 1 ? i! + 1 : 0));
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  if (!primary) return null;

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-muted">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-72 sm:h-96">
          <motion.div
            className="col-span-2 row-span-2 relative cursor-pointer"
            onClick={() => openLightbox(0)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={primary.url}
              alt={primary.alt ?? hotelName}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {thumbs.map((img, i) => (
            <motion.div
              key={i}
              className="relative cursor-pointer"
              onClick={() => openLightbox(i + 1)}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
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
            </motion.div>
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

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={closeLightbox}
          >
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <div
              className="relative z-10 flex items-center justify-between px-5 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-medium text-background/80">
                {hotelName}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {lightboxIndex + 1} / {images.length}
                </span>
                <Button
                  onClick={closeLightbox}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              className="relative z-10 flex-1 flex items-center justify-center px-14 pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  setLightboxIndex((i) => (i! > 0 ? i! - 1 : images.length - 1))
                }
                className="absolute left-4 flex items-center justify-center w-10 h-10 rounded-full bg-muted/60 hover:bg-muted text-foreground disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  className="relative w-full h-full max-h-[70vh]"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <Image
                    src={images[lightboxIndex].url}
                    alt={images[lightboxIndex].alt ?? hotelName}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() =>
                  setLightboxIndex((i) => (i! < images.length - 1 ? i! + 1 : 0))
                }
                className="absolute right-4 flex items-center justify-center w-10 h-10 rounded-full bg-muted/60 hover:bg-muted text-foreground disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative z-10 flex justify-center gap-2 px-4 pb-5 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative shrink-0 w-14 h-10 rounded-md overflow-hidden ${
                    i === lightboxIndex
                      ? "ring-2 ring-background opacity-100"
                      : "opacity-40 hover:opacity-70"
                  }`}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.15 }}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
