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
  api.post(`exams/attempt/${attemptId}/save-answer/`, {
    answers: [data]  // Wrap in BatchSaveAnswer format
  });

// Batch save multiple answers with chunking for large datasets
export const saveAnswersBatch = async (attemptId: string, answers: Array<{
  question_id: number;
  selected_choices: number[];
}>, chunkSize: number = 50) => {
  // Split answers into chunks to prevent overwhelming the server
  const chunks: Array<Array<{question_id: number; selected_choices: number[]}>> = [];
  for (let i = 0; i < answers.length; i += chunkSize) {
    chunks.push(answers.slice(i, i + chunkSize));
  }

  const allResults: PromiseSettledResult<any>[] = [];
  
  // Process chunks sequentially, sending each chunk as a batch request
  for (const chunk of chunks) {
    console.log(`Sending batch of ${chunk.length} answers:`, JSON.stringify({ answers: chunk }, null, 2));
    
    try {
      const result = await api.post(`exams/attempt/${attemptId}/save-answer/`, {
        answers: chunk  // Send the entire chunk in BatchSaveAnswer format
      });
      
      console.log(`Successfully saved batch of ${chunk.length} answers`, result.data);
      
      allResults.push({
        status: 'fulfilled',
        value: result.data
      } as PromiseFulfilledResult<any>);
    } catch (err: any) {
      console.error(`Failed to save batch of ${chunk.length} answers:`, err.response?.data || err.message);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      allResults.push({
        status: 'rejected',
        reason: err
      } as PromiseRejectedResult);
    }
  }
  
  return allResults;
};

// Alternative: Save answers one by one sequentially (fallback if batch fails)
export const saveAnswersSequentially = async (attemptId: string, answers: Array<{
  question_id: number;
  selected_choices: number[];
}>) => {
  const allResults: PromiseSettledResult<any>[] = [];
  
  for (const answer of answers) {
    console.log(`Saving answer for question ${answer.question_id}:`, answer);
    
    try {
      const result = await api.post(`exams/attempt/${attemptId}/save-answer/`, {
        answers: [answer]  // Send one answer at a time in BatchSaveAnswer format
      });
      
      console.log(`Successfully saved answer for question ${answer.question_id}`, result.data);
      
      allResults.push({
        status: 'fulfilled',
        value: result.data
      } as PromiseFulfilledResult<any>);
    } catch (err: any) {
      console.error(`Failed to save answer for question ${answer.question_id}:`, err.response?.data || err.message);
      
      allResults.push({
        status: 'rejected',
        reason: err
      } as PromiseRejectedResult);
    }
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