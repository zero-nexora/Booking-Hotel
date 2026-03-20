"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronRight, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useHotelDetail } from "@/hooks/client/use-hotels";
import { useCreateBookingIntent } from "@/hooks/client/use-booking";
import { useMe } from "@/hooks/client/use-user";

import { BookingSummary } from "./booking-summary";
import { GuestInfoForm } from "./guest-info-form";
import { PaymentSection } from "./payment-section";
import { ExpiryTimer } from "./expiry-timer";
import { useQueryStates } from "nuqs";
import { bookingParsers } from "@/lib/search-params/booking-params";

const guestSchema = z.object({
  guestName: z.string().min(1, "Vui lòng nhập họ tên"),
  guestEmail: z.string().email("Email không hợp lệ"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

type GuestValues = z.infer<typeof guestSchema>;
type Step = "guest" | "payment";

interface BookingClientProps {
  hotelSlug: string;
  roomSlug: string;
}

const STEP_ORDER: Step[] = ["guest", "payment"];

export const BookingClient = ({ hotelSlug, roomSlug }: BookingClientProps) => {
  const router = useRouter();
  const [params] = useQueryStates(bookingParsers);
  const checkIn = params.checkIn || undefined;
  const checkOut = params.checkOut || undefined;
  const adults = params.adults || 1;
  const children = params.children || 0;

  const { data: hotel, isLoading } = useHotelDetail(
    hotelSlug,
    checkIn,
    checkOut,
    adults,
    children,
  );

  const { data: me } = useMe();

  const [step, setStep] = useState<Step>("guest");
  const [prevStep, setPrevStep] = useState<Step>("guest");
  const [intentData, setIntentData] = useState<{
    clientSecret: string;
    bookingId: string;
    bookingRef: string;
    expiresAt: Date;
    total: number;
    currency: string;
  } | null>(null);

  const createIntent = useCreateBookingIntent();

  const form = useForm<GuestValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guestName: me?.name ?? "",
      guestEmail: me?.email ?? "",
      guestPhone: me?.phone ?? "",
      specialRequests: "",
    },
  });

  useEffect(() => {
    if (me) {
      form.reset({
        guestName: me.name ?? "",
        guestEmail: me.email ?? "",
        guestPhone: me.phone ?? "",
        specialRequests: "",
      });
    }
  }, [me, form]);

  if (isLoading) return <BookingPageSkeleton />;

  if (!hotel || !checkIn || !checkOut) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Thông tin đặt phòng không hợp lệ.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 border-border text-foreground hover:bg-muted"
          asChild
        >
          <Link href={`/hotels/${hotelSlug}`}>Quay lại khách sạn</Link>
        </Button>
      </div>
    );
  }

  const room = hotel.rooms.find((r) => r.slug === roomSlug);
  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Phòng không tồn tại hoặc đã được đặt.
        </p>
        <Button
          size="sm"
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href={`/hotels/${hotelSlug}`}>Chọn phòng khác</Link>
        </Button>
      </div>
    );
  }

  const pricePerNight = Number(room.basePrice.toString());
  const nights = differenceInDays(checkOut, checkIn);
  const total = pricePerNight * nights;
  const hotelImage = hotel.images[0]?.url;

  const goToStep = (next: Step) => {
    setPrevStep(step);
    setStep(next);
  };

  const isForward = STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(prevStep);

  const handleGuestSubmit = async (values: GuestValues) => {
    const result = await createIntent.mutateAsync({
      hotelSlug,
      roomSlug,
      checkIn,
      checkOut,
      adults,
      children,
      ...values,
    });

    setIntentData({
      clientSecret: result.clientSecret!,
      bookingId: result.bookingId,
      expiresAt: new Date(result.expiresAt),
      total: result.total,
      currency: result.currency,
      bookingRef: result.bookingRef,
    });
    goToStep("payment");
  };

  const handlePaymentSuccess = async () => {
    if (!intentData) return;
    router.push(`/booking/confirmation/${intentData.bookingRef}`);
  };

  const handlePaymentError = (message: string) => toast.error(message);

  const handleExpired = () => {
    toast.error("Phiên đặt phòng đã hết hạn. Vui lòng thử lại.");
    goToStep("guest");
    setIntentData(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2 h-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          asChild
        >
          <Link href={`/hotels/${hotelSlug}`}>
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại
          </Link>
        </Button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{hotel.name}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">Đặt phòng</span>
      </div>

      <div className="flex items-center gap-3">
        <StepBadge
          icon={<User className="w-3.5 h-3.5" />}
          label="Thông tin khách"
          active={step === "guest"}
          done={step === "payment"}
          number={1}
        />
        <div className="flex-1 h-px bg-border" />
        <StepBadge
          icon={<CreditCard className="w-3.5 h-3.5" />}
          label="Thanh toán"
          active={step === "payment"}
          done={false}
          number={2}
        />
      </div>

      {step === "payment" && intentData && (
        <ExpiryTimer
          expiresAt={intentData.expiresAt}
          onExpire={handleExpired}
        />
      )}

      <div className="flex wrapper gap-6 items-start">
        <div className="flex-1 min-w-0 space-y-6 w-full overflow-hidden">
          <AnimatePresence mode="wait" custom={isForward}>
            <motion.div
              key={step}
              custom={isForward}
              initial={{ opacity: 0, x: isForward ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isForward ? -40 : 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {step === "guest" && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleGuestSubmit)}
                    className="space-y-6"
                  >
                    <Section title="Thông tin khách lưu trú">
                      <GuestInfoForm />
                    </Section>
                    <Button
                      type="submit"
                      className="w-full rounded-xl h-11 gap-2 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={createIntent.isPending}
                    >
                      {createIntent.isPending
                        ? "Đang xử lý..."
                        : "Tiếp tục thanh toán"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </form>
                </Form>
              )}

              {step === "payment" && intentData && (
                <Section title="Thanh toán">
                  <PaymentSection
                    clientSecret={intentData.clientSecret}
                    total={total}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </Section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="md:hidden w-full">
          <BookingSummary
            hotelName={hotel.name}
            hotelImage={hotelImage}
            roomName={room.name}
            roomType={room.roomType.name}
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            childCount={children}
            pricePerNight={pricePerNight}
            currency="USD"
            checkInTime={hotel.policy?.checkInTime}
            checkOutTime={hotel.policy?.checkOutTime}
            expiresAt={intentData?.expiresAt}
          />
        </div>

        <div className="box-block md:w-80 shrink-0 w-full">
          <div className="sticky top-24">
            <BookingSummary
              hotelName={hotel.name}
              hotelImage={hotelImage}
              roomName={room.name}
              roomType={room.roomType.name}
              checkIn={checkIn}
              checkOut={checkOut}
              adults={adults}
              childCount={children}
              pricePerNight={pricePerNight}
              currency="USD"
              checkInTime={hotel.policy?.checkInTime}
              checkOutTime={hotel.policy?.checkOutTime}
              expiresAt={intentData?.expiresAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
    <h2 className="font-semibold text-sm text-foreground">{title}</h2>
    <Separator className="bg-border" />
    {children}
  </div>
);

const StepBadge = ({
  icon,
  label,
  active,
  done,
  number,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  done: boolean;
  number: number;
}) => (
  <div className="flex items-center gap-2 shrink-0">
    <motion.div
      animate={{
        scale: active ? 1.1 : 1,
        backgroundColor: active
          ? "var(--color-primary, hsl(var(--primary)))"
          : done
            ? "hsl(var(--primary) / 0.2)"
            : "hsl(var(--muted))",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
      style={{
        color: active
          ? "hsl(var(--primary-foreground))"
          : done
            ? "hsl(var(--primary))"
            : "hsl(var(--muted-foreground))",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={done ? "done" : number}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {done ? "✓" : number}
        </motion.span>
      </AnimatePresence>
    </motion.div>
    <motion.span
      animate={{ opacity: active ? 1 : 0.5 }}
      transition={{ duration: 0.25 }}
      className="text-sm font-medium box-hidden text-foreground"
    >
      {label}
    </motion.span>
  </div>
);

const BookingPageSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
    <Skeleton className="h-8 w-48 bg-muted" />
    <Skeleton className="h-10 w-full bg-muted" />
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-64 rounded-2xl bg-muted" />
        <Skeleton className="h-12 rounded-xl bg-muted" />
      </div>
      <div className="w-80 shrink-0">
        <Skeleton className="h-80 rounded-2xl bg-muted" />
      </div>
    </div>
  </div>
);
