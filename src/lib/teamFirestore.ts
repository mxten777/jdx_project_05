import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface TeamInfo {
  id: string;
  name: string;
  members: string[];
}

const TEAM_COLLECTION = 'teams';

export const addTeam = async (team: Omit<TeamInfo, 'id'>): Promise<string> => {
  const teamRef = doc(collection(db, TEAM_COLLECTION));
  const newTeam: TeamInfo = {
    ...team,
    id: teamRef.id,
  };
  await setDoc(teamRef, newTeam);
  return teamRef.id;
};

export const getTeams = async (): Promise<TeamInfo[]> => {
  const querySnapshot = await getDocs(collection(db, TEAM_COLLECTION));
  return querySnapshot.docs.map(doc => doc.data() as TeamInfo);
};

export const updateTeam = async (team: TeamInfo): Promise<void> => {
  await setDoc(doc(db, TEAM_COLLECTION, team.id), team);
};

export const deleteTeam = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, TEAM_COLLECTION, id));
};

export const getTeam = async (id: string): Promise<TeamInfo | null> => {
  const teamDoc = await getDoc(doc(db, TEAM_COLLECTION, id));
  return teamDoc.exists() ? (teamDoc.data() as TeamInfo) : null;
};
