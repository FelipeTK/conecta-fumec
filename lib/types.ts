export type Weekday = "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

export type Modality = "presencial" | "online" | "hibrido";

export type ModalityPreference = Modality | "tanto-faz";

export type MaterialKind = "resumo" | "lista" | "mapa" | "roteiro" | "slides";

export type Authorship = "propria" | "autorizada";

export type Origin = "demo" | "local";

export type Area =
  | "Computação"
  | "Gestão"
  | "Direito"
  | "Saúde"
  | "Engenharia"
  | "Arquitetura";

export type Discipline = {
  id: string;
  code: string;
  name: string;
  course: string;
  area: Area;
  period: string;
  campus: string;
  summary: string;
};

export type Group = {
  id: string;
  origin: Origin;
  disciplineId: string;
  title: string;
  objective: string;
  modality: Modality;
  place: string;
  weekdays: Weekday[];
  time: string;
  nextSession: string;
  capacity: number;
  filled: number;
  organizerName: string;
  organizerCourse: string;
  focus: string[];
  materialIds: string[];
  createdAt: string;
};

export type Interest = {
  id: string;
  origin: Origin;
  disciplineId: string;
  name: string;
  course: string;
  availability: string;
  modality: ModalityPreference;
  note: string;
  createdAt: string;
};

export type Material = {
  id: string;
  origin: Origin;
  disciplineId: string;
  title: string;
  kind: MaterialKind;
  authorship: Authorship;
  authorizedBy?: string;
  summary: string;
  pages?: number;
  authorName: string;
  authorCourse: string;
  createdAt: string;
};

export type GroupRequest = {
  id: string;
  groupId: string;
  name: string;
  course: string;
  note: string;
  createdAt: string;
};

export type InterestReply = {
  id: string;
  interestId: string;
  name: string;
  course: string;
  note: string;
  createdAt: string;
};

export type MaterialRequest = {
  id: string;
  materialId: string;
  name: string;
  course: string;
  note: string;
  createdAt: string;
};

export type EvaluationTasks = {
  findDiscipline: boolean;
  joinGroup: boolean;
  postInterest: boolean;
  indicateMaterial: boolean;
  checkSpace: boolean;
};

export type FoundGroupAnswer = "sim" | "com-dificuldade" | "nao";

export type UsefulAnswer = "grupos" | "interesse" | "materiais" | "nenhum";

export type Evaluation = {
  id: string;
  foundGroup: FoundGroupAnswer;
  mostUseful: UsefulAnswer;
  clear: string;
  confusing: string;
  comment: string;
  tasks: EvaluationTasks;
  createdAt: string;
};

export type LocalState = {
  savedDisciplineIds: string[];
  groups: Group[];
  interests: Interest[];
  materials: Material[];
  groupRequests: GroupRequest[];
  interestReplies: InterestReply[];
  materialRequests: MaterialRequest[];
  evaluations: Evaluation[];
};
