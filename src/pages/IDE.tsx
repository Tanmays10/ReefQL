import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Editor } from "../components/Editor";

export function IDE() {
  return (
    <>
      <Container>
        <Row>
          <Col><Editor /></Col>
        </Row>
      </Container>
    </>
  );
}