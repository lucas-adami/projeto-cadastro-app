import api from "../apiService";

export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });

  // A resposta do backend contém: token, userId, userName, user
  return {
    token: response.data.token,
    user: response.data.user,
    userId: response.data.userId,
    userName: response.data.userName,
  };
}

export async function getForgetPasswordToken(email: string) {
  const response = await api.post("/auth/esqueceu-senha", { email });
  return response.data.token;
}

export async function compareCode(code: string) {
  const response = await api.post("/auth/verifica-reset-code", { code });

  return response.data;
}

export async function resetPassword(novaSenha: string) {
  const response = await api.post("/auth/resetar-senha", {
    novaSenha,
    confirmarSenha: novaSenha,
  });
  return response.data;
}

export async function changePassword(senhaAtual: string, novaSenha: string) {
  const response = await api.put("/auth/alterar-senha", {
    senhaAtual,
    novaSenha,
    confirmarSenha: novaSenha,
  });
  return response.data;
}
