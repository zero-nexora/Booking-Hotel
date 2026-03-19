"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { UploadButton } from "@/utils/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  useAddHotelImages,
  useDeleteHotelImage,
} from "@/hooks/admin/use-admin-hotels";

type HotelImage = RouterOutput["admin"]["hotel"]["detail"]["images"][number];
type UploadedFile = ClientUploadedFileData<
  OurFileRouter["hotelImages"]["$types"]["output"]
>;

interface ImageCardProps {
  image: HotelImage;
  onDelete: (image: HotelImage) => void;
}

const ImageCard = ({ image, onDelete }: ImageCardProps) => (
  <div className="group relative rounded-lg overflow-hidden border border-border aspect-video">
    <Image
      src={image.url}
      alt={image.alt ?? ""}
      fill
      className="object-cover"
    />
    {image.isPrimary && (
      <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded px-1.5 py-0.5 flex items-center gap-1 text-xs font-medium">
        <Star className="w-3 h-3 fill-primary-foreground" />
        Chính
      </div>
    )}
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
      <Button
        variant="destructive"
        size="icon"
        className="h-8 w-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={() => onDelete(image)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  </div>
);

interface HotelImagesTabProps {
  hotelId: string;
  images: HotelImage[];
}

export const HotelImagesTab = ({ hotelId, images }: HotelImagesTabProps) => {
  const { openConfirm } = useConfirmDialogStore();
  const addImages = useAddHotelImages(hotelId);
  const deleteImage = useDeleteHotelImage(hotelId);

  const handleUploadComplete = (res: UploadedFile[]) => {
    void addImages.mutateAsync({
      hotelId,
      images: res.map((f, i) => ({
        url: f.ufsUrl,
        alt: f.name,
        isPrimary: images.length === 0 && i === 0,
        sortOrder: images.length + i,
      })),
    });
  };

  const handleDelete = (image: HotelImage) =>
    openConfirm({
      title: "Xóa ảnh?",
      description: "Xóa ảnh này khỏi khách sạn?",
      variant: "destructive",
      onConfirm: () => void deleteImage.mutateAsync({ imageId: image.id }),
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <UploadButton
          endpoint="hotelImages"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(err) => console.error("Upload error:", err)}
        />
      </div>
      {images.length === 0 ? (
        <Card className="bg-card border-border shadow-none flex items-center justify-center h-48 text-muted-foreground text-sm">
          Chưa có ảnh nào
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
