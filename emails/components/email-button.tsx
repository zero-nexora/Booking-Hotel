import { Button } from "@react-email/components";
import * as React from "react";

const GOLD = "#C9A96E";
const DARK = "#1A1612";

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
  color: "#F5F0E8",
  borderRadius: "8px",
  padding: "13px 32px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "8px",
  fontFamily: "'Nunito Sans', -apple-system, sans-serif",
  border: `1px solid rgba(201,169,110,0.3)`,
};

const outlineBtn: React.CSSProperties = {
  backgroundColor: "transparent",
  color: DARK,
  border: `1.5px solid #C9A96E`,
  borderRadius: "8px",
  padding: "13px 32px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "8px",
  fontFamily: "'Nunito Sans', -apple-system, sans-serif",
};
