import './styles/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
      <link rel="icon" href="/favicon.ico" />
      <title>Picas Club - seu site de rolas e picas duras</title>
        {/* Link para a fonte Montserrat do Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

</head>
      <body>{children}</body>
    </html>
  );
}