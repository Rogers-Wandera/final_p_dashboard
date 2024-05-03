import { Card } from "react-bootstrap";
import { persontype } from "../person";

export type MP_sideleftprops = {
  person: persontype;
};

const ManagePersonSideLeft = ({ person }: MP_sideleftprops) => {
  return (
    <Card>
      <Card.Header>
        <div className="header-title">
          <h4 className="card-title d-flex justify-content-between">
            <span>About</span>
          </h4>
        </div>
      </Card.Header>
      <Card.Body>
        <ul className="list-inline m-0 p-0">
          <li className="d-flex mb-2 justify-content-between">
            First Name: {person.firstName}
          </li>
          <li className="d-flex mb-2 justify-content-between">
            Last Name: {person.lastName}
          </li>
          <li className="d-flex mb-2 justify-content-between">
            NIN: {person.nationalId}
          </li>
          <li className="d-flex mb-2 justify-content-between">
            Gender: {person.gender}
          </li>
          <li className="d-flex mb-2 justify-content-between">
            Status: {person.status}
          </li>
          <li className="d-flex mb-2 justify-content-between">
            Created By: {person.createdByName}
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
};

export default ManagePersonSideLeft;
