import Icon from "@Components/common/Icon";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { setCommonState } from "@Store/actions/common";
import MockTests from "../MockTests";
import MCQTest from "../MCQTest";

export default function ExamSection() {
  const dispatch = useTypedDispatch();
  const examView = useTypedSelector((state) => state.common.examView);

  const handleMockTestClick = () => {
    dispatch(setCommonState({ examView: 'mock-tests' }));
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
      <div
        className="naxatw-w-[20rem] naxatw-cursor-pointer naxatw-border-primary naxatw-flex naxatw-h-[4rem] naxatw-gap-1 naxatw-justify-center naxatw-items-center naxatw-p-4 naxatw-border naxatw-rounded-md"
        onClick={handleMockTestClick}
      >
        <Icon
          name="edit_note"
          className="naxatw-text-[10em] naxatw-text-primary"
        />
        <h5>Geomatics License Mock Test</h5>
      </div>
    </section>
  );
}
