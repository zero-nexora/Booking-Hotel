"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { stripePromise } from "@/lib/stripe-client";

interface PaymentSectionProps {
  clientSecret: string;
  total: number;
  onPaymentSuccess: () => void;
  onPaymentError: (message: string) => void;
}

export const PaymentSection = (props: PaymentSectionProps) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            borderRadius: "10px",
            fontSizeBase: "14px",
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
};

const PaymentForm = ({
  total,
  onPaymentSuccess,
  onPaymentError,
}: PaymentSectionProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements || !agreed) return;
    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      onPaymentError(error.message ?? "Thanh toán thất bại");
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      onPaymentSuccess();
    }
  };

  const busy = processing;

  return (
    <div className="space-y-5">
      <div className="min-h-40">
        <PaymentElement
          onReady={() => setReady(true)}
          options={{ layout: "tabs" }}
        />
        {!ready && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor="terms"
          className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
        >
          Tôi đồng ý với{" "}
          <a
            href="/terms"
            className="text-primary underline underline-offset-2"
          >
            điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a
            href="/privacy"
            className="text-primary underline underline-offset-2"
          >
            chính sách bảo mật
          </a>
          .
        </Label>
      </div>

      <Button
        className="w-full rounded-xl h-11 gap-2 text-base font-semibold"
        disabled={!agreed || busy || !ready}
        onClick={handleSubmit}
      >
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShieldCheck className="w-4 h-4" />
        )}
        {busy ? "Đang xử lý..." : `Xác nhận & Thanh toán $${total}`}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5" />
        Thanh toán bảo mật qua Stripe. Thông tin thẻ được mã hoá.
      </div>
    </div>
  );
};
