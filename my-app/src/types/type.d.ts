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
  users: MemberType[];
  name: string;
}

type MemberType = {
  name: string;
  email: string;
  image: string;
};

interface User {
  name: string;
  email: string;
  image: string;
  groups: string[];
}

interface ModalRef {
  open: () => void;
  close: () => void;
}
