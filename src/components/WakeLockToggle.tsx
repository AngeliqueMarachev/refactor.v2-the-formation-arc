import { Switch } from "@/components/ui/switch";

interface WakeLockToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  isSupported: boolean;
  className?: string;
}

const WakeLockToggle = ({ enabled, onToggle, isSupported, className = "" }: WakeLockToggleProps) => {
  if (!isSupported) return null;

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-heading">Keep screen awake</span>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      <p className="text-xs text-text-supporting mt-1">
        Prevents screen from sleeping during this session
      </p>
    </div>
  );
};

export default WakeLockToggle;
