import * as Yup from "yup";

export const coursesRegisterSchema = Yup.object().shape({
  nome: Yup.string()
    .required("Nome do curso é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  sigla: Yup.string()
    .required("Sigla do curso é obrigatória")
    .min(2, "Mínimo 2 caracteres")
    .max(4, "A sigla deve ter no máximo 4 caracteres")
    .matches(/^[A-Za-z]+$/, "A sigla deve conter apenas letras"),
  codigo: Yup.string()
    .required("Código é obrigatório")
    .max(4, "O código deve ter no máximo 4 dígitos")
    .matches(/^\d+$/, "O código deve conter apenas números"),
});

export const siglaValidationSchema = Yup.string()
  .max(4, "A sigla deve ter no máximo 4 caracteres")
  .matches(/^[A-Za-z]*$/, "A sigla não deve conter números");

export const codigoValidationSchema = Yup.string()
  .max(4, "O código deve ter no máximo 4 dígitos")
  .matches(/^\d*$/, "O código deve conter apenas números");


export const coursesRegisterStep2Schema = Yup.object().shape({
    modelo: Yup.string()
    .required("Modalidade é obrigatória"),
    coordenadorId: Yup.string()
    .required("Coordenador é obrigatório"),
})