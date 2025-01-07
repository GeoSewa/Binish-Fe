import Icon from "@Components/common/Icon";

export default function ExamCard() {
  return (
    <div className="naxatw-border-primary naxatw-border naxatw-cursor-pointer naxatw-rounded-md naxatw-flex naxatw-flex-col naxatw-w-fit naxatw-p-4 naxatw-gap-2">
      <Icon
        name="edit_note"
        className="naxatw-text-[4rem] naxatw-text-center naxatw-text-primary"
      />
      <h5 className="naxatw-text-primary">Geomatics License Mock Test</h5>
    </div>
  );
}
