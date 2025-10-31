import { useState, useRef, useEffect } from "react";
import { Button } from "@Components/RadixComponents/Button";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";
import { getExamAttempt, saveAnswer, saveAnswersBatch, saveAnswersSequentially, submitExamAttempt, getExamResult } from "@Services/exam";
import ExamImage from "@Components/common/ExamImage";

interface Question {
  id: number;
  question_text: string;
  image?: string;
  choices: Choice[];
  points?: number;
  question_type?: string;
  order?: number;
}

interface Choice {
  id: number;
  choice_text: string;
  image?: string; // Added for frontend image support
  correct?: boolean;
}

interface DetailedResult {
  question_id: number;
  question_text: string;
  selected_choices: Choice[];
  correct_choices: Choice[];
  is_correct: boolean;
  explanation: string;
}

interface ExamResult {
  id: string;
  exam_set: number;
  score: number;
  total_points: number;
  score_percentage: number;
  is_passed: boolean;
  time_taken: string;
  detailed_results: DetailedResult[];
}

export default function MCQTest() {
  const selectedMockTest = useTypedSelector((state) => state.common.selectedMockTest);
  const attemptId = useTypedSelector((state) => state.common.attemptId);
  const examDurationMinutes = useTypedSelector((state) => state.common.examDurationMinutes);
  const dispatch = useTypedDispatch();
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saveProgress, setSaveProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);
  
  // Utility to get localStorage key for answers
  const getAnswersStorageKey = (attemptId: string | number | undefined) => `mockTestAnswers_${attemptId}`;

  // Calculate result statistics
  const getResultStats = () => {
    if (!examResult) return { correct: 0, incorrectAnswered: 0, unanswered: 0 };
    
    const correct = examResult.detailed_results.filter(result => result.is_correct).length;
    const unanswered = examResult.detailed_results.filter(result => 
      !result.selected_choices || result.selected_choices.length === 0
    ).length;
    // Count only wrong answers that were actually attempted (exclude unanswered)
    const incorrectAnswered = examResult.detailed_results.filter(result =>
      !result.is_correct && result.selected_choices && result.selected_choices.length > 0
    ).length;
    
    return { correct, incorrectAnswered, unanswered };
  };

  // Fetch exam attempt data (questions and saved answers)
  useEffect(() => {
    if (!attemptId) return;
    
    const fetchExamAttempt = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getExamAttempt(attemptId);
        const data = response.data;
        
        console.log('Exam attempt data:', data);
        
        // Set questions from the API response
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          throw new Error('Exam content not available. Please contact support or try again later.');
        }

        // Setup countdown timer using end_time or duration
        try {
          const storageKey = `mockTestEndTime_${attemptId}`;
          let endTime = 0;
          if (data.end_time) {
            // server provides ISO end time
            endTime = new Date(data.end_time).getTime();
          } else {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
              endTime = parseInt(stored, 10);
            } else {
              const now = Date.now();
              const duration = (data.duration_minutes || examDurationMinutes || 0) * 60 * 1000;
              if (duration > 0) {
                endTime = now + duration;
                localStorage.setItem(storageKey, String(endTime));
              }
            }
          }
          if (endTime > 0) {
            setRemainingMs(Math.max(0, endTime - Date.now()));
          }
        } catch {}
        
        // Load any previously saved answers from localStorage
        const saved = localStorage.getItem(getAnswersStorageKey(attemptId));
        if (saved) {
          try {
            const savedAnswers = JSON.parse(saved);
            setSelectedAnswers(savedAnswers);
          } catch {
            console.warn('Unable to load previously saved answers from local storage. Starting with fresh answers.');
          }
        }
        
        // If the API returns saved answers, merge them with localStorage
        if (data.saved_answers && typeof data.saved_answers === 'object') {
          setSelectedAnswers(prev => ({
            ...prev,
            ...data.saved_answers
          }));
        }
        
      } catch (err: any) {
        console.error('Error fetching exam attempt:', err);
        
        // Handle different error scenarios with professional messages
        let errorMessage = 'Error loading questions. Please try again.';
        
        if (err.response?.status === 404) {
          errorMessage = "Exam attempt not found. Please return to the exam section and try again.";
        } else if (err.response?.status === 403) {
          errorMessage = "Access denied. You don't have permission to access this exam attempt.";
        } else if (err.response?.status === 401) {
          errorMessage = "Authentication required. Please log in again to continue.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchExamAttempt();
  }, [attemptId]);

  // Countdown interval
  useEffect(() => {
    if (!attemptId) return;
    if (remainingMs === null) return;
    if (timerExpired) return;
    const interval = setInterval(() => {
      const storageKey = `mockTestEndTime_${attemptId}`;
      const stored = localStorage.getItem(storageKey);
      const endTime = stored ? parseInt(stored, 10) : Date.now();
      const diff = Math.max(0, endTime - Date.now());
      setRemainingMs(diff);
      if (diff === 0) {
        clearInterval(interval);
        setTimerExpired(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [attemptId, remainingMs, timerExpired]);

  // Auto submit on expiry
  useEffect(() => {
    if (!timerExpired) return;
    if (submitting) return;
    handleSubmit();
  }, [timerExpired]);

  const formatHMS = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (attemptId && Object.keys(selectedAnswers).length > 0) {
      localStorage.setItem(getAnswersStorageKey(attemptId), JSON.stringify(selectedAnswers));
    }
  }, [selectedAnswers, attemptId]);

  const handleOptionSelect = (questionId: number, choiceId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleSubmit = async () => {
    if (!attemptId) {
      setError('Invalid exam session. Please return to the exam section and try again.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSaveProgress('Preparing answers...');

    try {
      // Get all answers from localStorage
      const saved = localStorage.getItem(getAnswersStorageKey(attemptId));
      let answers: { [questionId: number]: number } = {};
      
      if (saved) {
        try {
          answers = JSON.parse(saved);
        } catch {
          answers = selectedAnswers;
        }
      } else {
        answers = selectedAnswers;
      }

      // Convert answers to batch format - ensure all values are integers
      const answersToSave = Object.entries(answers).map(([questionId, choiceId]) => ({
        question_id: parseInt(questionId),
        selected_choices: [typeof choiceId === 'number' ? choiceId : parseInt(String(choiceId))]
      }));

      // Save all answers using batch function with progress updates
      setSaveProgress(`Saving ${answersToSave.length} answers...`);
      console.log(`Saving ${answersToSave.length} answers...`);
      console.log('Answers to save:', answersToSave);
      
      let saveResults = await saveAnswersBatch(attemptId, answersToSave);
      
      // Count successful saves
      let successfulSaves = saveResults.filter(result => 
        result.status === 'fulfilled'
      ).length;
      
      console.log(`Batch save result: ${successfulSaves}/${answersToSave.length} answers saved`);
      
      // If batch save completely failed, try saving sequentially as fallback
      if (successfulSaves === 0 && answersToSave.length > 0) {
        console.warn('Batch save failed, trying sequential save...');
        setSaveProgress('Retrying with sequential save...');
        saveResults = await saveAnswersSequentially(attemptId, answersToSave);
        
        successfulSaves = saveResults.filter(result => 
          result.status === 'fulfilled'
        ).length;
        
        console.log(`Sequential save result: ${successfulSaves}/${answersToSave.length} answers saved`);
      }
      
      // If still no answers were saved successfully, show an error
      if (successfulSaves === 0 && answersToSave.length > 0) {
        // Get error details from the first failed attempt
        const firstError = saveResults.find(r => r.status === 'rejected');
        const errorMessage = firstError && 'reason' in firstError 
          ? (firstError.reason?.response?.data?.detail || firstError.reason?.message || 'Unknown error')
          : 'Failed to save answers';
        throw new Error(`Failed to save answers: ${errorMessage}. Please check your connection and try again.`);
      }
      
      // If some answers failed but some succeeded, log a warning but continue
      if (successfulSaves < answersToSave.length) {
        console.warn(`Warning: Only ${successfulSaves} out of ${answersToSave.length} answers were saved successfully`);
      }
      
      setSaveProgress('Submitting exam...');

      // Submit the exam attempt immediately after batch save
      await submitExamAttempt(attemptId);
      console.log('Exam submitted successfully');

      // Try to fetch the results, but don't fail if it doesn't work
      try {
        const resultResponse = await getExamResult(attemptId);
        setExamResult(resultResponse.data);
      } catch (err) {
        console.warn('Could not fetch results:', err);
        // Still show success message even if results can't be fetched
      }
      
      // Clear localStorage for this attempt
      localStorage.removeItem(getAnswersStorageKey(attemptId));
      localStorage.removeItem(`mockTestEndTime_${attemptId}`);
      setRemainingMs(null);
      
      setShowResults(true);
      
    } catch (err: any) {
      console.error('Error submitting exam:', err);
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Error submitting exam. Please try again.';
      
      if (err.message && err.message.includes('save answers')) {
        errorMessage = err.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again and try submitting your exam.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to submit this exam. Please contact support.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Exam attempt not found. Your exam may have expired or been completed already.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToMocks = () => {
    // Clear localStorage for this attempt if going back
    if (attemptId) {
      localStorage.removeItem(getAnswersStorageKey(attemptId));
      localStorage.removeItem(`mockTestEndTime_${attemptId}`);
    }
    
    dispatch(setCommonState({ 
      examView: 'mock-tests',
      selectedMockTest: null,
      attemptId: null,
      examDurationMinutes: null
    }));
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Scroll to top when page changes
  useEffect(() => {
    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollTop = 0;
      questionsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  if (loading) {
    return (
      <div className="naxatw-p-8 naxatw-max-w-2xl naxatw-mx-auto">
        <div className="naxatw-bg-blue-50 naxatw-border naxatw-border-blue-200 naxatw-rounded-lg naxatw-p-6 naxatw-text-center">
          <div className="naxatw-w-16 naxatw-h-16 naxatw-bg-blue-100 naxatw-rounded-full naxatw-flex naxatw-items-center naxatw-justify-center naxatw-mx-auto naxatw-mb-4">
            <svg className="naxatw-w-8 naxatw-h-8 naxatw-text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-blue-800 naxatw-mb-2">Loading Your Exam</h3>
          <p className="naxatw-text-blue-700 naxatw-leading-relaxed">Please wait while we prepare your exam questions and settings.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="naxatw-p-8 naxatw-max-w-2xl naxatw-mx-auto">
        <div className="naxatw-bg-red-50 naxatw-border naxatw-border-red-200 naxatw-rounded-lg naxatw-p-6 naxatw-text-center">
          <div className="naxatw-mb-4">
            <div className="naxatw-w-16 naxatw-h-16 naxatw-bg-red-100 naxatw-rounded-full naxatw-flex naxatw-items-center naxatw-justify-center naxatw-mx-auto naxatw-mb-4">
              <svg className="naxatw-w-8 naxatw-h-8 naxatw-text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-red-800 naxatw-mb-2">Error Occurred</h3>
            <p className="naxatw-text-red-700 naxatw-leading-relaxed">{error}</p>
          </div>
          
          <Button
            onClick={handleBackToMocks}
            className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-primary/90 naxatw-transition-colors"
          >
            Back to Mock Tests
          </Button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="naxatw-p-8 naxatw-max-w-2xl naxatw-mx-auto">
        <div className="naxatw-bg-yellow-50 naxatw-border naxatw-border-yellow-200 naxatw-rounded-lg naxatw-p-6 naxatw-text-center">
          <div className="naxatw-mb-4">
            <div className="naxatw-w-16 naxatw-h-16 naxatw-bg-yellow-100 naxatw-rounded-full naxatw-flex naxatw-items-center naxatw-justify-center naxatw-mx-auto naxatw-mb-4">
              <svg className="naxatw-w-8 naxatw-h-8 naxatw-text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-yellow-800 naxatw-mb-2">No Questions Available</h3>
            <p className="naxatw-text-yellow-700 naxatw-leading-relaxed">No questions are currently available for this exam. Please try again later or contact support if the issue persists.</p>
          </div>
          
          <Button
            onClick={handleBackToMocks}
            className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-primary/90 naxatw-transition-colors"
          >
            Back to Mock Tests
          </Button>
        </div>
      </div>
    );
  }

  const resultStats = getResultStats();
  const negativeMarkPerWrong = 0.1;
  const adjustedScore = examResult
    ? Math.max(0, (examResult.score || 0) - resultStats.incorrectAnswered * negativeMarkPerWrong)
    : 0;
  const adjustedPercentage = examResult && examResult.total_points
    ? Math.max(0, Math.min(100, (adjustedScore / examResult.total_points) * 100))
    : 0;

  return (
    <section className="naxatw-h-full naxatw-w-full naxatw-p-4">
      <div className="naxatw-max-w-4xl naxatw-mx-auto naxatw-my-8">
        <div className="naxatw-flex naxatw-justify-between naxatw-items-center naxatw-mb-6">
          <h2 className="naxatw-text-2xl naxatw-font-semibold">
            Mock Test {selectedMockTest}
          </h2>
          <button 
            onClick={handleBackToMocks}
            className="naxatw-text-primary naxatw-underline"
          >
            Back to Mock Tests
          </button>
        </div>

        {!showResults && remainingMs !== null && remainingMs > 0 && (
          <div className="naxatw-z-50 naxatw-bg-primary naxatw-text-white naxatw-rounded-lg naxatw-shadow-lg naxatw-px-4 naxatw-py-2 naxatw-fixed naxatw-right-4 naxatw-top-[84px] md:naxatw-right-14 md:naxatw-top-[110px]">
            <div className="naxatw-text-base md:naxatw-text-lg naxatw-font-semibold">{formatHMS(remainingMs)}</div>
          </div>
        )}

        {!showResults ? (
          <>
            <div ref={questionsContainerRef} className="naxatw-bg-white naxatw-rounded-lg naxatw-shadow-md naxatw-p-6 naxatw-mb-6">
              <div className="naxatw-flex naxatw-justify-between naxatw-items-center naxatw-mb-4">
                <h3 className="naxatw-text-lg naxatw-font-bold">Questions</h3>
                <span className="naxatw-text-sm naxatw-text-gray-500">
                  Page {currentPage} of {totalPages} • {questions.length} total questions
                </span>
              </div>
              
              {currentQuestions.map((question, index) => (
                <div key={question.id} className="naxatw-mb-8 naxatw-border-b naxatw-pb-4 naxatw-last:border-0">
                  <div className="naxatw-mb-3">
                    <div className="naxatw-flex naxatw-gap-2 naxatw-mb-3">
                      <h4 className="naxatw-font-medium naxatw-text-lg">
                        {startIndex + index + 1}.
                      </h4>
                      {/* Question Text */}
                      {question.question_text && question.question_text.trim() && (
                        <div className="naxatw-text-gray-800 naxatw-text-lg">
                          {question.question_text}
                        </div>
                      )}
                    </div>
                    
                    {/* Question Image */}
                    {question.image && (
                      <ExamImage 
                        src={question.image} 
                        alt="Question" 
                        fallbackText="Question image not available"
                      />
                    )}
                    
                    {/* Show message if neither text nor image */}
                    {(!question.question_text || !question.question_text.trim()) && !question.image && (
                      <div className="naxatw-text-gray-400 naxatw-italic">
                        No question content available
                      </div>
                    )}
                  </div>
                  
                  <div className="naxatw-pl-4">
                      {Array.isArray(question.choices) && question.choices.length > 0 ? (
                        question.choices.map((choice) => (
                          <div key={choice.id} className="naxatw-flex naxatw-items-start naxatw-gap-3 naxatw-my-3 naxatw-p-3 naxatw-border naxatw-border-gray-200 naxatw-rounded-lg naxatw-hover:bg-gray-50">
                            <input
                              type="radio"
                              id={`q${question.id}-${choice.id}`}
                              name={`question-${question.id}`}
                              checked={selectedAnswers[question.id] === choice.id}
                              onChange={() => handleOptionSelect(question.id, choice.id)}
                              className="naxatw-cursor-pointer naxatw-w-4 naxatw-h-4 naxatw-mt-1"
                            />
                            <label
                              htmlFor={`q${question.id}-${choice.id}`}
                              className="naxatw-cursor-pointer naxatw-flex-1 naxatw-text-gray-700"
                            >
                              <div className="naxatw-space-y-2">
                                {/* Choice Text */}
                                {choice.choice_text && choice.choice_text.trim() && (
                                  <div className="naxatw-text-gray-800">
                                    {choice.choice_text}
                                  </div>
                                )}
                                
                                {/* Choice Image */}
                                {choice.image && (
                                  <ExamImage 
                                    src={choice.image} 
                                    alt="Choice" 
                                    fallbackText="Choice image not available"
                                    className="naxatw-max-w-xs"
                                  />
                                )}
                                
                                {/* Show message if neither text nor image */}
                                {(!choice.choice_text || !choice.choice_text.trim()) && !choice.image && (
                                  <div className="naxatw-text-gray-400 naxatw-italic">
                                    No choice content available
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        ))
                      ) : (
                        <div className="naxatw-text-gray-400 naxatw-italic">No options available.</div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            <div className="naxatw-flex naxatw-justify-between naxatw-items-center naxatw-mb-6 naxatw-pb-4">
              {currentPage > 1 && (
                <Button
                  onClick={handlePrevPage}
                  className="naxatw-bg-gray-500 naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-gray-600"
                >
                  Previous
                </Button>
              )}
              
              {currentPage === totalPages ? (
                <div className="naxatw-flex naxatw-justify-center naxatw-w-full">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="naxatw-bg-primary naxatw-text-white naxatw-py-3 naxatw-px-8 naxatw-rounded-md hover:naxatw-bg-primary/90 disabled:naxatw-opacity-50"
                  >
                    {submitting ? (saveProgress || 'Submitting...') : 'Submit Exam'}
                  </Button>
                </div>
              ) : (
                <div className={`${currentPage === 1 ? 'naxatw-ml-auto' : ''}`}>
                  <Button
                    onClick={handleNextPage}
                    className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="naxatw-bg-white naxatw-rounded-lg naxatw-shadow-md naxatw-p-6">
            {examResult ? (
              <>
                <div className="naxatw-text-center naxatw-mb-8">
                  <h3 className="naxatw-text-2xl naxatw-font-bold naxatw-mb-4">Exam Results</h3>
                  
                  <div className="naxatw-grid naxatw-grid-cols-2 md:naxatw-grid-cols-4 naxatw-gap-4 naxatw-mb-6">
                    <div className="naxatw-bg-blue-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-blue-600">{adjustedScore.toFixed(2)}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Score (with -0.1/incorrect)</div>
                    </div>
                    <div className="naxatw-bg-green-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-green-600">{resultStats.correct}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Correct</div>
                    </div>
                    <div className="naxatw-bg-red-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-red-600">{resultStats.incorrectAnswered}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Incorrect</div>
                    </div>
                    <div className="naxatw-bg-gray-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-gray-600">{adjustedPercentage.toFixed(2)}%</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Percentage (after negative marking)</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="naxatw-space-y-6 naxatw-mb-6">
                  <h4 className="naxatw-text-xl naxatw-font-semibold naxatw-border-b naxatw-pb-2">Detailed Results</h4>
                  
                  {examResult.detailed_results && examResult.detailed_results.length > 0 ? (
                    examResult.detailed_results.map((result, index) => (
                      <div key={result.question_id} className="naxatw-border naxatw-rounded-lg naxatw-p-6">
                        <div className="naxatw-flex naxatw-gap-3 naxatw-mb-4">
                          <span className={`naxatw-inline-flex naxatw-items-center naxatw-justify-center naxatw-w-8 naxatw-h-8 naxatw-rounded-full naxatw-text-white naxatw-font-bold ${
                            result.is_correct ? 'naxatw-bg-green-500' : 'naxatw-bg-red-500'
                          }`}>
                            {index + 1}
                          </span>
                          <div className="naxatw-flex-1">
                            <h5 className="naxatw-font-medium naxatw-text-lg naxatw-mb-2">{result.question_text}</h5>
                            
                            {/* Your Answer */}
                            <div className="naxatw-mb-3">
                              <span className="naxatw-font-medium naxatw-text-gray-700">Your Answer: </span>
                              {result.selected_choices && result.selected_choices.length > 0 ? (
                                <div className="naxatw-mt-2 naxatw-space-y-2">
                                  {result.selected_choices.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className={`naxatw-p-2 naxatw-border naxatw-rounded ${
                                      result.is_correct ? 'naxatw-border-green-300 naxatw-bg-green-50' : 'naxatw-border-red-300 naxatw-bg-red-50'
                                    }`}>
                                      {choice.choice_text && choice.choice_text.trim() && (
                                        <div className="naxatw-text-gray-800">{choice.choice_text}</div>
                                      )}
                                      {choice.image && (
                                        <ExamImage 
                                          src={choice.image} 
                                          alt="Your selected choice" 
                                          fallbackText="Choice image not available"
                                          className="naxatw-max-w-xs naxatw-mt-2"
                                        />
                                      )}
                                      {(!choice.choice_text || !choice.choice_text.trim()) && !choice.image && (
                                        <div className="naxatw-text-gray-400 naxatw-italic">No choice content</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="naxatw-text-gray-500 italic">No answer provided</span>
                              )}
                            </div>

                            {/* Correct Answer */}
                            {!result.is_correct && (
                              <div className="naxatw-mb-3">
                                <span className="naxatw-font-medium naxatw-text-gray-700">Correct Answer: </span>
                                <div className="naxatw-mt-2 naxatw-space-y-2">
                                  {result.correct_choices.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="naxatw-p-2 naxatw-border naxatw-border-green-300 naxatw-bg-green-50 naxatw-rounded">
                                      {choice.choice_text && choice.choice_text.trim() && (
                                        <div className="naxatw-text-gray-800">{choice.choice_text}</div>
                                      )}
                                      {choice.image && (
                                        <ExamImage 
                                          src={choice.image} 
                                          alt="Correct choice" 
                                          fallbackText="Choice image not available"
                                          className="naxatw-max-w-xs naxatw-mt-2"
                                        />
                                      )}
                                      {(!choice.choice_text || !choice.choice_text.trim()) && !choice.image && (
                                        <div className="naxatw-text-gray-400 naxatw-italic">No choice content</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Explanation */}
                            {result.explanation && (
                              <div className="naxatw-bg-gray-50 naxatw-p-3 naxatw-rounded-md naxatw-mt-3">
                                <span className="naxatw-font-medium naxatw-text-gray-700">Explanation: </span>
                                <span className="naxatw-text-gray-600">{result.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="naxatw-text-center naxatw-text-gray-500 naxatw-py-8">
                      Detailed results will be available shortly.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="naxatw-text-center">
                <h3 className="naxatw-text-xl naxatw-font-semibold naxatw-mb-4">Exam Submitted Successfully!</h3>
                <p className="naxatw-text-gray-600 naxatw-mb-6">
                  Your exam has been submitted and is being processed. 
                  You can check your results later from the exam history.
                </p>
                <div className="naxatw-bg-green-50 naxatw-border naxatw-border-green-200 naxatw-rounded-lg naxatw-p-4 naxatw-mb-6">
                  <p className="naxatw-text-green-800 naxatw-font-medium">✓ All your answers have been saved</p>
                  <p className="naxatw-text-green-700 naxatw-text-sm">✓ Exam has been submitted successfully</p>
                </div>
              </div>
            )}
            
            <div className="naxatw-text-center">
              <Button
                onClick={handleBackToMocks}
                className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-8 naxatw-rounded-md hover:naxatw-bg-primary/90"
              >
                Back to Mock Tests
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}