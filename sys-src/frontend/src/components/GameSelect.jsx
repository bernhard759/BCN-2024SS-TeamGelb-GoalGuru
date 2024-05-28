import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

function GameSelect() {
  return (
    <>
      <div>game select</div>
      <Form.Select aria-label="Default select example">
        <option>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
      <Form.Select aria-label="Default select example">
        <option>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
      <Button variant="primary">Primary</Button>
    </>
  );
}

export default GameSelect;
