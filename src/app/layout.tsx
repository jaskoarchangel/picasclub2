import './styles/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <title>Picas Club - seu site de rolas e picas duras</title>
      <head/>
      <body>{children}</body>
    </html>
  );
}