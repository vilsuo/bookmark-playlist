interface SettingsCheckboxProps {
  value: boolean;
  toggle: () => void;
  label: string;
  details?: string;
}

const SettingsCheckbox = ({ value, toggle, label, details }: SettingsCheckboxProps) => {

  return (
    <div className="settings-checkbox">
      <label>
        <input type='checkbox'
          checked={value}
          onChange={toggle}
        />
        {label}
      </label>
      <p>{details}</p>
    </div>
  );
};

export default SettingsCheckbox;
