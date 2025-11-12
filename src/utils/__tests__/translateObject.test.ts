import { professorLabels, courseLabels } from "../translateObject";

describe("TranslateObject", () => {
  describe("professorLabels", () => {
    it("deve conter todas as traduções necessárias para professor", () => {
      // Arrange & Act & Assert
      expect(professorLabels).toHaveProperty("nome", "Nome");
      expect(professorLabels).toHaveProperty("email", "E-mail");
      expect(professorLabels).toHaveProperty("titulacao", "Titulação");
      expect(professorLabels).toHaveProperty("idUnidade", "Unidade");
      expect(professorLabels).toHaveProperty("referencia", "Referência");
      expect(professorLabels).toHaveProperty("lattes", "Lattes");
      expect(professorLabels).toHaveProperty("statusAtividade", "Status");
      expect(professorLabels).toHaveProperty("observacoes", "Observações");
      expect(professorLabels).toHaveProperty("materias", "Matérias");
      expect(professorLabels).toHaveProperty(
        "cursoCoordenado",
        "Curso Coordenado"
      );
    });

    it("deve ter todas as traduções como strings não vazias", () => {
      // Arrange & Act
      const labels = Object.values(professorLabels);

      // Assert
      labels.forEach((label) => {
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
        expect(label.trim()).toBe(label); // Não deve ter espaços desnecessários
      });
    });

    it("deve mapear chaves específicas corretamente", () => {
      // Assert
      expect(professorLabels.nome).toBe("Nome");
      expect(professorLabels.email).toBe("E-mail");
      expect(professorLabels.titulacao).toBe("Titulação");
      expect(professorLabels.idUnidade).toBe("Unidade");
      expect(professorLabels.referencia).toBe("Referência");
      expect(professorLabels.lattes).toBe("Lattes");
      expect(professorLabels.statusAtividade).toBe("Status");
      expect(professorLabels.observacoes).toBe("Observações");
      expect(professorLabels.materias).toBe("Matérias");
      expect(professorLabels.cursoCoordenado).toBe("Curso Coordenado");
    });

    it("deve ter exatamente 10 propriedades", () => {
      // Arrange & Act
      const keys = Object.keys(professorLabels);

      // Assert
      expect(keys).toHaveLength(10);
    });

    it("deve ter chaves que correspondem aos campos de Professor", () => {
      // Arrange
      const expectedKeys = [
        "nome",
        "email",
        "titulacao",
        "idUnidade",
        "referencia",
        "lattes",
        "statusAtividade",
        "observacoes",
        "materias",
        "cursoCoordenado",
      ];

      // Act
      const actualKeys = Object.keys(professorLabels);

      // Assert
      expectedKeys.forEach((key) => {
        expect(actualKeys).toContain(key);
      });
    });

    it("deve permitir acesso dinâmico às traduções", () => {
      // Arrange
      const fields = ["nome", "email", "titulacao"];

      // Act & Assert
      fields.forEach((field) => {
        const translation = professorLabels[field];
        expect(translation).toBeDefined();
        expect(typeof translation).toBe("string");
      });
    });
  });

  describe("courseLabels", () => {
    it("deve conter todas as traduções necessárias para curso", () => {
      // Arrange & Act & Assert
      expect(courseLabels).toHaveProperty("nome", "Nome");
      expect(courseLabels).toHaveProperty("codigo", "Código");
      expect(courseLabels).toHaveProperty("sigla", "Sigla");
      expect(courseLabels).toHaveProperty("modelo", "Modelo");
      expect(courseLabels).toHaveProperty(
        "coordenador",
        "Coordenador Responsável"
      );
      expect(courseLabels).toHaveProperty("materias", "Matérias");
    });

    it("deve ter todas as traduções como strings não vazias", () => {
      // Arrange & Act
      const labels = Object.values(courseLabels);

      // Assert
      labels.forEach((label) => {
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
        expect(label.trim()).toBe(label); // Não deve ter espaços desnecessários
      });
    });

    it("deve mapear chaves específicas corretamente", () => {
      // Assert
      expect(courseLabels.nome).toBe("Nome");
      expect(courseLabels.codigo).toBe("Código");
      expect(courseLabels.sigla).toBe("Sigla");
      expect(courseLabels.modelo).toBe("Modelo");
      expect(courseLabels.coordenador).toBe("Coordenador Responsável");
      expect(courseLabels.materias).toBe("Matérias");
    });

    it("deve ter exatamente 6 propriedades", () => {
      // Arrange & Act
      const keys = Object.keys(courseLabels);

      // Assert
      expect(keys).toHaveLength(6);
    });

    it("deve ter chaves que correspondem aos campos de Course", () => {
      // Arrange
      const expectedKeys = [
        "nome",
        "codigo",
        "sigla",
        "modelo",
        "coordenador",
        "materias",
      ];

      // Act
      const actualKeys = Object.keys(courseLabels);

      // Assert
      expectedKeys.forEach((key) => {
        expect(actualKeys).toContain(key);
      });
    });

    it("deve permitir acesso dinâmico às traduções", () => {
      // Arrange
      const fields = ["nome", "codigo", "sigla"];

      // Act & Assert
      fields.forEach((field) => {
        const translation = courseLabels[field];
        expect(translation).toBeDefined();
        expect(typeof translation).toBe("string");
      });
    });

    it("deve ter traduções específicas com acentos corretos", () => {
      // Assert
      expect(courseLabels.codigo).toBe("Código");
      expect(courseLabels.materias).toBe("Matérias");
      expect(courseLabels.coordenador).toBe("Coordenador Responsável");
    });
  });

  describe("integração entre professorLabels e courseLabels", () => {
    it("deve ter campos comuns com mesma tradução", () => {
      // Arrange
      const commonFields = ["nome", "materias"];

      // Act & Assert
      commonFields.forEach((field) => {
        expect(professorLabels[field]).toBe(courseLabels[field]);
      });
    });

    it("deve ter todos os labels como objetos independentes", () => {
      // Arrange & Act
      const originalProfessorLabel = professorLabels.nome;
      const originalCourseLabel = courseLabels.nome;

      // Modificar um não deve afetar o outro (teste conceitual)
      // Assert
      expect(originalProfessorLabel).toBe("Nome");
      expect(originalCourseLabel).toBe("Nome");
      expect(professorLabels).not.toBe(courseLabels); // Objetos diferentes
    });

    it("deve permitir uso combinado em interfaces", () => {
      // Arrange
      const allLabels = { ...professorLabels, ...courseLabels };

      // Act & Assert
      expect(allLabels.nome).toBe("Nome"); // Campo comum
      expect(allLabels.email).toBe("E-mail"); // Campo do professor
      expect(allLabels.codigo).toBe("Código"); // Campo do curso
      expect(allLabels.titulacao).toBe("Titulação"); // Campo do professor
      expect(allLabels.sigla).toBe("Sigla"); // Campo do curso
    });

    it("deve manter consistência de nomenclatura", () => {
      // Arrange & Act
      const allProfessorValues = Object.values(professorLabels);
      const allCourseValues = Object.values(courseLabels);

      // Assert
      [...allProfessorValues, ...allCourseValues].forEach((label) => {
        // Verificar que são strings válidas
        expect(typeof label).toBe("string");
        // Verificar que começam com letra maiúscula (padrão brasileiro)
        expect(label.charAt(0)).toMatch(/[A-ZÁÊÔÇÃ]/);
      });
    });
  });
});
