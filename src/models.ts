import { Timestamp } from 'rxjs';

export interface User {
  azureId?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  role?: string;
}

export interface Room {
  id?: string;
  name?: string;
  address?: string;
  description?: string;
  capacity?: number;
  isDeleted?: boolean;
}

export interface SessionParticipant {
  id?: string;
  matNumber: number;
  timeStampSignUp?: string;
  hasCancelled?: boolean;
  user?: User;
}

export interface Session {
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

export interface CreateSessionInput {
  title?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  capacity?: number;
  teacherId?: string;
  roomId?: Room;
}
export interface EditSessionInput {
  id?: string;
  title?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  capacity?: number;
  teacherId?: string;
  roomId?: Room;
}
export interface CreateSessionParticipantInput {
  sessionId?: string;
  userAzureId?: string;
  matNumber?: number;
}
export interface CreateRoomInput {
  name?: string;
  address?: string;
  capacity?: number;
  description?: string;
}
export interface EditRoomInput {
  id?: string;
  name?: string;
  address?: string;
  capacity?: number;
  description?: string;
}
