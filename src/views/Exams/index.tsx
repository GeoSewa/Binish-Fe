import Tab from "@Components/common/Tab";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { examTabOptions } from "@Constants/exam";
import { setCommonState } from "@Store/actions/common";
import ExamSection from "@Components/Exams/ExamSection/ExamSection";
import FormSection from "@Components/Exams/FormSection";

const getActiveTabContent = (activeExamTab: string) => {
  switch (activeExamTab) {
    case "exam-section":
      return <ExamSection />;
    case "form-section":
      return <FormSection />;
    default:
      return <ExamSection />;
  }
};

export default function Exams() {
  const dispatch = useTypedDispatch();

  const activeExamTab = useTypedSelector((state) => state.common.activeExamTab);

  return (
    <main className="notes naxatw-h-screen-nav naxatw-w-full naxatw-bg-white">
      <div className="naxatw-container naxatw-py-4 naxatw-h-full naxatw-max-w-7xl">
        <Tab
          orientation="row"
          clickable
          onTabChange={(data) => {
            dispatch(setCommonState({ activeExamTab: data as string }));
          }}
          tabOptions={examTabOptions}
          activeTab={activeExamTab}
        />
        {getActiveTabContent(activeExamTab as string)}
      </div>
    </main>
  );
}
