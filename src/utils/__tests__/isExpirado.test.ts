import { isExpirado } from "../isExpirado";

describe("isExpirado", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockRestore();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar false para timestamp não expirado", () => {
    // Arrange
    const currentTime = 1641000000000; // timestamp em milliseconds
    const pastTime = currentTime - 30 * 60 * 1000; // 30 minutos atrás
    const validadeMinutos = 60; // válido por 60 minutos

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(pastTime, validadeMinutos);

    // Assert
    expect(result).toBe(false);
  });

  it("deve retornar true para timestamp expirado", () => {
    // Arrange
    const currentTime = 1641000000000; // timestamp em milliseconds
    const pastTime = currentTime - 90 * 60 * 1000; // 90 minutos atrás
    const validadeMinutos = 60; // válido por 60 minutos

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(pastTime, validadeMinutos);

    // Assert
    expect(result).toBe(true);
  });

  it("deve retornar false quando tempo é exatamente igual ao limite", () => {
    // Arrange
    const currentTime = 1641000000000;
    const pastTime = currentTime - 60 * 60 * 1000; // exatamente 60 minutos atrás
    const validadeMinutos = 60;

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(pastTime, validadeMinutos);

    // Assert
    expect(result).toBe(false); // 60 minutos exatos ainda não está expirado
  });

  it("deve retornar true quando excede por pouco o tempo limite", () => {
    // Arrange
    const currentTime = 1641000000000;
    const pastTime = currentTime - 60 * 60 * 1000 - 1000; // 60 minutos e 1 segundo atrás
    const validadeMinutos = 60;

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(pastTime, validadeMinutos);

    // Assert
    expect(result).toBe(true);
  });

  it("deve calcular corretamente a diferença em minutos", () => {
    // Arrange
    const scenarios = [
      { minutosAtras: 10, validade: 15, expectedExpirado: false },
      { minutosAtras: 20, validade: 15, expectedExpirado: true },
      { minutosAtras: 15, validade: 15, expectedExpirado: false },
      { minutosAtras: 0, validade: 5, expectedExpirado: false },
      { minutosAtras: 30, validade: 30, expectedExpirado: false },
      { minutosAtras: 31, validade: 30, expectedExpirado: true },
    ];

    scenarios.forEach(({ minutosAtras, validade, expectedExpirado }) => {
      const currentTime = 1641000000000;
      const pastTime = currentTime - minutosAtras * 60 * 1000;

      jest.spyOn(Date, "now").mockReturnValue(currentTime);

      // Act
      const result = isExpirado(pastTime, validade);

      // Assert
      expect(result).toBe(expectedExpirado);
    });
  });

  it("deve lidar com valores decimais de tempo", () => {
    // Arrange
    const currentTime = 1641000000000;
    const pastTime = currentTime - 15.5 * 60 * 1000; // 15.5 minutos atrás
    const validadeMinutos = 15;

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(pastTime, validadeMinutos);

    // Assert
    expect(result).toBe(true); // 15.5 > 15
  });

  it("deve lidar com timestamps no futuro", () => {
    // Arrange
    const currentTime = 1641000000000;
    const futureTime = currentTime + 30 * 60 * 1000; // 30 minutos no futuro
    const validadeMinutos = 60;

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(futureTime, validadeMinutos);

    // Assert
    expect(result).toBe(false); // timestamp futuro não está expirado
  });

  it("deve calcular diferença corretamente para diferentes valores de validade", () => {
    // Arrange
    const currentTime = 1641000000000;
    const pastTime = currentTime - 45 * 60 * 1000; // 45 minutos atrás

    const testCases = [
      { validade: 30, expected: true }, // 45 > 30
      { validade: 45, expected: false }, // 45 = 45
      { validade: 60, expected: false }, // 45 < 60
      { validade: 44, expected: true }, // 45 > 44
      { validade: 46, expected: false }, // 45 < 46
    ];

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    testCases.forEach(({ validade, expected }) => {
      // Act
      const result = isExpirado(pastTime, validade);

      // Assert
      expect(result).toBe(expected);
    });
  });

  it("deve trabalhar com timestamps zero", () => {
    // Arrange
    const currentTime = 1641000000000;
    const zeroTimestamp = 0;
    const validadeMinutos = 60;

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(zeroTimestamp, validadeMinutos);

    // Assert
    expect(result).toBe(true); // timestamp zero definitivamente está expirado
  });

  it("deve manter precisão com grandes diferenças de tempo", () => {
    // Arrange
    const currentTime = 1641000000000; // Janeiro 2022
    const veryOldTime = 1609459200000; // Janeiro 2021 (um ano atrás)
    const validadeMinutos = 60;

    jest.spyOn(Date, "now").mockReturnValue(currentTime);

    // Act
    const result = isExpirado(veryOldTime, validadeMinutos);

    // Assert
    expect(result).toBe(true); // um ano definitivamente está expirado
  });

  it("deve usar Date.now() internamente", () => {
    // Arrange
    const mockDateNow = jest.spyOn(Date, "now");
    const currentTime = 1641000000000;
    mockDateNow.mockReturnValue(currentTime);

    const pastTime = currentTime - 30 * 60 * 1000;
    const validadeMinutos = 60;

    // Act
    isExpirado(pastTime, validadeMinutos);

    // Assert
    expect(mockDateNow).toHaveBeenCalled();
  });
});
