interface SpendingRecord {
  id: string;
  'user-token': string;
  type: string;
  date: string;
  necessity: string;
  amount: number;
  category: string;
  description: string;
}

interface Group {
  id: string;
  users: {
    name: string;
    email: string;
    image: string;
  }[];
  name: string;
}

interface User {
  name: string;
  email: string;
  image: string;
  groups: string[];
  defaultGroup?: string;
}

interface ModalRef {
  open: () => void;
  close: () => void;
}
