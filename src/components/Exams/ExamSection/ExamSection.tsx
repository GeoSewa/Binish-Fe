import ExamCard from "../ExamCard";

export default function ExamSection() {
  return (
    <section className="naxatw-h-full naxatw-p-4">
      <div className="naxatw-h-full">
        <h6>These are the currently available exams:</h6>
        <div className="naxatw-mt-6">
          <ExamCard />
        </div>
      </div>
    </section>
  );
}
