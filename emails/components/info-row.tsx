import { Row, Column, Text } from "@react-email/components";
import * as React from "react";

interface InfoRowProps {
  label: string;
  value: string;
  last?: boolean;
}

export const InfoRow = ({ label, value, last = false }: InfoRowProps) => (
  <Row
    style={{
      borderBottom: last ? "none" : "1px solid #E8E0CF",
      padding: "10px 0",
    }}
  >
    <Column style={{ width: "40%" }}>
      <Text style={labelStyle}>{label}</Text>
    </Column>
    <Column>
      <Text style={valueStyle}>{value}</Text>
    </Column>
  </Row>
);

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#7A6F5E",
  margin: 0,
  fontWeight: 500,
  fontFamily: "'Nunito Sans', -apple-system, sans-serif",
};

const valueStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#1A1612",
  margin: 0,
  fontWeight: 600,
  fontFamily: "'Nunito Sans', -apple-system, sans-serif",
};
