export type Guide = {
  id: string;
  name: string;
  photo?: string;
  active?: boolean;
};

export const defaultGuides: Guide[] = [
  { id: "guide-mher", name: "Мгер" },
  { id: "guide-armine", name: "Армине" },
  { id: "guide-grigor", name: "Григор" },
  { id: "guide-andranik", name: "Андраник" },
  { id: "guide-arsen", name: "Арсен" },
  { id: "guide-vladimir", name: "Владимир" },
  { id: "guide-anahit", name: "Анаит" },
  { id: "guide-marina", name: "Марина" },
  { id: "guide-manuel", name: "Мануэль" },
  { id: "guide-mikael", name: "Микаэль" },
  { id: "guide-artur", name: "Артур" },
];
