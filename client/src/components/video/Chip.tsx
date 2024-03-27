
interface ChipProps {
  className: string;
  text: string;
  value: string;
}

const Chip = ({ className, text, value }: ChipProps) => {
  return (
    <div className="chip">
      {text}: <span className={className}>{value}</span>
    </div>
  );
};

export default Chip;
