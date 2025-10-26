import { api } from ".";

export const getExamQuestions = (params?: Record<string, any>) =>
  api.get("mcq/questions/", { params });

// Exam Sets APIs
export const getExamSets = () => 
  api.get("exams/sets/");

export const getExamSet = (id: number) => 
  api.get(`exams/sets/${id}/`);

export const startExamAttempt = (examSetId: number) => 
  api.post(`exams/sets/${examSetId}/start/`);

// Exam Attempt APIs
export const getExamAttempt = (attemptId: string) => 
  api.get(`exams/attempt/${attemptId}/`);

export const saveAnswer = (attemptId: string, data: {
  question_id: number;
  selected_choices: number[];
}) => 
  api.post(`exams/attempt/${attemptId}/save-answer/`, data);

export const submitExamAttempt = (attemptId: string) => 
  api.post(`exams/attempt/${attemptId}/submit/`);

// Exam Results APIs
export const getExamResults = () => 
  api.get("exams/exam-results/");

export const getExamResult = (attemptId: string) => 
  api.get(`exams/exam-results/${attemptId}/`);

// Get all users' exam results (for superusers)
export const getExamResultsForAllUsers = (dateFilter?: string) => {
  const params: Record<string, any> = {};
  if (dateFilter) {
    params.date = dateFilter;
  }
  return api.get("exams/exam-result/allusers/", { params });
};

// Get current user's exam results
export const getExamResultsForUser = () => 
  api.get("exams/exam-results/");

// Notes APIs
export const getNotes = () => api.get("exams/notes/");