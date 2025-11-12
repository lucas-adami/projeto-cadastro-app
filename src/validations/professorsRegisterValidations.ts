import * as Yup from 'yup';

export const professorRegisterSchema = Yup.object().shape({
  nome: Yup.string()
    .required("Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: Yup.string()
    .required("E-mail é obrigatório")
    .email("E-mail inválido"),
  titulacao: Yup.string()
    .required("Titulação é obrigatória"),
  idUnidade: Yup.string()
    .required("Unidade é obrigatória"),
});

export const professorRegisterStep2Schema = Yup.object().shape({
  lattes: Yup.string()
    .url("URL inválida")
    .required("Link do Lattes é obrigatório"),
  referencia: Yup.string()
    .required("Referência é obrigatória"),
  statusAtividade: Yup.string()
    .required("Status do professor é obrigatório")
});