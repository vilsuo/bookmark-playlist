import { useCallback, useEffect, useRef, useState } from "react";

type ToggleDialogProps = {
  title: string;
  isOpen: boolean;
  onProceed: () => void;
  onClose: () => void;
  children: React.ReactNode;
};

const ToggleDialog = ({
  title,
  isOpen,
  onProceed,
  onClose,
  children,
}: ToggleDialogProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      elementRef.current?.showModal();
      document.body.classList.add("modal-open"); // prevent bg scroll
    } else {
      elementRef.current?.close();
      document.body.classList.remove("modal-open");
    }
  }, [isOpen]);

  const onMouseDown = useCallback(
    (event) => {
      const onMouseMove = (event: MouseEvent) => {
        position.x += event.movementX;
        position.y += event.movementY;
        const element = elementRef.current;
        if (element) {
          element.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }
        setPosition(position);
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [position, setPosition, elementRef]
  );

  const proceedAndClose = () => {
    onProceed();
    onClose();
  };

  return (
    <dialog className="draggable" ref={elementRef}>
      <div className="header" onMouseDown={onMouseDown}>
        <h3>{title}</h3>
        <button onClick={onClose}>&#x2715;</button>
      </div>

      {children}

      <div className="options">
        <button onClick={proceedAndClose}>Ok</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </dialog>
  );
};

export default ToggleDialog;
