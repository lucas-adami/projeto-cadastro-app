import * as Yup from "yup";
import {
  professorRegisterSchema,
  professorRegisterStep2Schema,
} from "../professorsRegisterValidations";

describe("ProfessorsRegisterValidations", () => {
  describe("professorRegisterSchema", () => {
    it("deve validar dados de professor corretos - step 1", async () => {
      // Arrange
      const validProfessorData = {
        nome: "Dr. João Silva",
        email: "joao.silva@fatec.sp.gov.br",
        titulacao: "Doutor",
        idUnidade: "1",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(validProfessorData)
      ).resolves.toEqual(validProfessorData);
    });

    it("deve rejeitar nome vazio", async () => {
      // Arrange
      const invalidData = {
        nome: "",
        email: "joao@fatec.sp.gov.br",
        titulacao: "Doutor",
        idUnidade: "1",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(invalidData)
      ).rejects.toThrow("Nome é obrigatório");
    });

    it("deve rejeitar nome muito curto", async () => {
      // Arrange
      const invalidData = {
        nome: "Jo",
        email: "joao@fatec.sp.gov.br",
        titulacao: "Doutor",
        idUnidade: "1",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(invalidData)
      ).rejects.toThrow("Nome deve ter pelo menos 3 caracteres");
    });

    it("deve aceitar nome com exatamente 3 caracteres", async () => {
      // Arrange
      const validData = {
        nome: "Ana",
        email: "ana@fatec.sp.gov.br",
        titulacao: "Mestra",
        idUnidade: "2",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(validData)
      ).resolves.toEqual(validData);
    });

    it("deve rejeitar email vazio", async () => {
      // Arrange
      const invalidData = {
        nome: "Dr. João Silva",
        email: "",
        titulacao: "Doutor",
        idUnidade: "1",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(invalidData)
      ).rejects.toThrow("E-mail é obrigatório");
    });

    it("deve rejeitar email inválido", async () => {
      // Arrange
      const invalidData = {
        nome: "Dr. João Silva",
        email: "email-inválido",
        titulacao: "Doutor",
        idUnidade: "1",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(invalidData)
      ).rejects.toThrow("E-mail inválido");
    });

    it("deve rejeitar titulação vazia", async () => {
      // Arrange
      const invalidData = {
        nome: "Dr. João Silva",
        email: "joao@fatec.sp.gov.br",
        titulacao: "",
        idUnidade: "1",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(invalidData)
      ).rejects.toThrow("Titulação é obrigatória");
    });

    it("deve rejeitar unidade vazia", async () => {
      // Arrange
      const invalidData = {
        nome: "Dr. João Silva",
        email: "joao@fatec.sp.gov.br",
        titulacao: "Doutor",
        idUnidade: "",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(invalidData)
      ).rejects.toThrow("Unidade é obrigatória");
    });

    it("deve validar diferentes tipos de titulação", async () => {
      // Arrange
      const titulacoes = ["Doutor", "Mestre", "Especialista", "Graduado"];

      for (const titulacao of titulacoes) {
        const validData = {
          nome: "Professor Teste",
          email: "professor@fatec.sp.gov.br",
          titulacao,
          idUnidade: "1",
        };

        // Act & Assert
        await expect(
          professorRegisterSchema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve validar diferentes formatos de email válidos", async () => {
      // Arrange
      const validEmails = [
        "professor@fatec.sp.gov.br",
        "prof.silva@fatec.edu.br",
        "joao+teste@universidade.com.br",
      ];

      for (const email of validEmails) {
        const validData = {
          nome: "Professor Teste",
          email,
          titulacao: "Doutor",
          idUnidade: "1",
        };

        // Act & Assert
        await expect(
          professorRegisterSchema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve rejeitar dados com campos faltando", async () => {
      // Arrange
      const incompleteData = {
        nome: "Professor Teste",
        email: "teste@fatec.sp.gov.br",
        // faltando titulacao e idUnidade
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(incompleteData)
      ).rejects.toThrow();
    });
  });

  describe("professorRegisterStep2Schema", () => {
    it("deve validar dados corretos do step 2", async () => {
      // Arrange
      const validStep2Data = {
        lattes: "http://lattes.cnpq.br/1234567890",
        referencia: "MS-3",
        statusAtividade: "Ativo",
      };

      // Act & Assert
      await expect(
        professorRegisterStep2Schema.validate(validStep2Data)
      ).resolves.toEqual(validStep2Data);
    });

    it("deve rejeitar URL do Lattes inválida", async () => {
      // Arrange
      const invalidData = {
        lattes: "url-inválida",
        referencia: "MS-3",
        statusAtividade: "Ativo",
      };

      // Act & Assert
      await expect(
        professorRegisterStep2Schema.validate(invalidData)
      ).rejects.toThrow("URL inválida");
    });

    it("deve rejeitar Lattes vazio", async () => {
      // Arrange
      const invalidData = {
        lattes: "",
        referencia: "MS-3",
        statusAtividade: "Ativo",
      };

      // Act & Assert
      await expect(
        professorRegisterStep2Schema.validate(invalidData)
      ).rejects.toThrow("Link do Lattes é obrigatório");
    });

    it("deve aceitar diferentes URLs válidas do Lattes", async () => {
      // Arrange
      const validUrls = [
        "http://lattes.cnpq.br/1234567890",
        "https://lattes.cnpq.br/0987654321",
        "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=K123456",
      ];

      for (const lattes of validUrls) {
        const validData = {
          lattes,
          referencia: "MS-3",
          statusAtividade: "Ativo",
        };

        // Act & Assert
        await expect(
          professorRegisterStep2Schema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve rejeitar referência vazia", async () => {
      // Arrange
      const invalidData = {
        lattes: "http://lattes.cnpq.br/1234567890",
        referencia: "",
        statusAtividade: "Ativo",
      };

      // Act & Assert
      await expect(
        professorRegisterStep2Schema.validate(invalidData)
      ).rejects.toThrow("Referência é obrigatória");
    });

    it("deve rejeitar status vazio", async () => {
      // Arrange
      const invalidData = {
        lattes: "http://lattes.cnpq.br/1234567890",
        referencia: "MS-3",
        statusAtividade: "",
      };

      // Act & Assert
      await expect(
        professorRegisterStep2Schema.validate(invalidData)
      ).rejects.toThrow("Status do professor é obrigatório");
    });

    it("deve validar diferentes tipos de referência", async () => {
      // Arrange
      const referencias = [
        "MS-1",
        "MS-2",
        "MS-3",
        "MS-4",
        "MS-5",
        "DR-1",
        "DR-2",
      ];

      for (const referencia of referencias) {
        const validData = {
          lattes: "http://lattes.cnpq.br/1234567890",
          referencia,
          statusAtividade: "Ativo",
        };

        // Act & Assert
        await expect(
          professorRegisterStep2Schema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve validar diferentes status de atividade", async () => {
      // Arrange
      const statusList = ["Ativo", "Inativo", "Licença", "Aposentado"];

      for (const statusAtividade of statusList) {
        const validData = {
          lattes: "http://lattes.cnpq.br/1234567890",
          referencia: "MS-3",
          statusAtividade,
        };

        // Act & Assert
        await expect(
          professorRegisterStep2Schema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve rejeitar dados com campos faltando no step 2", async () => {
      // Arrange
      const incompleteData = {
        lattes: "http://lattes.cnpq.br/1234567890",
        // faltando referencia e statusAtividade
      };

      // Act & Assert
      await expect(
        professorRegisterStep2Schema.validate(incompleteData)
      ).rejects.toThrow();
    });
  });

  describe("integração entre step 1 e step 2", () => {
    it("deve permitir validação sequencial dos steps", async () => {
      // Arrange
      const step1Data = {
        nome: "Dr. João Silva",
        email: "joao@fatec.sp.gov.br",
        titulacao: "Doutor",
        idUnidade: "1",
      };

      const step2Data = {
        lattes: "http://lattes.cnpq.br/1234567890",
        referencia: "DR-2",
        statusAtividade: "Ativo",
      };

      // Act & Assert
      await expect(
        professorRegisterSchema.validate(step1Data)
      ).resolves.toEqual(step1Data);
      await expect(
        professorRegisterStep2Schema.validate(step2Data)
      ).resolves.toEqual(step2Data);
    });

    it("deve manter consistência de validação de email entre steps", async () => {
      // Arrange
      const email = "professor@fatec.sp.gov.br";

      // Act & Assert
      await expect(
        professorRegisterSchema.validateAt("email", { email })
      ).resolves.toBe(email);
    });
  });
});
