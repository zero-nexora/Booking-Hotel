import { Button } from "@react-email/components";
import * as React from "react";

const DARK = "#0f172a";

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}

export const EmailButton = ({
  href,
  children,
  variant = "primary",
}: EmailButtonProps) => (
  <Button href={href} style={variant === "primary" ? primaryBtn : outlineBtn}>
    {children}
  </Button>
);

const primaryBtn: React.CSSProperties = {
  backgroundColor: DARK,
  color: "#ffffff",
  borderRadius: "8px",
  padding: "12px 28px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
  marginTop: "8px",
};

const outlineBtn: React.CSSProperties = {
  backgroundColor: "transparent",
  color: DARK,
  border: `1.5px solid #e2e8f0`,
  borderRadius: "8px",
  padding: "12px 28px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
  marginTop: "8px",
};
