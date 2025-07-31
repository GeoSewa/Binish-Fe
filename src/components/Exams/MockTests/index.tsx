import React, { useEffect, useState } from "react";
import Icon from "@Components/common/Icon";
import { useTypedDispatch } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";

interface MockTest {
  id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  price?: string;
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
    setLoading(true);
    setError(null);
    fetch("https://sujanadh.pythonanywhere.com/api/exams/sets/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setMockTests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error loading mock tests");
        setLoading(false);
      });
  }, []);

  const handleMockClick = async (mockId: number) => {
    setStartingAttempt(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No access token found. Please login again.');
      const res = await fetch(`https://sujanadh.pythonanywhere.com/api/exams/sets/${mockId}/start/`, {
        method: 'POST',
        credentials: 'include', // send cookies if needed
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to start attempt');
      const data = await res.json();
      // Assume response contains attempt_id
      const attemptId = data.attempt_id || data.id || data.attempt || null;
      if (!attemptId) throw new Error('No attempt id returned');
      dispatch(setCommonState({
        examView: 'mcq-test',
        selectedMockTest: mockId,
        attemptId: attemptId,
      }));
    } catch (err) {
      setError('Failed to start attempt');
    }
    setStartingAttempt(false);
  };

  if (loading) return <div className="naxatw-p-8">Loading...</div>;
  if (startingAttempt) return <div className="naxatw-p-8">Starting attempt...</div>;
  if (error) return <div className="naxatw-p-8">{error}</div>;

  return (
    <section className="naxatw-h-full naxatw-w-full naxatw-p-4">
      <div className="naxatw-max-w-4xl naxatw-mx-auto naxatw-mt-8">
        <h2 className="naxatw-text-2xl naxatw-font-semibold naxatw-mb-6">Available Mock Tests</h2>
        <div className="naxatw-grid naxatw-gap-6 naxatw-grid-cols-1 md:naxatw-grid-cols-2 lg:naxatw-grid-cols-3">
          {mockTests.map((mock) => (
            <div
              key={mock.id}
              onClick={() => handleMockClick(mock.id)}
              className="naxatw-cursor-pointer naxatw-border-primary naxatw-border naxatw-rounded-lg naxatw-p-6 naxatw-flex naxatw-flex-col naxatw-items-center naxatw-gap-4 hover:naxatw-shadow-lg naxatw-transition-shadow"
            >
              <Icon
                name="quiz"
                className="naxatw-text-[3rem] naxatw-text-primary"
              />
              <h3 className="naxatw-text-xl naxatw-font-medium">{mock.title}</h3>
              <p className="naxatw-text-gray-600 naxatw-text-center">
                {mock.total_questions ? `${mock.total_questions} Questions` : mock.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 