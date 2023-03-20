import { Timestamp } from "rxjs";

export interface User{
  id?: string;
  azureId?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  birthDate?: Date;
  isAdmin?: boolean;
}

export interface Room{
  id?: string;
  name?: string;
  address?: string;
  capacity?: number;
}

export interface SessionParticipant{
  id?: string;
  matNumber: number;
  timeStampSignUp?: string;
  hasCancelled?: boolean;
  user?: User;
}

export interface Session{
  id?: string;
  title?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  capacity?: number;
  teacher?: User;
  timeStampAdded?: string;
  isCancelled?: boolean;
  isFull?: boolean;
  room?: Room;
  participants?: SessionParticipant[];
}

export interface CreateSessionInput{
  title?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  capacity?: number;
  teacherId?: string;
  roomId?: Room;
}
