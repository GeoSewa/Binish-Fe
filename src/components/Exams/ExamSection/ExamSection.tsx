import Icon from "@Components/common/Icon";

export default function ExamSection() {
  return (
    <section className="naxatw-h-full naxatw-p-4">
      <div className="naxatw-h-[80%] naxatw-flex naxatw-items-center naxatw-justify-center">
        <div className="naxatw-flex naxatw-flex-col naxatw-items-center naxatw-gap-2">
          <Icon name="delete_forever" className="naxatw-text-[10em]" />
          <h6>Exams not available at the moment go to form section</h6>
        </div>
      </div>
    </section>
  );
}
