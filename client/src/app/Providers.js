"use client";
import { NextUIProvider } from "@nextui-org/react";
import { DNSProvider } from "@/utils/DNSProvider";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <DNSProvider>{children}</DNSProvider>
    </NextUIProvider>
  );
}