"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Grid2X2, X } from "lucide-react";

interface HotelGalleryProps {
  images: {
    id: string;
    url: string;
    alt?: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  hotelName: string;
}

export const HotelGallery = ({ images, hotelName }: HotelGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sorted = [...images].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  const primary = sorted[0];
  const thumbnails = sorted.slice(1, 5);

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + sorted.length) % sorted.length);
  const next = () => setCurrentIndex((i) => (i + 1) % sorted.length);

  if (!primary) return null;

  return (
    <>
      <div className="hidden md:grid grid-cols-3 gap-2 h-105">
        <div
          className="col-span-2 relative rounded-l-xl overflow-hidden cursor-pointer"
          onClick={() => {
            setCurrentIndex(0);
            setLightboxOpen(true);
          }}
        >
          <Image
            src={primary.url}
            alt={primary.alt ?? hotelName}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-rows-2 gap-2">
          {thumbnails.slice(0, 3).map((img, i) => (
            <div
              key={img.id}
              className={`relative overflow-hidden cursor-pointer ${i === 1 ? "rounded-tr-xl" : ""}`}
              onClick={() => {
                setCurrentIndex(i + 1);
                setLightboxOpen(true);
              }}
            >
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          ))}
          {thumbnails.length >= 4 && (
            <div
              className="relative overflow-hidden cursor-pointer rounded-br-xl"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={thumbnails[3].url}
                alt=""
                fill
                className="object-cover"
                sizes="200px"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Button variant="secondary" size="sm">
                  <Grid2X2 className="w-4 h-4 mr-2" />
                  Xem tất cả
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden relative h-64">
        <Image
          src={primary.url}
          alt={primary.alt ?? hotelName}
          fill
          className="object-cover rounded-xl"
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 right-3"
          onClick={() => setLightboxOpen(true)}
        >
          <Grid2X2 className="w-4 h-4 mr-1" />
          {sorted.length} ảnh
        </Button>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <div className="relative h-[80vh]">
            <Image
              src={sorted[currentIndex]?.url ?? ""}
              alt={sorted[currentIndex]?.alt ?? ""}
              fill
              className="object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            {sorted.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prev}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={next}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {currentIndex + 1} / {sorted.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
