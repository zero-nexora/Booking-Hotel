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
      borderBottom: last ? "none" : "1px solid #f1f5f9",
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
  color: "#64748b",
  margin: 0,
  fontWeight: 500,
};

const valueStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#0f172a",
  margin: 0,
  fontWeight: 600,
};
