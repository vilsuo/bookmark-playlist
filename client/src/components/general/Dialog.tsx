import { MouseEvent, useEffect, useRef } from 'react';

// source
// https://dev.to/elsyng/react-modal-dialog-using-html-dialog-element-5afk

const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
  const r = element.getBoundingClientRect();

  return (
    e.clientX > r.left &&
    e.clientX < r.right &&
    e.clientY > r.top &&
    e.clientY < r.bottom
  );
};

type DialogModal = {
  title: string;
  isOpen: boolean;
  onProceed: () => void;
  onClose: () => void;
  children: React.ReactNode;
};

const DialogModal = ({
  title,
  isOpen,
  onProceed,
  onClose,
  children,
}: DialogModal) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
      document.body.classList.add("modal-open"); // prevent bg scroll
    } else {
      ref.current?.close();
      document.body.classList.remove("modal-open");
    }
  }, [isOpen]);

  const proceedAndClose = () => {
    onProceed();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) =>
        ref.current && !isClickInsideRectangle(e, ref.current) && onClose()
      }
    >
      <div className="header">
        <h3>{title}</h3>
        <button onClick={onClose}>&#x2715;</button>
      </div>

      {children}

      <div>
        <button onClick={proceedAndClose}>Proceed</button>
      </div>
    </dialog>
  );
};

export default DialogModal;