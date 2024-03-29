import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';

function UpdateLocation(props) {
  const { locationName, onCancel, id } = props;
  const [newLocationName, setNewLocationName] = useState(locationName);
  const [isLoading, setIsLoading] = useState(false);

  const updateLocation = async () => {
    try {
      setIsLoading(true);
      const url = localStorage.getItem("url") + "admin.php";
      const jsonData = { newLocationName: newLocationName, locationId: id };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "updateLocation");
      await axios({ url: url, data: formData, method: "post" });
      onCancel();
    } catch (error) {
      alert("There was an unexpected error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (newLocationName === "") {
      onCancel();
    } else {
      updateLocation();
    }
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <div>
      <Form>
        <Container as={Row}>
          <Col>
            <Form.Control
              type='text'
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
            />
          </Col>
        </Container>
        <Container as={Row} className='mt-1 mb-1'>
          <Col>
            <Button
              variant='primary'
              onClick={handleSaveClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner
                  animation='border'
                  size='sm'
                  role='status'
                  className='me-2'
                />
              ) : null}
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button variant='danger' onClick={handleCancelClick} className='ms-1'>
              Cancel
            </Button>
          </Col>
        </Container>
      </Form>
    </div>
  );
}

export default UpdateLocation;
