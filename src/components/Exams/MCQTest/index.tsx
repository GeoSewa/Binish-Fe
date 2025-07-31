import { useState, useRef, useEffect } from "react";
import { Button } from "@Components/RadixComponents/Button";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";
// import { mockTest1Questions } from "@Constants/mockTestQuestions";

export default function MCQTest() {
  const selectedMockTest = useTypedSelector((state) => state.common.selectedMockTest);
  const attemptId = useTypedSelector((state) => state.common.attemptId);
  const dispatch = useTypedDispatch();
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Define sections
  const sections = [
    { name: "Section 1", startQuestion: 1, endQuestion: 60, pointsPerQuestion: 1 },
    { name: "Section 2", startQuestion: 61, endQuestion: 80, pointsPerQuestion: 2 }
  ];
  
  // Find the current section based on the current page
  const getCurrentSection = () => {
    const questionsPerPage = 10;
    const startQuestionIndex = (currentPage - 1) * questionsPerPage + 1;
    
    for (const section of sections) {
      if (startQuestionIndex >= section.startQuestion && startQuestionIndex <= section.endQuestion) {
        return section;
      }
    }
    
    return sections[0]; // Default to Section 1
  };
  
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);
  const currentSection = getCurrentSection();
  
  // Scroll to top of questions container when page changes
  useEffect(() => {
    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollTop = 0;
      questionsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Utility to get localStorage key for answers
  const getAnswersStorageKey = (attemptId: string | number | undefined) => `mockTestAnswers_${attemptId}`;

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    fetch(`https://sujanadh.pythonanywhere.com/api/exams/attempt/${attemptId}/`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch questions');
        return res.json();
      })
      .then((data) => {
        console.log('API response:', data); // Log the API response
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error loading questions');
        setLoading(false);
      });
  }, [attemptId]);

  useEffect(() => {
    if (!attemptId) return;
    // Load answers from localStorage if present
    const saved = localStorage.getItem(getAnswersStorageKey(attemptId));
    if (saved) {
      try {
        setSelectedAnswers(JSON.parse(saved));
      } catch {
        setSelectedAnswers({});
      }
    }
  }, [attemptId]);

  const handleOptionSelect = (questionId: number, optionId: string) => {
    setSelectedAnswers(prev => {
      const updated = { ...prev, [questionId]: optionId };
      // Save to localStorage
      if (attemptId) {
        localStorage.setItem(getAnswersStorageKey(attemptId), JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    const token = localStorage.getItem('token');
    // Get answers from localStorage
    const saved = localStorage.getItem(getAnswersStorageKey(attemptId));
    let answers: { [questionId: number]: string } = {};
    if (saved) {
      try {
        answers = JSON.parse(saved);
      } catch {
        answers = selectedAnswers;
      }
    } else {
      answers = selectedAnswers;
    }

    // Prepare payload for save-answer API
    // API expects: { answers: [{ question_id: id, selected_choices: [id] }, ...] }
    const payload = {
      answers: Object.entries(answers).map(([question, choice]) => ({
        question_id: Number(question),
        selected_choices: [Number(choice)],
      })),
    };

    try {
      // Save answers
      const saveRes = await fetch(`https://sujanadh.pythonanywhere.com/api/exams/attempt/${attemptId}/save-answer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!saveRes.ok) throw new Error('Failed to save answers');

      // Submit attempt
      const submitRes = await fetch(`https://sujanadh.pythonanywhere.com/api/exams/attempt/${attemptId}/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!submitRes.ok) throw new Error('Failed to submit attempt');

      // Optionally clear localStorage for this attempt
      localStorage.removeItem(getAnswersStorageKey(attemptId));
      setShowResults(true);
      // Optionally: fetch results, show message, etc.
    } catch (err) {
      setError('Error submitting answers. Please try again.');
    }
  };

  const handleBackToMocks = () => {
    dispatch(setCommonState({ 
      examView: 'mock-tests',
      selectedMockTest: null 
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

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  if (loading) return <div className="naxatw-p-8">Loading questions...</div>;
  if (error) return <div className="naxatw-p-8">{error}</div>;
  if (!Array.isArray(questions) || questions.length === 0) {
    return <div className="naxatw-p-8">No questions available.</div>;
  }

  return (
    <section className="naxatw-h-full naxatw-w-full naxatw-p-4">
      <div className="naxatw-max-w-3xl naxatw-mx-auto naxatw-my-8">
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
                <h3 className="naxatw-text-lg naxatw-font-bold">{currentSection.name}</h3>
                <span className="naxatw-text-sm naxatw-text-gray-500">Page {currentPage} of {totalPages}</span>
              </div>
              
              {currentQuestions.map((question) => (
                <div key={question.id} className="naxatw-mb-8 naxatw-border-b naxatw-pb-4 naxatw-last:border-0">
                  <div className="naxatw-flex naxatw-justify-between naxatw-mb-2">
                    <h4 className="naxatw-font-medium">{question.id}. {question.question_text}</h4>
                    <span className="naxatw-text-sm naxatw-text-gray-500">{question.points ? question.points : 1} point{question.points && question.points > 1 ? 's' : ''}</span>
                  </div>
                  <div className="naxatw-pl-4">
                    {Array.isArray(question.choices) && question.choices.length > 0 ? (
                      question.choices.map((choice: any) => (
                        <div key={choice.id} className="naxatw-flex naxatw-items-center naxatw-gap-2 naxatw-my-2">
                          <input
                            type="radio"
                            id={`q${question.id}-${choice.id}`}
                            name={`question-${question.id}`}
                            checked={selectedAnswers[question.id] === choice.id}
                            onChange={() => handleOptionSelect(question.id, choice.id)}
                            className="naxatw-cursor-pointer"
                          />
                          <label
                            htmlFor={`q${question.id}-${choice.id}`}
                            className="naxatw-cursor-pointer"
                          >
                            {choice.choice_text}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="naxatw-text-gray-400">No options available.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="naxatw-flex naxatw-justify-between naxatw-items-center naxatw-mb-6 naxatw-pb-4">
              {currentPage > 1 && (
                <Button
                  onClick={handlePrevPage}
                  className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-primary/90 focus:naxatw-outline-none focus:naxatw-ring-2 focus:naxatw-ring-primary"
                >
                  Previous
                </Button>
              )}
              
              {currentPage === totalPages ? (
                <div className="naxatw-flex naxatw-justify-center naxatw-w-full">
                  <Button
                    onClick={handleSubmit}
                    className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-8 naxatw-rounded-md hover:naxatw-bg-primary/90 focus:naxatw-outline-none focus:naxatw-ring-2 focus:naxatw-ring-primary"
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <div className={`${currentPage === 1 ? 'naxatw-ml-auto' : ''}`}>
                  <Button
                    onClick={handleNextPage}
                    className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-primary/90 focus:naxatw-outline-none focus:naxatw-ring-2 focus:naxatw-ring-primary"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="naxatw-bg-white naxatw-rounded-lg naxatw-shadow-md naxatw-p-6 naxatw-text-center">
            <h3 className="naxatw-text-xl naxatw-font-semibold naxatw-mb-4">Your Results</h3>
            <div className="naxatw-text-5xl naxatw-font-bold naxatw-mb-4 naxatw-text-primary">
              {score}/{totalPoints}
            </div>
            <p className="naxatw-mb-6">
              You scored {score} out of {totalPoints} points.
            </p>
            
            <div className="naxatw-flex naxatw-flex-col naxatw-gap-4 naxatw-mt-8">
              {questions.map((question) => {
                const isCorrect = selectedAnswers[question.id] === question.correctOptionId;
                const selectedOption = question.options.find((o: any) => o.id === selectedAnswers[question.id]);
                const correctOption = question.options.find((o: any) => o.id === question.correctOptionId);
                
                return (
                  <div key={question.id} className="naxatw-text-left naxatw-border naxatw-rounded-md naxatw-p-4">
                    <div className="naxatw-flex naxatw-gap-2">
                      <span className={`naxatw-inline-block naxatw-rounded-full naxatw-w-6 naxatw-h-6 naxatw-text-center naxatw-text-white ${isCorrect ? 'naxatw-bg-green-500' : 'naxatw-bg-red-500'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <h4 className="naxatw-font-medium">{question.text}</h4>
                    </div>
                    
                    <div className="naxatw-pl-8 naxatw-mt-2">
                      {!isCorrect && (
                        <>
                          <p className="naxatw-text-red-500">Your answer: {selectedOption?.text || 'No answer selected'}</p>
                          <p className="naxatw-text-green-500">Correct answer: {correctOption?.text}</p>
                        </>
                      )}
                      {isCorrect && (
                        <p className="naxatw-text-green-500">Your answer: {selectedOption?.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button
              onClick={handleBackToMocks}
              className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-8 naxatw-rounded-md naxatw-mt-6 hover:naxatw-bg-primary/90 focus:naxatw-outline-none focus:naxatw-ring-2 focus:naxatw-ring-primary"
            >
              Back to Mock Tests
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}