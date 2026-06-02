import "./globals.css";

export const metadata = {
  title: "ZeroWaste",
  description: "ZeroWaste Admin Dashboard",
  icons: {
    icon: "/adminlogo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Albert Sans', Inter, ui-sans-serif, system-ui, sans-serif" }} className="antialiased">
        {children}
      </body>
    </html>
  );
}