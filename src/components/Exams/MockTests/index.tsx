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

  useEffect(() => {
    const fetchMockTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getExamSets();
        setMockTests(response.data);
      } catch (err) {
        setError("Error loading mock tests");
        console.error("Error fetching mock tests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMockTests();
  }, []);

  const handleMockClick = async (mockId: number) => {
    setStartingAttempt(true);
    setError(null);
    
    try {
      const response = await startExamAttempt(mockId);
      const attemptId = response.data.attempt_id || response.data.id || response.data.attempt;
      
      if (!attemptId) {
        throw new Error('No attempt id returned from server');
      }
      
      dispatch(setCommonState({
        examView: 'mcq-test',
        selectedMockTest: mockId,
        attemptId: attemptId.toString(),
      }));
    } catch (err: any) {
      console.error("Error starting attempt:", err);
      setError(err.response?.data?.message || 'Failed to start attempt. Please try again.');
    } finally {
      setStartingAttempt(false);
    }
  };

  if (loading) return <div className="naxatw-p-8">Loading mock tests...</div>;
  if (startingAttempt) return <div className="naxatw-p-8">Starting attempt...</div>;
  if (error) return (
    <div className="naxatw-p-8">
      <div className="naxatw-text-red-500 naxatw-mb-4">{error}</div>
      <button 
        onClick={() => window.location.reload()} 
        className="naxatw-bg-primary naxatw-text-white naxatw-py-2 naxatw-px-4 naxatw-rounded-md"
      >
        Retry
      </button>
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
            No mock tests available at the moment.
          </div>
        )}
      </div>
    </section>
  );
} 