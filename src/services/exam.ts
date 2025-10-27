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

// Batch save multiple answers in parallel with chunking for large datasets
export const saveAnswersBatch = async (attemptId: string, answers: Array<{
  question_id: number;
  selected_choices: number[];
}>, chunkSize: number = 20) => {
  // Split answers into chunks to prevent overwhelming the server
  const chunks: Array<Array<{question_id: number; selected_choices: number[]}>> = [];
  for (let i = 0; i < answers.length; i += chunkSize) {
    chunks.push(answers.slice(i, i + chunkSize));
  }

  const allResults: PromiseSettledResult<any>[] = [];
  
  // Process chunks sequentially but answers within each chunk in parallel
  for (const chunk of chunks) {
    const chunkPromises = chunk.map(answer => 
      saveAnswer(attemptId, answer).catch(err => {
        console.warn(`Failed to save answer for question ${answer.question_id}:`, err);
        return { error: err, question_id: answer.question_id };
      })
    );
    
    const chunkResults = await Promise.allSettled(chunkPromises);
    allResults.push(...chunkResults);
  }
  
  return allResults;
};

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