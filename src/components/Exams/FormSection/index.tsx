import Icon from "@Components/common/Icon";

export default function FormSection() {
  return (
    <section className="naxatw-h-full naxatw-w-full naxatw-p-4">
      <div className="naxatw-flex naxatw-flex-col naxatw-gap-4 md:naxatw-flex-row">
        <div
          className="naxatw-w-[20rem] naxatw-cursor-pointer naxatw-border-primary naxatw-flex naxatw-h-[4rem] naxatw-gap-2 naxatw-justify-center naxatw-items-center naxatw-p-4 naxatw-border naxatw-rounded-md"
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSdXQT4kRARLykvhLpgBpcbl-th53jy3FhIxNuOiXyMrzzQJ0g/viewform?usp=send_form",
              "_blank"
            )
          }
        >
          <Icon
            name="summarize"
            className="naxatw-text-[10em] naxatw-text-primary"
          />
          <h5>Geomatics License Exam Form</h5>
        </div>

        <div
          className="naxatw-w-[20rem] naxatw-cursor-pointer naxatw-border-primary naxatw-flex naxatw-h-[4rem] naxatw-gap-2 naxatw-justify-center naxatw-items-center naxatw-p-4 naxatw-border naxatw-rounded-md"
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSeQR75qH2RwHNX0SoYtZKPATa4vYzlVI6N0zbP0GQu93JE3mw/viewform",
              "_blank"
            )
          }
        >
          <Icon
            name="summarize"
            className="naxatw-text-[10em] naxatw-text-primary"
          />
          <h5>Amin LokSewa Exam Form</h5>
        </div>
      </div>
    </section>
  );
}
