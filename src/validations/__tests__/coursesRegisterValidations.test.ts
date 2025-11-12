import * as Yup from "yup";
import {
  coursesRegisterSchema,
  coursesRegisterStep2Schema,
  siglaValidationSchema,
  codigoValidationSchema,
} from "../coursesRegisterValidations";

describe("CoursesRegisterValidations", () => {
  describe("coursesRegisterSchema", () => {
    it("deve validar dados de curso corretos - step 1", async () => {
      // Arrange
      const validCourseData = {
        nome: "Análise e Desenvolvimento de Sistemas",
        sigla: "ADS",
        codigo: "1234",
      };

      // Act & Assert
      await expect(
        coursesRegisterSchema.validate(validCourseData)
      ).resolves.toEqual(validCourseData);
    });

    it("deve rejeitar nome vazio", async () => {
      // Arrange
      const invalidData = {
        nome: "",
        sigla: "ADS",
        codigo: "1234",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Nome do curso é obrigatório"
      );
    });

    it("deve rejeitar nome muito curto", async () => {
      // Arrange
      const invalidData = {
        nome: "TI",
        sigla: "TI",
        codigo: "1234",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Nome deve ter pelo menos 3 caracteres"
      );
    });

    it("deve aceitar nome com exatamente 3 caracteres", async () => {
      // Arrange
      const validData = {
        nome: "ADS",
        sigla: "ADS",
        codigo: "1234",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(validData)).resolves.toEqual(
        validData
      );
    });

    it("deve rejeitar sigla vazia", async () => {
      // Arrange
      const invalidData = {
        nome: "Sistemas de Informação",
        sigla: "",
        codigo: "1234",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Sigla do curso é obrigatória"
      );
    });

    it("deve rejeitar sigla muito curta", async () => {
      // Arrange
      const invalidData = {
        nome: "Sistemas de Informação",
        sigla: "S",
        codigo: "1234",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Mínimo 2 caracteres"
      );
    });

    it("deve rejeitar sigla muito longa", async () => {
      // Arrange
      const invalidData = {
        nome: "Sistemas de Informação",
        sigla: "SISTEMAS",
        codigo: "1234",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "A sigla deve ter no máximo 4 caracteres"
      );
    });

    it("deve rejeitar sigla com números", async () => {
      // Arrange
      const invalidData = {
        nome: "Sistemas de Informação",
        sigla: "SI1",
        codigo: "1234",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "A sigla deve conter apenas letras"
      );
    });

    it("deve aceitar siglas válidas", async () => {
      // Arrange
      const validSiglas = ["ADS", "DSM", "GTI", "SI"];

      for (const sigla of validSiglas) {
        const validData = {
          nome: "Curso de Tecnologia",
          sigla,
          codigo: "1234",
        };

        // Act & Assert
        await expect(
          coursesRegisterSchema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve rejeitar código vazio", async () => {
      // Arrange
      const invalidData = {
        nome: "Sistemas de Informação",
        sigla: "SI",
        codigo: "",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Código é obrigatório"
      );
    });

    it("deve rejeitar código muito longo", async () => {
      // Arrange
      const invalidData = {
        nome: "Sistemas de Informação",
        sigla: "SI",
        codigo: "12345",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "O código deve ter no máximo 4 dígitos"
      );
    });

    it("deve rejeitar código com letras", async () => {
      // Arrange
      const invalidData = {
        nome: "Sistemas de Informação",
        sigla: "SI",
        codigo: "12A3",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(invalidData)).rejects.toThrow(
        "O código deve conter apenas números"
      );
    });

    it("deve aceitar códigos válidos", async () => {
      // Arrange
      const validCodigos = ["1", "12", "123", "1234"];

      for (const codigo of validCodigos) {
        const validData = {
          nome: "Curso de Tecnologia",
          sigla: "CT",
          codigo,
        };

        // Act & Assert
        await expect(
          coursesRegisterSchema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve validar curso completo com dados reais", async () => {
      // Arrange
      const courseExamples = [
        {
          nome: "Análise e Desenvolvimento de Sistemas",
          sigla: "ADS",
          codigo: "0001",
        },
        {
          nome: "Desenvolvimento de Software Multiplataforma",
          sigla: "DSM",
          codigo: "0002",
        },
        {
          nome: "Gestão da Tecnologia da Informação",
          sigla: "GTI",
          codigo: "0003",
        },
      ];

      for (const course of courseExamples) {
        // Act & Assert
        await expect(coursesRegisterSchema.validate(course)).resolves.toEqual(
          course
        );
      }
    });
  });

  describe("siglaValidationSchema", () => {
    it("deve aceitar siglas válidas", async () => {
      // Arrange
      const validSiglas = ["ADS", "DSM", "GTI", "SI", ""];

      for (const sigla of validSiglas) {
        // Act & Assert
        await expect(siglaValidationSchema.validate(sigla)).resolves.toBe(
          sigla
        );
      }
    });

    it("deve rejeitar sigla muito longa", async () => {
      // Arrange
      const longSigla = "SISTEMAS";

      // Act & Assert
      await expect(siglaValidationSchema.validate(longSigla)).rejects.toThrow(
        "A sigla deve ter no máximo 4 caracteres"
      );
    });

    it("deve rejeitar sigla com números", async () => {
      // Arrange
      const siglaWithNumbers = "ADS1";

      // Act & Assert
      await expect(
        siglaValidationSchema.validate(siglaWithNumbers)
      ).rejects.toThrow("A sigla não deve conter números");
    });

    it("deve aceitar string vazia (para validação em tempo real)", async () => {
      // Arrange
      const emptySigla = "";

      // Act & Assert
      await expect(siglaValidationSchema.validate(emptySigla)).resolves.toBe(
        ""
      );
    });
  });

  describe("codigoValidationSchema", () => {
    it("deve aceitar códigos válidos", async () => {
      // Arrange
      const validCodigos = ["1", "12", "123", "1234", ""];

      for (const codigo of validCodigos) {
        // Act & Assert
        await expect(codigoValidationSchema.validate(codigo)).resolves.toBe(
          codigo
        );
      }
    });

    it("deve rejeitar código muito longo", async () => {
      // Arrange
      const longCodigo = "12345";

      // Act & Assert
      await expect(codigoValidationSchema.validate(longCodigo)).rejects.toThrow(
        "O código deve ter no máximo 4 dígitos"
      );
    });

    it("deve rejeitar código com letras", async () => {
      // Arrange
      const codigoWithLetters = "12A3";

      // Act & Assert
      await expect(
        codigoValidationSchema.validate(codigoWithLetters)
      ).rejects.toThrow("O código deve conter apenas números");
    });

    it("deve aceitar string vazia (para validação em tempo real)", async () => {
      // Arrange
      const emptyCodigo = "";

      // Act & Assert
      await expect(codigoValidationSchema.validate(emptyCodigo)).resolves.toBe(
        ""
      );
    });
  });

  describe("coursesRegisterStep2Schema", () => {
    it("deve validar dados corretos do step 2", async () => {
      // Arrange
      const validStep2Data = {
        modelo: "Tecnólogo",
        coordenadorId: "1",
      };

      // Act & Assert
      await expect(
        coursesRegisterStep2Schema.validate(validStep2Data)
      ).resolves.toEqual(validStep2Data);
    });

    it("deve rejeitar modelo vazio", async () => {
      // Arrange
      const invalidData = {
        modelo: "",
        coordenadorId: "1",
      };

      // Act & Assert
      await expect(
        coursesRegisterStep2Schema.validate(invalidData)
      ).rejects.toThrow("Modalidade é obrigatória");
    });

    it("deve rejeitar coordenadorId vazio", async () => {
      // Arrange
      const invalidData = {
        modelo: "Tecnólogo",
        coordenadorId: "",
      };

      // Act & Assert
      await expect(
        coursesRegisterStep2Schema.validate(invalidData)
      ).rejects.toThrow("Coordenador é obrigatório");
    });

    it("deve validar diferentes modelos de curso", async () => {
      // Arrange
      const validModelos = ["Tecnólogo", "Bacharelado", "Licenciatura"];

      for (const modelo of validModelos) {
        const validData = {
          modelo,
          coordenadorId: "1",
        };

        // Act & Assert
        await expect(
          coursesRegisterStep2Schema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve aceitar diferentes IDs de coordenador", async () => {
      // Arrange
      const validIds = ["1", "123", "456", "999"];

      for (const coordenadorId of validIds) {
        const validData = {
          modelo: "Tecnólogo",
          coordenadorId,
        };

        // Act & Assert
        await expect(
          coursesRegisterStep2Schema.validate(validData)
        ).resolves.toEqual(validData);
      }
    });

    it("deve rejeitar dados com campos faltando no step 2", async () => {
      // Arrange
      const incompleteData = {
        modelo: "Tecnólogo",
        // faltando coordenadorId
      };

      // Act & Assert
      await expect(
        coursesRegisterStep2Schema.validate(incompleteData)
      ).rejects.toThrow();
    });
  });

  describe("integração entre step 1 e step 2", () => {
    it("deve permitir validação sequencial dos steps", async () => {
      // Arrange
      const step1Data = {
        nome: "Análise e Desenvolvimento de Sistemas",
        sigla: "ADS",
        codigo: "1234",
      };

      const step2Data = {
        modelo: "Tecnólogo",
        coordenadorId: "1",
      };

      // Act & Assert
      await expect(coursesRegisterSchema.validate(step1Data)).resolves.toEqual(
        step1Data
      );
      await expect(
        coursesRegisterStep2Schema.validate(step2Data)
      ).resolves.toEqual(step2Data);
    });

    it("deve manter consistência entre schemas de validação individual", async () => {
      // Arrange
      const sigla = "ADS";
      const codigo = "1234";

      // Act & Assert
      await expect(siglaValidationSchema.validate(sigla)).resolves.toBe(sigla);
      await expect(codigoValidationSchema.validate(codigo)).resolves.toBe(
        codigo
      );
      await expect(
        coursesRegisterSchema.validateAt("sigla", { sigla })
      ).resolves.toBe(sigla);
      await expect(
        coursesRegisterSchema.validateAt("codigo", { codigo })
      ).resolves.toBe(codigo);
    });

    it("deve validar um curso completo com ambos os steps", async () => {
      // Arrange
      const completeCourseData = {
        // Step 1
        nome: "Desenvolvimento de Software Multiplataforma",
        sigla: "DSM",
        codigo: "0002",
        // Step 2
        modelo: "Tecnólogo",
        coordenadorId: "5",
      };

      // Act & Assert - validar cada step separadamente
      await expect(
        coursesRegisterSchema.validate({
          nome: completeCourseData.nome,
          sigla: completeCourseData.sigla,
          codigo: completeCourseData.codigo,
        })
      ).resolves.toBeDefined();

      await expect(
        coursesRegisterStep2Schema.validate({
          modelo: completeCourseData.modelo,
          coordenadorId: completeCourseData.coordenadorId,
        })
      ).resolves.toBeDefined();
    });
  });
});
