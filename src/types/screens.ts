type Screens = {
  Login: React.ComponentType<any>;
  Register: React.ComponentType<any>;
  Loading: React.ComponentType<any>;
  Home: React.ComponentType<any>;
  //Professors
  ListProfessors: React.ComponentType<any>;
  RegisterProfessorsIndex: React.ComponentType<any>;
  RegisterProfessorsStepOne: React.ComponentType<any>;
  RegisterProfessorsStepTwo: React.ComponentType<any>;
  RegisterProfessorsFinished: React.Component<any>
  EditProfessors: React.ComponentType<any>;
  //#
  ListCourses: React.ComponentType<any>;
  RegisterCourses: React.ComponentType<any>;
  EditCourses: React.ComponentType<any>;
};

export type { Screens };
