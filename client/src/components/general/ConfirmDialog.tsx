import DragDialog from "./DragDialog";

interface ConfirmDialogProps {
  title: string;
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  children: React.ReactNode;
  dataTestId?: string;
};

const ConfirmDialog = ({ title, isOpen, onConfirm, onCancel, children, dataTestId }: ConfirmDialogProps) => {
  return (
    <DragDialog
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
      dataTestId={dataTestId}
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
