import * as Yup from "yup";

export const userLoginSchema = Yup.object().shape({
  email: Yup.string().required("E-mail é obrigatório").email("E-mail inválido"),
  senha: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const userRegisterSchema = Yup.object().shape({
  nome: Yup.string()
    .required("Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: Yup.string().required("E-mail é obrigatório").email("E-mail inválido"),
  senha: Yup.string()
    .required("Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const userEmailSchema = Yup.object().shape({
  email: Yup.string().required("E-mail é obrigatório").email("E-mail inválido"),
})

export const userPasswordSchema = Yup.object().shape({
  senha: Yup.string()
    .required("Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
})
