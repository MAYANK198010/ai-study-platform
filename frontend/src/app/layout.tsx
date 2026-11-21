import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "AI Study Platform", description: "Turn study material into songs, notes and revision tools." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
