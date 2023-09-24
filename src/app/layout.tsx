import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume of Joyson Madtha",
  description:
    "Experienced software developer with 5+ years in web technologies, offering expertise in frontend and backend development. Discover my resume, projects, and achievements to see how I can enhance your team.",
  generator: "Next.js",
  applicationName: "Resume",
  creator: "Joyson Madtha",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Resume",
    "Frontend",
    "Backend",
    "Fullstack",
    "Software",
    "Developer",
    "React",
    "Reactjs",
    "Javascript",
    "Angular",
    "Nextjs",
    "Nestjs",
    "Node",
    "Nodejs",
    "Web",
    "Senior",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
