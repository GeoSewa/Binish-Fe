import Tab from "@Components/common/Tab";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { examTabOptions } from "@Constants/exam";
import { setCommonState } from "@Store/actions/common";
import ExamSection from "@Components/Exams/ExamSection/ExamSection";
import FormSection from "@Components/Exams/FormSection";
import { useQuery } from "@tanstack/react-query";
import { getExamQuestions } from "@Services/exam";

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

  useQuery({ queryKey: ["key"], queryFn: () => getExamQuestions({ set: 1 }) });

  return (
    <main className="notes naxatw-h-screen-nav naxatw-w-full naxatw-bg-white">
      <div className="naxatw-container naxatw-py-4 naxatw-h-full">
        <Tab
          orientation="row"
          clickable
          onTabChange={(data) => {
            dispatch(setCommonState({ activeExamTab: data }));
          }}
          tabOptions={examTabOptions}
          activeTab={activeExamTab}
        />
        {getActiveTabContent(activeExamTab as string)}
      </div>
    </main>
  );
}
