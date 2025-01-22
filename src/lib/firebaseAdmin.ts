import admin from 'firebase-admin';

// Verifique se a app já foi inicializada para evitar duplicação
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Você pode usar credenciais do serviço
    // Alternativamente, se você tiver a chave privada do seu Firebase, pode usá-la assim:
    // credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

export { auth };