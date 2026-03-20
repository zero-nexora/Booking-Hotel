"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useFeaturedHotels } from "@/hooks/client/use-home";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const FeaturedHotels = () => {
  const { data: hotels, isLoading } = useFeaturedHotels();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {hotels?.map((hotel) => (
        <motion.div
          key={hotel.id}
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link href={`/hotels/${hotel.slug}`} className="flex">
            <div className="flex flex-col w-full rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md">
              <div className="relative h-48 bg-muted overflow-hidden shrink-0">
                {hotel.images[0] ? (
                  <Image
                    src={hotel.images[0].url}
                    alt={hotel.images[0].alt ?? hotel.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="outline"
                    className="backdrop-blur-sm bg-background/80 border-border text-foreground text-xs font-medium gap-0.5"
                  >
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-2.5 h-2.5 fill-primary text-primary"
                      />
                    ))}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-4">
                <h3 className="font-semibold text-sm leading-tight line-clamp-1 text-foreground">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {hotel.address.city.name}, {hotel.address.city.country.name}
                  </span>
                </div>
                <div className="mt-auto pt-3">
                  <div className="border-t border-border pt-3">
                    {hotel.avgRating !== null ? (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          {hotel.avgRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({hotel.reviewCount} đánh giá)
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Chưa có đánh giá
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
