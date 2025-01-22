import './styles/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <link rel="icon" href="/favicon.ico" />
      <title>Picas Club - seu site de rolas e picas duras</title>
      <head/>
      <body>{children}</body>
    </html>
  );
}