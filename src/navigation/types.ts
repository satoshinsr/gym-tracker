import { SplitType } from '../types';

export type RootStackParamList = {
  Home: undefined;
  ExerciseList: { split: SplitType };
  ExerciseDetail: { exerciseId: string };
  ActiveWorkout: undefined;
  History: undefined;
  ExerciseProgress: { exerciseId?: string } | undefined;
};
