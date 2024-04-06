import { memo } from "react";
import { useDispatch } from "react-redux";
import SettingAction from "../../../store/setting/actions";

const RadioBtn = memo((props: any) => {
  const dispatch = useDispatch();
  const radioCheckValue = (selector: any, value: any) => {
    if (selector === value) {
      return true;
    }
    return false;
  };
  return (
    <div className={`${props.className}`}>
      <input
        type="radio"
        value={props.value}
        className="btn-check"
        name={props.btnName}
        id={props.id}
        autoComplete="off"
        defaultChecked={radioCheckValue(props.defaultChecked, props.value)}
        onClick={() =>
          dispatch(
            SettingAction[props.btnName as keyof typeof SettingAction](
              props.value
            )
          )
        }
      />
      <label
        className={`btn btn-border  ${props.labelclassName}`}
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

RadioBtn.displayName = "RadioBtn";
export default RadioBtn;
