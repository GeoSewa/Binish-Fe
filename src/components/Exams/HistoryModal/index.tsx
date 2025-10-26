import React, { useState, useEffect } from 'react';
import Modal from '@Components/common/Modal';
import { Button } from '@Components/RadixComponents/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@Components/RadixComponents/Table';
import { getExamResultsForAllUsers, getExamResultsForUser } from '@Services/exam';
import useAuthSession from '@Hooks/useAuthSession';
import useUserRole from '@Hooks/useUserRole';
import Icon from '@Components/common/Icon';

interface ExamResult {
  id: string;
  user: number;
  username: string;
  exam_set: number;
  exam_set_title: string;
  score: number;
  total_points: number;
  score_percentage: number;
  is_passed: boolean;
  time_taken: string;
  created_at: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const { isAuthenticated } = useAuthSession();
  const { isSuperUser, loading: roleLoading } = useUserRole();

  const fetchResults = async (dateFilter?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (isSuperUser) {
        // Superuser can see all results with optional date filter
        response = await getExamResultsForAllUsers(dateFilter);
      } else {
        // Normal user can only see their own results
        response = await getExamResultsForUser();
      }
      
      setResults(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch exam results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !roleLoading) {
      fetchResults();
    }
  }, [isOpen, isSuperUser, roleLoading]);

  const handleDateFilter = () => {
    if (selectedDate) {
      fetchResults(selectedDate);
    } else {
      fetchResults();
    }
  };

  const handleClearFilter = () => {
    setSelectedDate('');
    fetchResults();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeTaken = (timeString: string) => {
    // Convert time string like "00:02:04.307695" to readable format
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = Math.floor(parseFloat(parts[2]));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const sortResults = (results: ExamResult[]) => {
    return [...results].sort((a, b) => {
      if (sortBy === 'date') {
        // Sort by date: recent to past (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        // Sort by score: highest to lowest
        return b.score_percentage - a.score_percentage;
      }
    });
  };


  return (
    <Modal show={isOpen} onClose={onClose} title="Exam History">
      <div className="naxatw-p-6">
        {/* Date Filter for Superusers */}
        {isSuperUser && !roleLoading && (
          <div className="naxatw-mb-6 naxatw-p-4 naxatw-bg-gray-50 naxatw-rounded-lg">
            <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-mb-3 naxatw-text-primary">
              Filter by Date
            </h3>
            <div className="naxatw-flex naxatw-gap-3 naxatw-items-end">
              <div className="naxatw-flex-1">
                <label className="naxatw-block naxatw-text-sm naxatw-font-medium naxatw-text-gray-700 naxatw-mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="naxatw-w-full naxatw-px-3 naxatw-py-2 naxatw-border naxatw-border-gray-300 naxatw-rounded-md naxatw-focus:naxatw-outline-none naxatw-focus:naxatw-ring-2 naxatw-focus:naxatw-ring-blue-500"
                />
              </div>
              <Button
                onClick={handleDateFilter}
                disabled={loading}
                className="naxatw-bg-primary naxatw-text-white hover:naxatw-bg-secondary"
              >
                Filter
              </Button>
              <Button
                onClick={handleClearFilter}
                disabled={loading}
                variant="outline"
                className="naxatw-border-primary naxatw-text-primary hover:naxatw-bg-primary hover:naxatw-text-white"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="naxatw-bg-white naxatw-rounded-lg naxatw-border naxatw-border-gray-200">
          <div className="naxatw-px-6 naxatw-py-4 naxatw-border-b naxatw-border-gray-200">
            <div className="naxatw-flex naxatw-justify-between naxatw-items-center">
              <div>
                <h3 className="naxatw-text-lg naxatw-font-semibold naxatw-text-primary">
                  {isSuperUser ? 'All Exam Results' : 'Your Exam Results'}
                </h3>
                <p className="naxatw-text-sm naxatw-text-gray-600 naxatw-mt-1">
                  {isSuperUser 
                    ? 'View all users\' exam results with filtering options'
                    : 'View your personal exam history and performance'
                  }
                </p>
              </div>
              
              {/* Sort Controls */}
              <div className="naxatw-flex naxatw-items-center naxatw-gap-2">
                <label className="naxatw-text-sm naxatw-font-medium naxatw-text-gray-700">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
                  className="naxatw-px-3 naxatw-py-1 naxatw-border naxatw-border-gray-300 naxatw-rounded-md naxatw-text-sm naxatw-focus:naxatw-outline-none naxatw-focus:naxatw-ring-2 naxatw-focus:naxatw-ring-primary"
                >
                  <option value="date">Recent to Past</option>
                  <option value="score">Highest to Lowest</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="naxatw-p-4 naxatw-bg-red-50 naxatw-border naxatw-border-red-200 naxatw-rounded-md naxatw-m-6">
              <div className="naxatw-flex naxatw-items-center">
                <Icon name="error" className="naxatw-text-red-500 naxatw-mr-2" />
                <span className="naxatw-text-red-700">{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="naxatw-flex naxatw-justify-center naxatw-items-center naxatw-py-8">
              <div className="naxatw-animate-spin naxatw-rounded-full naxatw-h-8 naxatw-w-8 naxatw-border-b-2 naxatw-border-primary"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="naxatw-overflow-x-auto">
              <Table className="naxatw-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="naxatw-font-semibold naxatw-text-primary">S.No</TableHead>
                    <TableHead className="naxatw-font-semibold naxatw-text-primary">Username</TableHead>
                    <TableHead className="naxatw-font-semibold naxatw-text-primary">Exam Set Title</TableHead>
                    <TableHead className="naxatw-font-semibold naxatw-text-primary">Exam Date</TableHead>
                    <TableHead className="naxatw-font-semibold naxatw-text-primary">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortResults(results).map((result, index) => (
                    <TableRow key={result.id} className="hover:naxatw-bg-gray-50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{result.username}</TableCell>
                      <TableCell>{result.exam_set_title}</TableCell>
                      <TableCell>{formatDate(result.created_at)}</TableCell>
                      <TableCell>
                        <div className="naxatw-flex naxatw-flex-col">
                          <span className="naxatw-font-semibold naxatw-text-black">
                            {result.score}/{result.total_points}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="naxatw-text-center naxatw-py-8 naxatw-text-gray-500">
              No exam results found
            </div>
          )}
        </div>

        {/* Download PDF Button for Superusers */}
        {isSuperUser && !roleLoading && results.length > 0 && (
          <div className="naxatw-mt-6 naxatw-flex naxatw-justify-end">
            <Button
              onClick={() => {
                // TODO: Implement PDF download functionality
                alert('PDF download functionality will be implemented');
              }}
              className="naxatw-bg-green-500 naxatw-text-white hover:naxatw-bg-green-600 naxatw-flex naxatw-items-center naxatw-gap-2"
            >
              <Icon name="download" />
              Download PDF
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
