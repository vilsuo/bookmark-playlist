import SideBarBase from "./SideBarBase";

interface ResizeableBarProps {
  close: () => void;
}

const ResizeableBar = ({ close }: ResizeableBarProps) => {
  return (
    <SideBarBase
      minWidth={300}
      width={500}
      close={close}
      header={<h2>ResizeableBar</h2>}
      content={
        <div>
          <p>Lorem ipsum...</p>
        </div>
      }
    />
  );
};

export default ResizeableBar;
