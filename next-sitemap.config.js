/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: 'https://www.picasclub.vercel.app', // Substitua pela URL do seu site
    generateRobotsTxt: true, // Gera automaticamente o robots.txt
    exclude: ['/private-page'], // Exclua páginas que não devem ser indexadas
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' }, // Permite acesso a todas as páginas públicas
        { userAgent: '*', disallow: '/_next/' }, // Bloqueia acesso ao diretório _next
      ],
    },
  };
  
  module.exports = config;
  