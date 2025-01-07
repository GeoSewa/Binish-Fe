import { api } from ".";

export const getExamQuestions = (params?: Record<string, any>) =>
  api.get("mcq/questions/", { params });
