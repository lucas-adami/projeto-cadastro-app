import * as Yup from "yup";
import {
  userLoginSchema,
  userRegisterSchema,
  userEmailSchema,
  userPasswordSchema,
} from "../usersValidations";

describe("UsersValidations", () => {
  describe("userLoginSchema", () => {
    it("deve validar dados de login corretos", async () => {
      // Arrange
      const validLoginData = {
        email: "test@example.com",
        senha: "password123",
      };

      // Act & Assert
      await expect(userLoginSchema.validate(validLoginData)).resolves.toEqual(
        validLoginData
      );
    });

    it("deve rejeitar email vazio", async () => {
      // Arrange
      const invalidData = {
        email: "",
        senha: "password123",
      };

      // Act & Assert
      await expect(userLoginSchema.validate(invalidData)).rejects.toThrow(
        "E-mail é obrigatório"
      );
    });

    it("deve rejeitar email inválido", async () => {
      // Arrange
      const invalidData = {
        email: "email-invalido",
        senha: "password123",
      };

      // Act & Assert
      await expect(userLoginSchema.validate(invalidData)).rejects.toThrow(
        "E-mail inválido"
      );
    });

    it("deve rejeitar senha vazia", async () => {
      // Arrange
      const invalidData = {
        email: "test@example.com",
        senha: "",
      };

      // Act & Assert
      await expect(userLoginSchema.validate(invalidData)).rejects.toThrow(
        "Senha é obrigatória"
      );
    });

    it("deve rejeitar senha muito curta", async () => {
      // Arrange
      const invalidData = {
        email: "test@example.com",
        senha: "123",
      };

      // Act & Assert
      await expect(userLoginSchema.validate(invalidData)).rejects.toThrow(
        "Senha deve ter pelo menos 6 caracteres"
      );
    });

    it("deve aceitar senha com exatamente 6 caracteres", async () => {
      // Arrange
      const validData = {
        email: "test@example.com",
        senha: "123456",
      };

      // Act & Assert
      await expect(userLoginSchema.validate(validData)).resolves.toEqual(
        validData
      );
    });

    it("deve rejeitar objeto sem campos obrigatórios", async () => {
      // Arrange
      const invalidData = {};

      // Act & Assert
      await expect(userLoginSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe("userRegisterSchema", () => {
    it("deve validar dados de registro corretos", async () => {
      // Arrange
      const validRegisterData = {
        nome: "João Silva",
        email: "joao@example.com",
        senha: "password123",
      };

      // Act & Assert
      await expect(
        userRegisterSchema.validate(validRegisterData)
      ).resolves.toEqual(validRegisterData);
    });

    it("deve rejeitar nome vazio", async () => {
      // Arrange
      const invalidData = {
        nome: "",
        email: "joao@example.com",
        senha: "password123",
      };

      // Act & Assert
      await expect(userRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Nome é obrigatório"
      );
    });

    it("deve rejeitar nome muito curto", async () => {
      // Arrange
      const invalidData = {
        nome: "Jo",
        email: "joao@example.com",
        senha: "password123",
      };

      // Act & Assert
      await expect(userRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Nome deve ter pelo menos 3 caracteres"
      );
    });

    it("deve aceitar nome com exatamente 3 caracteres", async () => {
      // Arrange
      const validData = {
        nome: "Jon",
        email: "jon@example.com",
        senha: "password123",
      };

      // Act & Assert
      await expect(userRegisterSchema.validate(validData)).resolves.toEqual(
        validData
      );
    });

    it("deve rejeitar email inválido no registro", async () => {
      // Arrange
      const invalidData = {
        nome: "João Silva",
        email: "email-sem-arroba",
        senha: "password123",
      };

      // Act & Assert
      await expect(userRegisterSchema.validate(invalidData)).rejects.toThrow(
        "E-mail inválido"
      );
    });

    it("deve exigir senha com pelo menos 8 caracteres no registro", async () => {
      // Arrange
      const invalidData = {
        nome: "João Silva",
        email: "joao@example.com",
        senha: "1234567",
      };

      // Act & Assert
      await expect(userRegisterSchema.validate(invalidData)).rejects.toThrow(
        "Senha deve ter pelo menos 8 caracteres"
      );
    });

    it("deve aceitar senha com exatamente 8 caracteres", async () => {
      // Arrange
      const validData = {
        nome: "João Silva",
        email: "joao@example.com",
        senha: "12345678",
      };

      // Act & Assert
      await expect(userRegisterSchema.validate(validData)).resolves.toEqual(
        validData
      );
    });

    it("deve validar todos os campos obrigatórios", async () => {
      // Arrange
      const completeData = {
        nome: "Maria Santos",
        email: "maria@example.com",
        senha: "senhasegura123",
      };

      // Act & Assert
      await expect(userRegisterSchema.validate(completeData)).resolves.toEqual(
        completeData
      );
    });
  });

  describe("userEmailSchema", () => {
    it("deve validar email correto", async () => {
      // Arrange
      const validEmailData = {
        email: "test@example.com",
      };

      // Act & Assert
      await expect(userEmailSchema.validate(validEmailData)).resolves.toEqual(
        validEmailData
      );
    });

    it("deve rejeitar email vazio", async () => {
      // Arrange
      const invalidData = {
        email: "",
      };

      // Act & Assert
      await expect(userEmailSchema.validate(invalidData)).rejects.toThrow(
        "E-mail é obrigatório"
      );
    });

    it("deve rejeitar email inválido", async () => {
      // Arrange
      const invalidData = {
        email: "email.inválido",
      };

      // Act & Assert
      await expect(userEmailSchema.validate(invalidData)).rejects.toThrow(
        "E-mail inválido"
      );
    });

    it("deve aceitar diferentes formatos de email válidos", async () => {
      // Arrange
      const validEmails = [
        "user@domain.com",
        "user.name@domain.co.uk",
        "user+tag@domain.org",
        "user123@domain123.net",
      ];

      // Act & Assert
      for (const email of validEmails) {
        await expect(userEmailSchema.validate({ email })).resolves.toEqual({
          email,
        });
      }
    });

    it("deve rejeitar formatos de email inválidos", async () => {
      // Arrange
      const invalidEmails = ["email-sem-arroba", "@domain.com", "email@"];

      // Act & Assert
      for (const email of invalidEmails) {
        await expect(userEmailSchema.validate({ email })).rejects.toThrow();
      }
    });
  });

  describe("userPasswordSchema", () => {
    it("deve validar senha correta", async () => {
      // Arrange
      const validPasswordData = {
        senha: "password123",
      };

      // Act & Assert
      await expect(
        userPasswordSchema.validate(validPasswordData)
      ).resolves.toEqual(validPasswordData);
    });

    it("deve rejeitar senha vazia", async () => {
      // Arrange
      const invalidData = {
        senha: "",
      };

      // Act & Assert
      await expect(userPasswordSchema.validate(invalidData)).rejects.toThrow(
        "Senha é obrigatória"
      );
    });

    it("deve exigir pelo menos 8 caracteres", async () => {
      // Arrange
      const invalidData = {
        senha: "1234567",
      };

      // Act & Assert
      await expect(userPasswordSchema.validate(invalidData)).rejects.toThrow(
        "Senha deve ter pelo menos 8 caracteres"
      );
    });

    it("deve aceitar senha com exatamente 8 caracteres", async () => {
      // Arrange
      const validData = {
        senha: "12345678",
      };

      // Act & Assert
      await expect(userPasswordSchema.validate(validData)).resolves.toEqual(
        validData
      );
    });

    it("deve aceitar senhas longas", async () => {
      // Arrange
      const validData = {
        senha: "senhamuitolongacomnumerosecaracteresespeciais123!@#",
      };

      // Act & Assert
      await expect(userPasswordSchema.validate(validData)).resolves.toEqual(
        validData
      );
    });

    it("deve aceitar diferentes tipos de caracteres", async () => {
      // Arrange
      const validPasswords = [
        "senha123",
        "Senha123",
        "SENHA123",
        "senha@123",
        "senha#$%123",
        "minha_senha_123",
      ];

      // Act & Assert
      for (const senha of validPasswords) {
        await expect(userPasswordSchema.validate({ senha })).resolves.toEqual({
          senha,
        });
      }
    });
  });

  describe("integração de schemas", () => {
    it("deve usar userEmailSchema para validação de recuperação de senha", async () => {
      // Arrange
      const emailData = { email: "recovery@example.com" };

      // Act & Assert
      await expect(userEmailSchema.validate(emailData)).resolves.toEqual(
        emailData
      );
    });

    it("deve usar userPasswordSchema para redefinição de senha", async () => {
      // Arrange
      const passwordData = { senha: "novasenha123" };

      // Act & Assert
      await expect(userPasswordSchema.validate(passwordData)).resolves.toEqual(
        passwordData
      );
    });

    it("deve manter consistência entre login e register para email", async () => {
      // Arrange
      const email = "consistent@example.com";

      // Act & Assert
      await expect(
        userLoginSchema.validateAt("email", { email })
      ).resolves.toBe(email);
      await expect(
        userRegisterSchema.validateAt("email", { email })
      ).resolves.toBe(email);
      await expect(
        userEmailSchema.validateAt("email", { email })
      ).resolves.toBe(email);
    });
  });
});
