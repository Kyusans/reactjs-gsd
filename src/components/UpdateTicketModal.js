import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Container, FloatingLabel, Form, Modal, Row, Spinner } from 'react-bootstrap'
import AlertScript from './AlertScript';

function UpdateTicketModal(props) {
  const { show, onHide, compId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [locationCategoryId, setLocationCategoryId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [locationCategory, setLocationCategory] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState([]);
  const [validated, setValidated] = useState(false);
  const [filteredLocation, setFilteredLocation] = useState([]);

  //for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const updateTicket = () => {
    setIsLoading(true);
    setShowAlert(false);
    const url = localStorage.getItem("url") + "users.php";
    const jsonData = {
      subject: subject,
      compId: compId,
      locationId: locationId,
      locationCategoryId: locationCategoryId,
      description: description,
      endDate: endDate,
    };
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "updateTicket");
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data === 5) {
          getAlert("danger", "End date cannot be earlier than today's date");
        } else if (res.data === 0) {
          getAlert("success", "No changes made");
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          getAlert("success", "Success");
          setTimeout(() => {
            handleClose();
          }, 1500);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        getAlert("There was an unexpected error: " + err);
        setIsLoading(false);
      });
  }

  const getSelectedComplaint = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "users.php";
      const jsonData = { compId: compId };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getSelectedComplaint");
      const res = await axios({ url: url, data: formData, method: "post" });
      // console.log("res ni getSelectedComplaint", JSON.stringify(res.data));
      if (res.data !== 0) {
        setLocationId(res.data.comp_locationId);
        setLocationCategoryId(res.data.comp_locationCategoryId);
        setSubject(res.data.comp_subject);
        setDescription(res.data.comp_description);
        setEndDate(res.data.comp_end_date);
        setIsLoading(false);
      }
    } catch (error) {

    }
  }, [compId])

  const getLocationCategory = useCallback(async () => {
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getLocationCategory");
      const response = await axios({
        url: url,
        data: formData,
        method: "post"
      });
     // console.log("res ni category", JSON.stringify(response.data));
      if (response.data !== 0) {
        setLocationCategory(response.data);
      }
    } catch (error) {
      getAlert("danger", "There was an unexpected error: " + error);
    }
  }, []);

  const getLocation = () => {
    const url = localStorage.getItem("url") + "admin.php";
    const formData = new FormData();
    formData.append("operation", "getAllLocation");

    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
       // console.log("res ni location", JSON.stringify(res.data));
        if (res.data !== 0) {
          setLocation(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };

  function handleClose() {
    setValidated(false);
    setSubject("");
    setLocationId("");
    setLocationCategoryId("");
    setDescription("");
    setShowAlert(false);
    setEndDate("");
    onHide();
  }

  const formValidation = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === true) {
      updateTicket();
    }
    setValidated(true);
  }

  function handleOnChangeCategory(id) {
    setLocationCategoryId(id);
  }

  useEffect(() => {
    const filterData = location.filter(item => item.location_categoryId === Number(locationCategoryId));
    setFilteredLocation(filterData);
  }, [location, locationCategoryId])
  

  // useEffect(() => {
  //   getLocationCategory();
  //   if (locationCategoryId !== "") {
  //     // setLocationId("");
  //     getLocation(locationCategoryId);
  //   }
  // }, [getLocationCategory, locationCategoryId]);


  useEffect(() => {
    if (show) {
      setIsLoading(true);
      getSelectedComplaint();
      getLocation();
      getLocationCategory();
    }
  }, [getLocationCategory, getSelectedComplaint, show]);

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>Update Ticket Form</Modal.Header>
        <Modal.Body>
          <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
          {isLoading ?
            <Container className='text-center'><Spinner variant='success' size='lg' /></Container>
            :
            <Form noValidate validated={validated} onSubmit={formValidation}>
              <Form.Group className='mb-3'>
                <FloatingLabel label="Subject">
                  <Form.Control type='text' value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Subject' autoFocus required />
                  <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group className='mb-3'>
                <FloatingLabel label="Description">
                  <Form.Control
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Description'
                    style={{ height: '100px' }}
                    as='textarea'
                    required
                  />
                  <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Row className='g2'>
                <Form.Group as={Col} className='mb-4'>
                  <FloatingLabel label="Location Category">
                    <Form.Select value={locationCategoryId} onChange={e => handleOnChangeCategory(e.target.value)} required>
                      <option disabled={locationCategoryId !== "" ? true : false} value="">Open this select menu</option>
                      {locationCategory.map((locationCateg, index) => (
                        <option key={index} value={locationCateg.locCateg_id}>{locationCateg.locCateg_name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group as={Col}>
                  {locationCategoryId && (
                    <>
                      <FloatingLabel label="Location">
                        <Form.Select value={locationId} onChange={e => setLocationId(e.target.value)} required>
                          <option value={""}>Open this select menu</option>
                          {filteredLocation.map((locations, index) => (
                            <option key={index} value={locations.location_id}>{locations.location_name}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>This field is required</Form.Control.Feedback>
                      </FloatingLabel>
                    </>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Row>
                    <Container>
                      <FloatingLabel controlId="endDateLabel" label="End Date">
                        <Form.Control type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                      </FloatingLabel>
                    </Container>
                  </Row>
                </Form.Group>
              </Row>
              <Modal.Footer>
                <Button variant='outline-danger' onClick={handleClose}>Close</Button>
                <Button variant='outline-success' type='submit'>Submit</Button>
              </Modal.Footer>
            </Form>
          }

        </Modal.Body>
      </Modal>

    </>
  )
}

export default UpdateTicketModal