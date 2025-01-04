import Tab from "@Components/common/Tab";
import { useTypedDispatch, useTypedSelector } from "@Store/hooks";
import { getExamQuestions } from "@Services/exam";
import { useQuery } from "@tanstack/react-query";
import { examTabOptions } from "@Constants/exam";
import { setCommonState } from "@Store/actions/common";

export default function Exams() {
  const dispatch = useTypedDispatch();

  const activeExamTab = useTypedSelector((state) => state.common.activeExamTab);

  const { data: examQuestions } = useQuery({
    queryKey: ["exam-questions"],
    queryFn: () => getExamQuestions({ set: 1 }),
    select: (res) => res.data,
  });

  return (
    <main className="notes naxatw-h-screen-nav naxatw-w-full naxatw-bg-white">
      <div className="naxatw-container naxatw-py-4">
        <Tab
          orientation="row"
          clickable
          onTabChange={(data) => {
            dispatch(setCommonState({ activeExamTab: data }));
          }}
          tabOptions={examTabOptions}
          activeTab={activeExamTab}
        />
      </div>
    </main>
  );
}
