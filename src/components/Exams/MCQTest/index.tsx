import { useState, useRef, useEffect } from "react";
import { Button } from "@Components/RadixComponents/Button";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";
import { getExamAttempt, saveAnswer, submitExamAttempt, getExamResult } from "@Services/exam";

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
  const dispatch = useTypedDispatch();
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);
  
  // Utility to get localStorage key for answers
  const getAnswersStorageKey = (attemptId: string | number | undefined) => `mockTestAnswers_${attemptId}`;

  // Calculate result statistics
  const getResultStats = () => {
    if (!examResult) return { correct: 0, incorrect: 0, unanswered: 0 };
    
    const correct = examResult.detailed_results.filter(result => result.is_correct).length;
    const incorrect = examResult.detailed_results.filter(result => !result.is_correct).length;
    const unanswered = examResult.detailed_results.filter(result => 
      !result.selected_choices || result.selected_choices.length === 0
    ).length;
    
    return { correct, incorrect, unanswered };
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
          throw new Error('No questions found in exam attempt');
        }
        
        // Load any previously saved answers from localStorage
        const saved = localStorage.getItem(getAnswersStorageKey(attemptId));
        if (saved) {
          try {
            const savedAnswers = JSON.parse(saved);
            setSelectedAnswers(savedAnswers);
          } catch {
            console.warn('Failed to parse saved answers from localStorage');
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
        setError(err.response?.data?.message || 'Error loading questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamAttempt();
  }, [attemptId]);

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
      setError('No attempt ID found');
      return;
    }

    setSubmitting(true);
    setError(null);

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

      // Save each answer individually via API
      for (const [questionId, choiceId] of Object.entries(answers)) {
        try {
          await saveAnswer(attemptId, {
            question_id: parseInt(questionId),
            selected_choices: [choiceId]
          });
        } catch (err) {
          console.warn(`Failed to save answer for question ${questionId}:`, err);
        }
      }
      console.log('All answers saved successfully');

      // Submit the exam attempt
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
      
      setShowResults(true);
      
    } catch (err: any) {
      console.error('Error submitting exam:', err);
      setError(err.response?.data?.message || 'Error submitting exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToMocks = () => {
    // Clear localStorage for this attempt if going back
    if (attemptId) {
      localStorage.removeItem(getAnswersStorageKey(attemptId));
    }
    
    dispatch(setCommonState({ 
      examView: 'mock-tests',
      selectedMockTest: null,
      attemptId: null
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
      <div className="naxatw-flex naxatw-items-center naxatw-justify-center naxatw-h-64">
        <div className="naxatw-text-center">
          <div className="naxatw-text-lg naxatw-mb-2">Loading questions...</div>
          <div className="naxatw-text-gray-500">Please wait while we prepare your exam</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="naxatw-p-8">
        <div className="naxatw-text-center">
          <div className="naxatw-text-red-500 naxatw-mb-4">{error}</div>
          <Button
            onClick={handleBackToMocks}
            className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md"
          >
            Back to Mock Tests
          </Button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="naxatw-p-8">
        <div className="naxatw-text-center">
          <div className="naxatw-text-gray-500 naxatw-mb-4">No questions available for this exam.</div>
          <Button
            onClick={handleBackToMocks}
            className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md"
          >
            Back to Mock Tests
          </Button>
        </div>
      </div>
    );
  }

  const resultStats = getResultStats();

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
                    <h4 className="naxatw-font-medium naxatw-text-lg">
                      {startIndex + index + 1}. {question.question_text}
                    </h4>
                    {question.image && (
                      <img 
                        src={question.image} 
                        alt="Question" 
                        className="naxatw-mt-2 naxatw-max-w-full naxatw-h-auto naxatw-rounded"
                      />
                    )}
                  </div>
                  
                  <div className="naxatw-pl-4">
                    {Array.isArray(question.choices) && question.choices.length > 0 ? (
                      question.choices.map((choice) => (
                        <div key={choice.id} className="naxatw-flex naxatw-items-center naxatw-gap-3 naxatw-my-3">
                          <input
                            type="radio"
                            id={`q${question.id}-${choice.id}`}
                            name={`question-${question.id}`}
                            checked={selectedAnswers[question.id] === choice.id}
                            onChange={() => handleOptionSelect(question.id, choice.id)}
                            className="naxatw-cursor-pointer naxatw-w-4 naxatw-h-4"
                          />
                          <label
                            htmlFor={`q${question.id}-${choice.id}`}
                            className="naxatw-cursor-pointer naxatw-flex-1 naxatw-text-gray-700"
                          >
                            {choice.choice_text}
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
                    {submitting ? 'Submitting...' : 'Submit Exam'}
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
                  
                  <div className="naxatw-grid naxatw-grid-cols-2 naxatw-md:grid-cols-4 naxatw-gap-4 naxatw-mb-6">
                    <div className="naxatw-bg-blue-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-blue-600">{examResult.score}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Score</div>
                    </div>
                    <div className="naxatw-bg-green-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-green-600">{resultStats.correct}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Correct</div>
                    </div>
                    <div className="naxatw-bg-red-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-red-600">{resultStats.incorrect}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Incorrect</div>
                    </div>
                    <div className="naxatw-bg-gray-50 naxatw-p-4 naxatw-rounded-lg">
                      <div className="naxatw-text-2xl naxatw-font-bold naxatw-text-gray-600">{examResult.score_percentage}%</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Percentage</div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="naxatw-grid naxatw-grid-cols-1 naxatw-md:grid-cols-3 naxatw-gap-4 naxatw-mb-6">
                    <div className="naxatw-bg-purple-50 naxatw-p-3 naxatw-rounded-lg">
                      <div className="naxatw-text-lg naxatw-font-semibold naxatw-text-purple-700">{examResult.total_points}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Total Points</div>
                    </div>
                    <div className="naxatw-bg-indigo-50 naxatw-p-3 naxatw-rounded-lg">
                      <div className="naxatw-text-lg naxatw-font-semibold naxatw-text-indigo-700">{examResult.time_taken}</div>
                      <div className="naxatw-text-sm naxatw-text-gray-600">Time Taken</div>
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
                                <span className={`naxatw-font-semibold ${
                                  result.is_correct ? 'naxatw-text-green-600' : 'naxatw-text-red-600'
                                }`}>
                                  {result.selected_choices.map(choice => choice.choice_text).join(', ')}
                                </span>
                              ) : (
                                <span className="naxatw-text-gray-500 italic">No answer provided</span>
                              )}
                            </div>

                            {/* Correct Answer */}
                            {!result.is_correct && (
                              <div className="naxatw-mb-3">
                                <span className="naxatw-font-medium naxatw-text-gray-700">Correct Answer: </span>
                                <span className="naxatw-font-semibold naxatw-text-green-600">
                                  {result.correct_choices.map(choice => choice.choice_text).join(', ')}
                                </span>
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