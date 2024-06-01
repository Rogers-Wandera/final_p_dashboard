import { Row } from "react-bootstrap";
import TrainerLeftSide from "./leftside";
import TrainerTable from "./trainertable";
import { evaluationtype } from "./trainertypes";

export type imagetrainer = {
  current: evaluationtype;
  type: "Audio" | "Image";
  token: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
};
const ImageTrainer = ({
  current,
  type,
  token,
  setReload,
  reload,
}: imagetrainer) => {
  return (
    <Row>
      <TrainerLeftSide current={current} />
      <TrainerTable
        type={type}
        token={token}
        setReload={setReload}
        reload={reload}
      />
    </Row>
  );
};

export default ImageTrainer;
