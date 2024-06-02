import { memo } from "react";
import { useDispatch } from "react-redux";
import SettingAction from "../../../store/setting/actions";

const CheckboxBtn = memo((props: any) => {
  const dispatch = useDispatch();
  const checkboxCheckValue = (selector: any, value: any) => {
    if (selector.includes(value)) {
      return true;
    }
    return false;
  };

  const changeDispatch = () => {
    const value = props.value;
    if (checkboxCheckValue(props.defaultChecked, props.value)) {
      dispatch(
        SettingAction[props.btnName as keyof typeof SettingAction]([
          ...props.defaultChecked.filter((item: any) => item !== value),
        ])
      );
    } else {
      dispatch(
        SettingAction[props.btnName as keyof typeof SettingAction]([
          ...props.defaultChecked,
          value,
        ])
      );
    }
  };
  return (
    <div className={`${props.className}`}>
      <input
        type="checkbox"
        value={props.value}
        className={props.type === "switch" ? "form-check-input" : "btn-check"}
        name={props.btnName}
        id={props.id}
        autoComplete="off"
        defaultChecked={checkboxCheckValue(props.defaultChecked, props.value)}
        onClick={changeDispatch}
      />
      <label
        className={`btn btn-border d-block ${props.labelclassName}`}
        htmlFor={props.id}
      >
        {props.children}
      </label>
      {props.imgComponent ? (
        <span className="mt-2"> {props.label || ""} </span>
      ) : (
        ""
      )}
    </div>
  );
});

CheckboxBtn.displayName = "CheckboxBtn";
export default CheckboxBtn;
