import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Modal, Portal, TextInput, Button } from "react-native-paper";
import { TipoMonitor, DiaSemana } from "../../../types/monitor";
import { Professor } from "../../../types/professor";

interface MonitorModalsProps {
  showCreateModal: boolean;
  showEditModal: boolean;
  isDarkMode: boolean;
  themeColors: any;
  monitorForm: {
    nome: string;
    email: string;
    tipo: TipoMonitor;
    nomePesquisaMonitoria: string;
    professorId: string;
    cargaHorariaSemanal: string;
  };
  weeklySchedule: { [key in DiaSemana]?: number };
  professors: Professor[];
  onDismissCreate: () => void;
  onDismissEdit: () => void;
  onCreate: () => void;
  onEdit: () => void;
  onFormChange: (field: string, value: any) => void;
  onScheduleChange: (dia: DiaSemana, horas: number) => void;
  getTotalHoras: () => number;
}

const MonitorModals: React.FC<MonitorModalsProps> = ({
  showCreateModal,
  showEditModal,
  isDarkMode,
  themeColors,
  monitorForm,
  weeklySchedule,
  professors,
  onDismissCreate,
  onDismissEdit,
  onCreate,
  onEdit,
  onFormChange,
  onScheduleChange,
  getTotalHoras,
}) => {
  const renderMonitorForm = (isEdit: boolean) => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TextInput
        label="Nome"
        value={monitorForm.nome}
        onChangeText={(text) => onFormChange("nome", text)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={monitorForm.email}
        onChangeText={(text) => onFormChange("email", text)}
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Text
          style={[styles.pickerLabel, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Tipo de Monitor
        </Text>
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={[
              styles.pickerOption,
              {
                backgroundColor:
                  monitorForm.tipo === TipoMonitor.MONITOR
                    ? themeColors.primary
                    : isDarkMode
                    ? "#333"
                    : "#f0f0f0",
              },
            ]}
            onPress={() => onFormChange("tipo", TipoMonitor.MONITOR)}
          >
            <Text
              style={{
                color:
                  monitorForm.tipo === TipoMonitor.MONITOR
                    ? "#fff"
                    : isDarkMode
                    ? "#fff"
                    : "#000",
              }}
            >
              Monitor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pickerOption,
              {
                backgroundColor:
                  monitorForm.tipo === TipoMonitor.PESQUISADOR
                    ? themeColors.primary
                    : isDarkMode
                    ? "#333"
                    : "#f0f0f0",
              },
            ]}
            onPress={() => onFormChange("tipo", TipoMonitor.PESQUISADOR)}
          >
            <Text
              style={{
                color:
                  monitorForm.tipo === TipoMonitor.PESQUISADOR
                    ? "#fff"
                    : isDarkMode
                    ? "#fff"
                    : "#000",
              }}
            >
              Pesquisador
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        label="Nome da Pesquisa/Monitoria"
        value={monitorForm.nomePesquisaMonitoria}
        onChangeText={(text) => onFormChange("nomePesquisaMonitoria", text)}
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Text
          style={[styles.pickerLabel, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Professor
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.professorsScroll}
        >
          {professors.map((professor) => (
            <TouchableOpacity
              key={professor.id}
              style={[
                styles.professorOption,
                {
                  backgroundColor:
                    monitorForm.professorId === professor.id?.toString()
                      ? themeColors.primary
                      : isDarkMode
                      ? "#333"
                      : "#f0f0f0",
                },
              ]}
              onPress={() =>
                onFormChange("professorId", professor.id?.toString() || "")
              }
            >
              <Text
                style={{
                  color:
                    monitorForm.professorId === professor.id?.toString()
                      ? "#fff"
                      : isDarkMode
                      ? "#fff"
                      : "#000",
                  fontSize: 12,
                }}
                numberOfLines={2}
              >
                {professor.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput
        label="Carga Horária Semanal"
        value={monitorForm.cargaHorariaSemanal}
        onChangeText={(text) => onFormChange("cargaHorariaSemanal", text)}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Distribuição de Horários por Dia da Semana */}
      <View style={styles.scheduleContainer}>
        <Text
          style={[
            styles.scheduleTitle,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Distribuição Semanal ({getTotalHoras()}h de{" "}
          {monitorForm.cargaHorariaSemanal || 0}h)
        </Text>

        {Object.values(DiaSemana).map((dia) => (
          <View key={dia} style={styles.dayContainer}>
            <Text
              style={[styles.dayLabel, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              {dia.charAt(0) + dia.slice(1).toLowerCase()}:
            </Text>
            <View style={styles.hourControls}>
              <TouchableOpacity
                style={[
                  styles.hourButton,
                  { backgroundColor: isDarkMode ? "#444" : "#f0f0f0" },
                ]}
                onPress={() => {
                  const current = weeklySchedule[dia] || 0;
                  if (current > 0) {
                    onScheduleChange(dia, current - 1);
                  }
                }}
              >
                <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>-</Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.hourValue,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {weeklySchedule[dia] || 0}h
              </Text>

              <TouchableOpacity
                style={[
                  styles.hourButton,
                  { backgroundColor: isDarkMode ? "#444" : "#f0f0f0" },
                ]}
                onPress={() => {
                  const current = weeklySchedule[dia] || 0;
                  const total = getTotalHoras();
                  const maxTotal = parseInt(
                    monitorForm.cargaHorariaSemanal || "0"
                  );
                  if (total < maxTotal) {
                    onScheduleChange(dia, current + 1);
                  }
                }}
              >
                <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {getTotalHoras() !==
          parseInt(monitorForm.cargaHorariaSemanal || "0") && (
          <Text style={styles.scheduleWarning}>
            ⚠️ Total distribuído ({getTotalHoras()}h) diferente da carga horária
            ({monitorForm.cargaHorariaSemanal}h)
          </Text>
        )}
      </View>
    </ScrollView>
  );

  return (
    <>
      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={onDismissCreate}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Text
            style={[styles.modalTitle, { color: isDarkMode ? "#fff" : "#000" }]}
          >
            Criar Monitor
          </Text>

          {renderMonitorForm(false)}

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={onDismissCreate}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={onCreate}>
              Criar
            </Button>
          </View>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={onDismissEdit}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Text
            style={[styles.modalTitle, { color: isDarkMode ? "#fff" : "#000" }]}
          >
            Editar Monitor
          </Text>

          {renderMonitorForm(true)}

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={onDismissEdit}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={onEdit}>
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  pickerRow: {
    flexDirection: "row",
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  professorsScroll: {
    maxHeight: 60,
  },
  professorOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  hourControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  hourButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  hourValue: {
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  scheduleWarning: {
    color: "#ff6b35",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default MonitorModals;
