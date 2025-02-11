import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "Conference Ticket Generator",
  description: "Generate tickets for your conference",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="grid grid-rows-[80px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-12 gap-12 sm:p-10 relative">
          <Navigation />
          {children}
          <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-[radial-gradient(ellipse_at_bottom,rgba(36,160,181,0.3)_0%,rgba(36,160,181,0)_70%)]" />
        </div>
      </body>
    </html>
  );
}
