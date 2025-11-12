import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseProvider } from "../context/CourseContext";
import { ProfessorProvider } from "../context/ProfessorContext";
import { SuggestionSwitchProvider } from "../context/SuggestionSwitchContext";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const commonScreens = {
  Home: require("../screens/home").default,
  SupportPage: require("../screens/support").default,
  Settings: require("../screens/settings").default,
};

const adminScreens = {
  ListProfessors: require("../screens/professors/list").default,
  EditProfessors: require("../screens/professors/edit").default,
  RegisterProfessorsIndex: require("../screens/professors/register").default,
  RegisterProfessorsStepOne: require("../screens/professors/register/stepOne")
    .default,
  RegisterProfessorsStepTwo: require("../screens/professors/register/stepTwo")
    .default,
  RegisterProfessorsFinished: require("../screens/professors/register/finished")
    .default,
  ImportProfessors: require("../screens/professors/register/import").default,
  DetailsProfessors: require("../screens/professors/details").default,
  RegisterCursosIndex: require("../screens/courses/register").default,
  RegisterCursosStepOne: require("../screens/courses/register/stepOne").default,
  RegisterCourseStepTwo: require("../screens/courses/register/stepTwo").default,
  RegisterCursosFinished: require("../screens/courses/register/finished")
    .default,
  EditCourses: require("../screens/courses/edit").default,
  ListCourses: require("../screens/courses/list").default,
  AdminMonitorsList: require("../screens/monitors/admin-list").default,
  MonitorDetails: require("../screens/monitors/admin-details").default,
};

const superAdminScreens = {
  SuperAdmin: require("../screens/superAdmin").default,
};

const monitorScreens = {
  MonitorsIndex: require("../screens/monitors").default,
  Settings: require("../screens/settings").default,
};

export function ProtectedRoutes() {
  const { userRole, isAuthenticated, user } = useAuth();

  // Usar o role do user como fallback se userRole não estiver definido
  const effectiveUserRole = userRole || user?.role;

  // Se está autenticado mas ainda não tem nenhum role, aguarda carregar
  if (isAuthenticated && !effectiveUserRole) {
    return null; // loading spinner
  }

  const getScreens = () => {
    let screens = {};

    if (effectiveUserRole === "SUPER_ADMIN") {
      // Super admin tem acesso a tudo
      screens = { ...commonScreens, ...superAdminScreens, ...adminScreens };
    } else if (effectiveUserRole === "ADMIN") {
      // Admin normal tem acesso às funcionalidades de admin + telas comuns
      screens = { ...commonScreens, ...adminScreens };
    } else if (effectiveUserRole === "MONITOR") {
      // Monitor só tem acesso às funcionalidades de monitor (SEM telas comuns)
      screens = { ...monitorScreens };
    } else {
      // Usuários sem role específico só têm acesso às telas comuns
      screens = { ...commonScreens };
    }

    return screens;
  };

  const getInitialRoute = () => {
    if (effectiveUserRole === "MONITOR") {
      return "MonitorsIndex";
    }
    return "Home";
  };

  const screens = getScreens();
  const initialRoute = getInitialRoute();

  return (
    <CourseProvider>
      <ProfessorProvider>
        <SuggestionSwitchProvider>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
          >
            {Object.keys(screens).map((screenName) => (
              <Stack.Screen
                key={screenName}
                name={screenName}
                component={screens[screenName as keyof typeof screens]}
              />
            ))}
          </Stack.Navigator>
        </SuggestionSwitchProvider>
      </ProfessorProvider>
    </CourseProvider>
  );
}
