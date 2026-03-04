import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
  preview: string;
}

export const EmailLayout = ({ children, preview }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={card}>{children}</Section>

          <Section style={footer}>
            © {new Date().getFullYear()} Staywise. All rights reserved.
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const body = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "40px 0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const card = {
  backgroundColor: "#ffffff",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const footer = {
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#9ca3af",
  marginTop: "20px",
};
