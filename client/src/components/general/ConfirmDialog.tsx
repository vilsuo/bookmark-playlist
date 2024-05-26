import DragDialog from "./DragDialog";

interface ConfirmDialogProps {
  title: string;
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  children: React.ReactNode;
};

const ConfirmDialog = ({ title, isOpen, onConfirm, onCancel, children }: ConfirmDialogProps) => {
  return (
    <DragDialog
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <div className="dialog-body">
        { children }
        <div className="options">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </DragDialog>
  );
};

export default ConfirmDialog;
