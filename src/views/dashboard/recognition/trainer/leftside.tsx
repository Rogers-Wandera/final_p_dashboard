import { Card, Col } from "react-bootstrap";
import { evaluationtype } from "./trainertypes";
import { format } from "date-fns";

export type MP_sideleftprops = {
  current: evaluationtype;
};

const TrainerLeftSide = ({ current }: MP_sideleftprops) => {
  return (
    <Col lg="4" className="col-g-4">
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title d-flex justify-content-between">
              <span>Current Reading</span>
            </h4>
          </div>
        </Card.Header>
        <Card.Body>
          <ul className="list-inline m-0 p-0">
            <li className="d-flex mb-2 justify-content-between">
              Model Name: {current.modelName}
            </li>
            <li className="d-flex mb-2 justify-content-between">
              Status: {current.status} Model
            </li>
            <li className="d-flex mb-2 justify-content-between">
              Trained By: {current.userName}
            </li>
            <li className="d-flex mb-2 justify-content-between">
              {current.trainAccuracy}
            </li>
            <li className="d-flex mb-2 justify-content-between">
              {current.trainLoss}
            </li>
            <li className="d-flex mb-2 justify-content-between">
              {current.testAccuracy}
            </li>
            <li className="d-flex mb-2 justify-content-between">
              {current.testLoss}
            </li>
            <li className="d-flex mb-2 justify-content-between">
              Training Date:{" "}
              {current.creationDate &&
                format(current.creationDate, "yyyy-MM-dd H:mm:ss")}
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TrainerLeftSide;
