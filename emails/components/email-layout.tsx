import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
} from "@react-email/components";
import * as React from "react";

const GOLD = "#C9A84C";
const DARK = "#0f172a";

interface EmailLayoutProps {
  children: React.ReactNode;
  preview: string;
}

export const EmailLayout = ({ children, preview }: EmailLayoutProps) => (
  <Html lang="vi">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={body}>
      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column align="center">
              <table
                cellPadding={0}
                cellSpacing={0}
                style={{ margin: "0 auto" }}
              >
                <tr>
                  <td style={{ paddingRight: "10px", verticalAlign: "middle" }}>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="6"
                        y="10"
                        width="20"
                        height="18"
                        rx="1"
                        fill={GOLD}
                        fillOpacity="0.15"
                        stroke={GOLD}
                        strokeWidth="1.5"
                      />
                      <rect
                        x="13"
                        y="4"
                        width="6"
                        height="8"
                        rx="0.5"
                        fill={GOLD}
                        fillOpacity="0.25"
                        stroke={GOLD}
                        strokeWidth="1.5"
                      />
                      <line
                        x1="4"
                        y1="10"
                        x2="28"
                        y2="10"
                        stroke={GOLD}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <rect
                        x="9"
                        y="14"
                        width="3"
                        height="3"
                        rx="0.3"
                        fill={GOLD}
                        fillOpacity="0.8"
                      />
                      <rect
                        x="14.5"
                        y="14"
                        width="3"
                        height="3"
                        rx="0.3"
                        fill={GOLD}
                      />
                      <rect
                        x="20"
                        y="14"
                        width="3"
                        height="3"
                        rx="0.3"
                        fill={GOLD}
                        fillOpacity="0.8"
                      />
                      <rect
                        x="9"
                        y="20"
                        width="3"
                        height="3"
                        rx="0.3"
                        fill={GOLD}
                        fillOpacity="0.6"
                      />
                      <rect
                        x="20"
                        y="20"
                        width="3"
                        height="3"
                        rx="0.3"
                        fill={GOLD}
                        fillOpacity="0.6"
                      />
                      <rect
                        x="13.5"
                        y="22"
                        width="5"
                        height="6"
                        rx="0.5"
                        fill="none"
                        stroke={GOLD}
                        strokeWidth="1.2"
                      />
                    </svg>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "#ffffff",
                      }}
                    >
                      Stay<span style={{ color: GOLD }}>wise</span>
                    </span>
                  </td>
                </tr>
              </table>
            </Column>
          </Row>
        </Section>

        <Section style={card}>{children}</Section>

        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Staywise. All rights reserved.
          </Text>
          <Text style={footerLinks}>
            <a href="https://staywise.vn" style={footerLink}>
              Website
            </a>
            {" · "}
            <a href="https://staywise.vn/support" style={footerLink}>
              Hỗ trợ
            </a>
            {" · "}
            <a href="https://staywise.vn/privacy" style={footerLink}>
              Chính sách bảo mật
            </a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const body: React.CSSProperties = {
  backgroundColor: "#f1f5f9",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "40px 0",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
};

const header: React.CSSProperties = {
  backgroundColor: DARK,
  borderRadius: "12px 12px 0 0",
  padding: "20px 32px",
  textAlign: "center",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "32px 40px",
  borderRadius: "0 0 12px 12px",
};

const footer: React.CSSProperties = {
  textAlign: "center",
  marginTop: "24px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "0 0 6px",
};

const footerLinks: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: "#94a3b8",
  textDecoration: "underline",
};
