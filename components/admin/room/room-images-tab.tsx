"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import {
  useAddRoomImages,
  useDeleteRoomImage,
} from "@/hooks/admin/use-admin-rooms";
import { Trash2, Star } from "lucide-react";
import { RouterOutput } from "@/trpc/client";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@/utils/uploadthing";

type RoomImage = RouterOutput["admin"]["room"]["detail"]["images"][number];
type UploadedFile = ClientUploadedFileData<
  OurFileRouter["roomImages"]["$types"]["output"]
>;

interface RoomImageCardProps {
  image: RoomImage;
  onDelete: (image: RoomImage) => void;
}

const RoomImageCard = ({ image, onDelete }: RoomImageCardProps) => (
  <div className="group relative rounded-lg overflow-hidden border aspect-video">
    <Image
      src={image.url}
      alt={image.alt ?? ""}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
    />
    {image.isPrimary && (
      <div className="absolute top-2 left-2 z-10 bg-amber-400 text-white rounded px-1.5 py-0.5 flex items-center gap-1 text-xs font-medium">
        <Star className="w-3 h-3 fill-white" />
        Chính
      </div>
    )}
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
      <Button
        variant="destructive"
        size="icon"
        className="h-8 w-8"
        onClick={() => onDelete(image)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  </div>
);

interface RoomImagesTabProps {
  roomId: string;
  images: RoomImage[];
}

export const RoomImagesTab = ({ roomId, images }: RoomImagesTabProps) => {
  const { openConfirm } = useConfirmDialogStore();
  const addImages = useAddRoomImages(roomId);
  const deleteImage = useDeleteRoomImage(roomId);

  const handleUploadComplete = (res: UploadedFile[]) => {
    void addImages.mutateAsync({
      roomId,
      images: res.map((f, i) => ({
        url: f.ufsUrl,
        alt: f.name,
        isPrimary: images.length === 0 && i === 0,
        sortOrder: images.length + i,
      })),
    });
  };

  const handleDelete = (image: RoomImage) => {
    openConfirm({
      title: "Xóa ảnh?",
      description: "Xóa ảnh này khỏi phòng?",
      variant: "destructive",
      onConfirm: () => void deleteImage.mutateAsync({ imageId: image.id }),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <UploadButton
          endpoint="roomImages"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(err) => console.error("Upload error:", err)}
        />
      </div>

      {images.length === 0 ? (
        <Card className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Chưa có ảnh nào
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <RoomImageCard
              key={image.id}
              image={image}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
