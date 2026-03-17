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
import { useTheme } from "next-themes";

interface PaymentSectionProps {
  clientSecret: string;
  total: number;
  onPaymentSuccess: () => void;
  onPaymentError: (message: string) => void;
}

const STRIPE_APPEARANCE_LIGHT = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#b89a6f",
    colorBackground: "#faf7f2",
    colorText: "#241a0f",
    colorTextSecondary: "#7a6f5e",
    colorTextPlaceholder: "#b5a898",
    colorDanger: "#c0392b",
    colorIconTab: "#7a6f5e",
    colorIconTabSelected: "#b89a6f",
    colorIconTabHover: "#241a0f",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSizeBase: "14px",
    fontSizeSm: "12px",
    borderRadius: "10px",
    spacingUnit: "4px",
    spacingGridRow: "20px",
    spacingGridColumn: "16px",
  },
  rules: {
    ".Input": {
      backgroundColor: "#faf7f2",
      border: "1px solid #d4b896",
      boxShadow: "none",
      color: "#241a0f",
      padding: "10px 12px",
      fontSize: "14px",
    },
    ".Input:focus": {
      border: "1px solid #b89a6f",
      boxShadow: "0 0 0 3px rgba(184,154,111,0.15)",
      outline: "none",
    },
    ".Input--invalid": {
      border: "1px solid #c0392b",
      boxShadow: "0 0 0 3px rgba(192,57,43,0.1)",
    },
    ".Input::placeholder": {
      color: "#b5a898",
    },
    ".Label": {
      color: "#4a4035",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "6px",
    },
    ".Error": {
      color: "#c0392b",
      fontSize: "12px",
      marginTop: "4px",
    },
    ".Tab": {
      backgroundColor: "#f5f0e8",
      border: "1px solid #d4b896",
      boxShadow: "none",
      color: "#7a6f5e",
      padding: "10px 16px",
    },
    ".Tab:hover": {
      backgroundColor: "#ede8dc",
      color: "#241a0f",
      border: "1px solid #b89a6f",
    },
    ".Tab--selected": {
      backgroundColor: "#faf7f2",
      border: "1px solid #b89a6f",
      color: "#241a0f",
      boxShadow: "0 0 0 2px rgba(184,154,111,0.2)",
    },
    ".Tab--selected:focus": {
      boxShadow: "0 0 0 2px rgba(184,154,111,0.25)",
    },
    ".TabIcon": {
      color: "#7a6f5e",
    },
    ".TabIcon--selected": {
      color: "#b89a6f",
    },
    ".TabLabel": {
      fontSize: "13px",
      fontWeight: "500",
    },
    ".Block": {
      backgroundColor: "#f5f0e8",
      border: "1px solid #d4b896",
      borderRadius: "10px",
    },
    ".CheckboxInput": {
      borderColor: "#d4b896",
    },
    ".CheckboxInput--checked": {
      backgroundColor: "#b89a6f",
      borderColor: "#b89a6f",
    },
    ".PickerItem": {
      border: "1px solid #d4b896",
      backgroundColor: "#faf7f2",
    },
    ".PickerItem--selected": {
      border: "1px solid #b89a6f",
      backgroundColor: "#f5f0e8",
    },
  },
};

const STRIPE_APPEARANCE_DARK = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#b89a6f",
    colorBackground: "#1e1812",
    colorText: "#f0e8dc",
    colorTextSecondary: "#8c7a68",
    colorTextPlaceholder: "#5a4e42",
    colorDanger: "#e05c4b",
    colorIconTab: "#8c7a68",
    colorIconTabSelected: "#b89a6f",
    colorIconTabHover: "#f0e8dc",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSizeBase: "14px",
    fontSizeSm: "12px",
    borderRadius: "10px",
    spacingUnit: "4px",
    spacingGridRow: "20px",
    spacingGridColumn: "16px",
  },
  rules: {
    ".Input": {
      backgroundColor: "#2a2016",
      border: "1px solid rgba(184,154,111,0.25)",
      boxShadow: "none",
      color: "#f0e8dc",
      padding: "10px 12px",
      fontSize: "14px",
    },
    ".Input:focus": {
      border: "1px solid #b89a6f",
      boxShadow: "0 0 0 3px rgba(184,154,111,0.12)",
      outline: "none",
    },
    ".Input--invalid": {
      border: "1px solid #e05c4b",
      boxShadow: "0 0 0 3px rgba(224,92,75,0.1)",
    },
    ".Input::placeholder": {
      color: "#5a4e42",
    },
    ".Label": {
      color: "#a09080",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "6px",
    },
    ".Error": {
      color: "#e05c4b",
      fontSize: "12px",
      marginTop: "4px",
    },
    ".Tab": {
      backgroundColor: "#241a0f",
      border: "1px solid rgba(184,154,111,0.2)",
      boxShadow: "none",
      color: "#8c7a68",
      padding: "10px 16px",
    },
    ".Tab:hover": {
      backgroundColor: "#2a2016",
      color: "#f0e8dc",
      border: "1px solid rgba(184,154,111,0.4)",
    },
    ".Tab--selected": {
      backgroundColor: "#2a2016",
      border: "1px solid #b89a6f",
      color: "#f0e8dc",
      boxShadow: "0 0 0 2px rgba(184,154,111,0.15)",
    },
    ".Tab--selected:focus": {
      boxShadow: "0 0 0 2px rgba(184,154,111,0.2)",
    },
    ".TabIcon": {
      color: "#8c7a68",
    },
    ".TabIcon--selected": {
      color: "#b89a6f",
    },
    ".TabLabel": {
      fontSize: "13px",
      fontWeight: "500",
    },
    ".Block": {
      backgroundColor: "#241a0f",
      border: "1px solid rgba(184,154,111,0.2)",
      borderRadius: "10px",
    },
    ".CheckboxInput": {
      borderColor: "rgba(184,154,111,0.3)",
      backgroundColor: "transparent",
    },
    ".CheckboxInput--checked": {
      backgroundColor: "#b89a6f",
      borderColor: "#b89a6f",
    },
    ".PickerItem": {
      border: "1px solid rgba(184,154,111,0.2)",
      backgroundColor: "#241a0f",
    },
    ".PickerItem--selected": {
      border: "1px solid #b89a6f",
      backgroundColor: "#2a2016",
    },
  },
};

export const PaymentSection = (props: PaymentSectionProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: !isDark ? STRIPE_APPEARANCE_DARK : STRIPE_APPEARANCE_LIGHT,
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
          className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <Label
          htmlFor="terms"
          className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
        >
          Tôi đồng ý với{" "}
          <a
            href="/terms"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a
            href="/privacy"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            chính sách bảo mật
          </a>
          .
        </Label>
      </div>

      <Button
        className="w-full rounded-xl h-11 gap-2 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!agreed || processing || !ready}
        onClick={handleSubmit}
      >
        {processing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShieldCheck className="w-4 h-4" />
        )}
        {processing ? "Đang xử lý..." : `Xác nhận & Thanh toán $${total}`}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5" />
        Thanh toán bảo mật qua Stripe. Thông tin thẻ được mã hoá.
      </div>
    </div>
  );
};
