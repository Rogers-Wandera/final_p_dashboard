export type evaluationtype = {
  id: number;
  modelName: string;
  userName: string;
  creationDate: string;
  type: "Audio" | "Image";
  status: "Current" | "Old";
  trainLoss: string;
  trainAccuracy: string;
  testLoss: string;
  testAccuracy: string;
  trainerId: string;
  isActive: number;
};
