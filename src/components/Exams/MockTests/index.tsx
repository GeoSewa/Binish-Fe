import { useState, useEffect } from "react";
import { useTypedDispatch } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";
import { getExamSets, startExamAttempt } from "@Services/exam";

interface MockTest {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  price: string;
  duration_minutes?: number;
  total_questions?: number;
}

export default function MockTests() {
  const dispatch = useTypedDispatch();
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingAttempt, setStartingAttempt] = useState(false);

  const fetchMockTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExamSets();
      setMockTests(response.data);
    } catch (err) {
      setError("Unable to load mock tests at this time. Please check your connection and try again.");
      console.error("Error fetching mock tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  const handleRetry = () => {
    fetchMockTests();
  };

  const handleMockClick = async (mockId: number) => {
    setStartingAttempt(true);
    setError(null);
    
    try {
      const response = await startExamAttempt(mockId);
      const attemptId = response.data.attempt_id || response.data.id || response.data.attempt;
      
      if (!attemptId) {
        throw new Error('Unable to create exam session. Please try again or contact support.');
      }
      
      dispatch(setCommonState({
        examView: 'mcq-test',
        selectedMockTest: mockId,
        attemptId: attemptId.toString(),
      }));
    } catch (err: any) {
      console.error("Error starting attempt:", err);
      
      // Handle different error scenarios with professional messages
      let errorMessage = 'Failed to start attempt. Please try again.';
      
      if (err.response?.status === 404) {
        errorMessage = "You don't have access to the selected Mock Set. Kindly complete the payment or contact the Administrator.";
      } else if (err.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to access this Mock Set. Please contact the Administrator (+977-9763252325) for assistance.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication required. Please log in again to access this Mock Set.";
      } else if (err.response?.status === 402) {
        errorMessage = "Payment required. Please complete the payment to access this Mock Set.";
      } else if (err.response?.status === 400) {
        errorMessage = "You have tried all 3 attempts. Please contact the Administrator.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setStartingAttempt(false);
    }
  };

  if (loading) return (
    <div className="naxatw-p-8 naxatw-max-w-2xl naxatw-mx-auto">
      <div className="naxatw-bg-blue-50 naxatw-border naxatw-border-blue-200 naxatw-rounded-lg naxatw-p-6 naxatw-text-center">
        <div className="naxatw-w-16 naxatw-h-16 naxatw-bg-blue-100 naxatw-rounded-full naxatw-flex naxatw-items-center naxatw-justify-center naxatw-mx-auto naxatw-mb-4">
          <svg className="naxatw-w-8 naxatw-h-8 naxatw-text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-blue-800 naxatw-mb-2">Loading Mock Tests</h3>
        <p className="naxatw-text-blue-700 naxatw-leading-relaxed">Please wait while we fetch the available mock tests for you.</p>
      </div>
    </div>
  );
  
  if (startingAttempt) return (
    <div className="naxatw-p-8 naxatw-max-w-2xl naxatw-mx-auto">
      <div className="naxatw-bg-green-50 naxatw-border naxatw-border-green-200 naxatw-rounded-lg naxatw-p-6 naxatw-text-center">
        <div className="naxatw-w-16 naxatw-h-16 naxatw-bg-green-100 naxatw-rounded-full naxatw-flex naxatw-items-center naxatw-justify-center naxatw-mx-auto naxatw-mb-4">
          <svg className="naxatw-w-8 naxatw-h-8 naxatw-text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-green-800 naxatw-mb-2">Starting Your Exam</h3>
        <p className="naxatw-text-green-700 naxatw-leading-relaxed">Please wait while we prepare your exam session. This may take a few moments.</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="naxatw-p-8 naxatw-max-w-2xl naxatw-mx-auto">
      <div className="naxatw-bg-red-50 naxatw-border naxatw-border-red-200 naxatw-rounded-lg naxatw-p-6 naxatw-text-center">
        <div className="naxatw-mb-4">
          <div className="naxatw-w-16 naxatw-h-16 naxatw-bg-red-100 naxatw-rounded-full naxatw-flex naxatw-items-center naxatw-justify-center naxatw-mx-auto naxatw-mb-4">
            <svg className="naxatw-w-8 naxatw-h-8 naxatw-text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-red-800 naxatw-mb-2">Access Denied</h3>
          <p className="naxatw-text-red-700 naxatw-leading-relaxed">{error}</p>
        </div>
        
        <div className="naxatw-flex naxatw-flex-col naxatw-sm:flex-row naxatw-gap-3 naxatw-justify-center">
          <button 
            onClick={handleRetry}
            className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-primary/90 naxatw-transition-colors"
          >
            Retry
          </button>
          <button 
            onClick={() => dispatch(setCommonState({ examView: 'main' }))}
            className="naxatw-bg-gray-100 naxatw-text-gray-700 naxatw-py-2 naxatw-px-4 naxatw-rounded-md hover:naxatw-bg-gray-200 naxatw-transition-colors"
          >
            Back to Exam Section
          </button>
        </div>
        
        {error.includes("contact the Administrator") && (
          <div className="naxatw-mt-4 naxatw-pt-4 naxatw-border-t naxatw-border-red-200">
            <p className="naxatw-text-sm naxatw-text-red-600 naxatw-mb-2">Need immediate assistance?</p>
            <div className="naxatw-flex naxatw-items-center naxatw-justify-center naxatw-gap-2">
              <svg className="naxatw-w-4 naxatw-h-4 naxatw-text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.554.89l1.28 7.19a1 1 0 01-.554 1.11l-1.28 7.19a1 1 0 01-1.11.554H5a2 2 0 01-2-2V5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12V4a2 2 0 00-2-2h-1a2 2 0 00-2 2v8m0 0v4a2 2 0 002 2h1a2 2 0 002-2v-8m0 0V4" />
              </svg>
              <span className="naxatw-text-sm naxatw-text-red-600">Contact: +977-9763252325</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className="naxatw-h-full naxatw-w-full naxatw-p-4">
      <div className="naxatw-max-w-4xl naxatw-mx-auto naxatw-my-8">
        <div className="naxatw-flex naxatw-justify-between naxatw-items-center naxatw-mb-6">
          <h2 className="naxatw-text-2xl naxatw-font-semibold">Available Mock Tests</h2>
          <button 
            onClick={() => dispatch(setCommonState({ examView: 'main' }))}
            className="naxatw-text-primary naxatw-underline"
          >
            Back to Exam Section
          </button>
        </div>

        <div className="naxatw-grid naxatw-grid-cols-1 naxatw-md:grid-cols-2 naxatw-lg:grid-cols-3 naxatw-gap-6">
          {mockTests.map((test) => (
            <div
              key={test.id}
              className="naxatw-bg-white naxatw-rounded-lg naxatw-shadow-md naxatw-p-6 naxatw-cursor-pointer hover:naxatw-shadow-lg naxatw-transition-shadow"
              onClick={() => handleMockClick(test.id)}
            >
              <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-mb-2">{test.title}</h3>
              <p className="naxatw-text-gray-600 naxatw-mb-4 naxatw-line-clamp-3">{test.description}</p>
              
              <div className="naxatw-flex naxatw-justify-between naxatw-items-center naxatw-mb-4">
                <span className={`naxatw-px-2 naxatw-py-1 naxatw-rounded-full naxatw-text-xs naxatw-font-medium ${
                  test.difficulty === 'beginner' ? 'naxatw-bg-green-100 naxatw-text-green-800' :
                  test.difficulty === 'intermediate' ? 'naxatw-bg-yellow-100 naxatw-text-yellow-800' :
                  test.difficulty === 'advanced' ? 'naxatw-bg-orange-100 naxatw-text-orange-800' :
                  'naxatw-bg-red-100 naxatw-text-red-800'
                }`}>
                  {test.difficulty}
                </span>
                <span className="naxatw-text-lg naxatw-font-bold naxatw-text-primary">
                  ${test.price}
                </span>
              </div>
              
              <div className="naxatw-flex naxatw-justify-between naxatw-text-sm naxatw-text-gray-500">
                <span>{test.total_questions || 0} questions</span>
                <span>{test.duration_minutes || 0} minutes</span>
              </div>
            </div>
          ))}
        </div>

        {mockTests.length === 0 && !loading && (
          <div className="naxatw-text-center naxatw-text-gray-500 naxatw-mt-8">
            <div className="naxatw-bg-gray-50 naxatw-border naxatw-border-gray-200 naxatw-rounded-lg naxatw-p-6">
              <div className="naxatw-w-16 naxatw-h-16 naxatw-bg-gray-100 naxatw-rounded-full naxatw-flex naxatw-items-center naxatw-justify-center naxatw-mx-auto naxatw-mb-4">
                <svg className="naxatw-w-8 naxatw-h-8 naxatw-text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-gray-800 naxatw-mb-2">No Mock Tests Available</h3>
              <p className="naxatw-text-gray-600 naxatw-leading-relaxed">Currently, there are no mock tests available. Please check back later or contact support for more information.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 