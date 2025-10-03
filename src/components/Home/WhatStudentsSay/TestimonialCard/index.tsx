const TestimonialCard = (card: Record<string, any>) => {
  const { image, student, quote, organization } = card;

  return (
    <div className="testimonial-card naxatw-cursor-default naxatw-shadow-lg naxatw-rounded-xl naxatw-border naxatw-border-solid naxatw-border-[#E7EAEE] naxatw-bg-white naxatw-p-8 naxatw-text-center naxatw-h-full naxatw-flex naxatw-flex-col naxatw-min-h-[420px] md:naxatw-min-h-[460px]">
      <div className="image-container naxatw-mx-auto naxatw-mb-10 naxatw-h-16 naxatw-w-16">
        <img
          src={image}
          alt={student}
          width={100}
          height={100}
          className="naxatw-rounded-[50%] naxatw-object-cover naxatw-object-center"
        />
      </div>
      <div className="text-container naxatw-flex naxatw-flex-col naxatw-flex-1">
        <div className="description naxatw-mb-10 naxatw-flex-1">
          <p className="naxatw-text-base naxatw-leading-7 naxatw-tracking-[-0.01125rem] naxatw-text-[#07090D]">
            {quote}
          </p>
        </div>
        <div className="cutomer-details">
          <p className="naxatw-text-base naxatw-font-medium naxatw-leading-6 naxatw-tracking-[-0.03rem] naxatw-text-[#07090D]">
            {student}
          </p>
          <span className="naxatw-text-[0.875rem] naxatw-leading-6 naxatw-tracking-[-0.00875rem] naxatw-text-[#818A9C]">
            {organization}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
