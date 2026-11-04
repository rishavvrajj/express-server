export type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export type dbUserRow = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export type dbUserWithPasswordRow = dbUserRow & {
  password_hash: string | null;
};

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};