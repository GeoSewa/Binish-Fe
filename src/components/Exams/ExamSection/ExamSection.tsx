import Icon from "@Components/common/Icon";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";
import MockTests from "../MockTests";
import MCQTest from "../MCQTest";
import HistoryModal from "../HistoryModal";
import { useState } from "react";

export default function ExamSection() {
  const dispatch = useTypedDispatch();
  const examView = useTypedSelector((state) => state.common.examView);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleMockTestClick = () => {
    dispatch(setCommonState({ examView: 'mock-tests' }));
  };

  const handleHistoryClick = () => {
    setShowHistoryModal(true);
  };

  // Render different views based on examView state
  if (examView === 'mock-tests') {
    return <MockTests />;
  }
  
  if (examView === 'mcq-test') {
    return <MCQTest />;
  }

  return (
    <section className="naxatw-h-full naxatw-w-full naxatw-p-4">
      {/* Both buttons on the same line with reduced gap */}
      <div className="naxatw-flex naxatw-justify-between naxatw-items-start naxatw-pt-2">
        {/* Mock Test Button - Left side */}
        <div
          className="naxatw-w-[20rem] naxatw-cursor-pointer naxatw-border-primary naxatw-flex naxatw-h-[4rem] naxatw-gap-1 naxatw-justify-center naxatw-items-center naxatw-p-4 naxatw-border naxatw-rounded-md"
          onClick={handleMockTestClick}
        >
          <Icon
            name="edit_note"
            className="naxatw-text-[10em] naxatw-text-primary"
          />
          <h5>Live Mock Test</h5>
        </div>
        
        {/* History Button - Right side */}
        <button
          onClick={handleHistoryClick}
          className="naxatw-bg-primary naxatw-text-white naxatw-px-4 naxatw-py-2 naxatw-rounded-lg naxatw-font-medium hover:naxatw-bg-secondary naxatw-transition-colors naxatw-flex naxatw-items-center naxatw-gap-2 naxatw-shadow-md"
        >
          <Icon name="history" className="naxatw-text-white" />
          History
        </button>
      </div>
      
      {/* History Modal */}
      {showHistoryModal && (
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </section>
  );
}
