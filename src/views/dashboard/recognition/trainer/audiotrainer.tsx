import { Row } from "react-bootstrap";
import TrainerLeftSide from "./leftside";
import { evaluationtype } from "./trainertypes";
import TrainerTable from "./trainertable";

export type audiotrainer = {
  current: evaluationtype;
  type: "Audio" | "Image";
  token: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
};

const AudioTrainer = ({
  current,
  type,
  token,
  setReload,
  reload,
}: audiotrainer) => {
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

export default AudioTrainer;
