import { FlexColumn, FlexRow } from "@Components/common/Layouts";
import LandingPageImage from "@Assets/images/landing-image.svg";
import Image from "@Components/RadixComponents/Image";

export default function LandingSection() {
  return (
    <section className="home naxatw-bg-primary naxatw-w-full naxatw-h-auto md:naxatw-h-[35rem]">
      <FlexRow className="naxatw-container naxatw-h-full naxatw-items-center naxatw-justify-between naxatw-py-10 md:naxatw-py-0">
        <FlexColumn gap={6}>
          <div className="naxatw-animate-fade-up">
            <h1 className="naxatw-text-white naxatw-text-4xl md:naxatw-text-[5rem]">GeoSewa</h1>
            <p className="naxatw-text-white naxatw-tracking-widest naxatw-text-sm md:naxatw-text-[1.15rem] naxatw-mt-2 md:naxatw-mt-3 naxatw-ml-1 md:naxatw-ml-3">
              Your Spatial Reference!
            </p>
          </div>
          <p className="naxatw-text-white naxatw-text-base md:naxatw-text-[1.5rem] naxatw-ml-1 md:naxatw-ml-3 naxatw-animate-fade-up">
            Unlock your potential with notes and mock exam mastery!!
          </p>
        </FlexColumn>
        <Image
          src={LandingPageImage}
          width={260}
          className="naxatw-animate-fade-up naxatw-hidden sm:naxatw-flex md:naxatw-flex md:naxatw-w-[400px]"
        />
      </FlexRow>
    </section>
  );
}
