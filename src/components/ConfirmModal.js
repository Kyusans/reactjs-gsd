import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, FloatingLabel, Form, ListGroup, Modal, Spinner } from 'react-bootstrap';
import AlertScript from './AlertScript';

const ConfirmModal = (props) => {
  const { show, hide, compId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [equipmentValid, setEquipmentValid] = useState(true);
  const [selectedOperation, setSelectedOperation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [item, setItem] = useState("");
  const [otherEquipment, setOtherEquipment] = useState("");
  const [validated, setValidated] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [operationData, setOperationData] = useState([]);

  const handleHide = () => {
    setEquipmentValid(true);
    setIsSubmitted(false);
    setOtherEquipment("");
    setEquipments([]);
    setIsOther(false);
    setShowAlert(false);
    setIsLoading(false);
    setRemarks("");
    setSelectedOperation("");
    setItem("");
    setValidated(false);
    setSelectedEquipment([]);
    hide();
  };

  const handleEquipmentChange = (selectedEquipmentTarget) => {
    setItem(selectedEquipmentTarget);
    setIsOther(selectedEquipmentTarget === 'other');

    if (selectedEquipmentTarget !== "other") {
      handleAddEquipment(selectedEquipmentTarget);
    }
  };

  const handleAddEquipment = useCallback((selectedEquipmentId) => {
    if (selectedEquipmentId && selectedEquipmentId !== null && !selectedEquipment.includes(selectedEquipmentId)) {
      setEquipmentValid(true);
      // Find the equipment object with the selectedEquipmentId and get the equip_id
      const equip_id = equipments.find(equipment => equipment.equip_name === selectedEquipmentId).equip_id;
      setSelectedEquipment([...selectedEquipment, { equip_id }]);
    }

    if (!isOther) {
      setOtherEquipment("");
    }
  }, [isOther, selectedEquipment, equipments]);

  const handleRemoveEquipment = (removedEquipmentId) => {
    const updatedEquipmentArray = selectedEquipment.filter(equipment => equipment.equip_id !== removedEquipmentId);
    setSelectedEquipment(updatedEquipmentArray);
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function getAlert(variantAlert, messageAlert) {
    setShowAlert(true);
    setAlertVariant(variantAlert);
    setAlertMessage(messageAlert);
  }

  const jobDone = async () => {
    setIsSubmitted(true);
    try {
      const url = localStorage.getItem("url") + "personnel.php";
      const fullName = localStorage.getItem("userFullName");
      const master = { compId: compId, fullName: fullName, jobOperation: selectedOperation, remarks: remarks, otherEquipment: otherEquipment === "" ? null : otherEquipment };
      const detail = { selectedEquipment: selectedEquipment.map(equipment => equipment.equip_id) };
      const jsonData = { master: master, detail: detail };
      const formData = new FormData();
      formData.append("operation", "jobDone");
      formData.append("json", JSON.stringify(jsonData));

      //console.log("json data ko to", JSON.stringify(jsonData));

      const response = await axios.post(url, formData);

      //console.log("response", JSON.stringify(response));

      if (response.data === 1) {
        getAlert("success", "Job Complete!");
        setTimeout(() => {
          handleHide();
        }, 1000);
      } else {
        getAlert("danger", "Unsuccessful!");
        console.log("There was an unexpected error: " + response.data);
      }
    } catch (err) {
      getAlert("danger", "There was an unexpected error: " + err);
    } finally {
      setIsSubmitted(false);
    }
  };

  const getEquipmentName = (equipId) => {
    const equipmentObject = equipments.find(equipment => equipment.equip_id === equipId);
    return equipmentObject ? equipmentObject.equip_name : 'Unknown Equipment';
  };


  const getOperation = useCallback( async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getOperation");

      const res = await axios.post(url, formData);
      //console.log("res ni getEquipment", JSON.stringify(res.data));

      if (res.data !== 0) {
        setOperationData(res.data);
      } else {
        getAlert("danger", "No operation found");
        console.log("There was an unexpected error: " + res.data);
      }
    } catch (error) {
      getAlert("danger", "There was an error occurred: " + error);
    } finally {
      setIsLoading(false);
    }
  },[]);

  const getEquipment = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = localStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getEquipment");

      const res = await axios.post(url, formData);
      //console.log("res ni getEquipment", JSON.stringify(res.data));

      if (res.data !== 0) {
        setEquipments(res.data);
      } else {
        getAlert("danger", "No Equipment yet");
      }
    } catch (error) {
      getAlert("danger", "There was an error occurred: " + error);
    }
  }, []);

  useEffect(() => {
    if (show) {
      getEquipment();
      getOperation();
    }
  }, [getEquipment, getOperation, show]);

  useEffect(() => {
    //console.log("selectedEquipment ko to, ", selectedEquipment);
    handleAddEquipment();
  }, [handleAddEquipment, selectedEquipment]);

  const handleJobDone = (e) => {
    const form = e.currentTarget;
    setValidated(true);
    e.preventDefault();
    e.stopPropagation();
    //console.log("selected equipment length", selectedEquipment.length);

    if (selectedEquipment.length <= 0 && !isOther) {
      setItem("");
      setEquipmentValid(false);
      return;
    } else if (form.checkValidity()) {
      jobDone();
    }
  };

  return (
    <>
      {isLoading ?
        <Container className='text-center'>
          <Spinner variant='success' animation='border' />
        </Container>
        :
        <Modal show={show} className='bg-dark' onHide={handleHide} centered backdrop="static">
          <Form noValidate validated={validated} onSubmit={handleJobDone}>
            <Modal.Header>
              <h4>Confirmation</h4>
            </Modal.Header>
            <Modal.Body>
              <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
              <Container>
                <FloatingLabel label="Operation">
                  <Form.Select className='mb-3' value={selectedOperation} onChange={(e) => setSelectedOperation(e.target.value)} placeholder='Operation' required>
                    <option value={""}>Select operation</option>
                    {operationData.map((operation, index) => (
                      <option key={index} value={operation.operation_id}>{operation.operation_name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>

                <FloatingLabel label='Equipment'>
                  <Form.Select
                    placeholder='Equipment'
                    value={item}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                    required={!isOther}
                  >
                    <option value={""} disabled>Select equipment</option>
                    {equipments.map((equipment, index) => (
                      <option key={index} value={`${equipment.equip_name}`}>
                        {equipment.equip_name}
                      </option>
                    ))}
                    <option value="other">Other..</option>
                  </Form.Select>
                </FloatingLabel>
                {!equipmentValid && (
                  <Form.Text className='text-danger ms-2'>
                    Select at least one equipment
                  </Form.Text>
                )}

                {isOther &&
                  <FloatingLabel label='Other equipment name' className='mt-3'>
                    <Form.Control placeholder='Other equipment name' value={otherEquipment} onChange={(e) => setOtherEquipment(e.target.value)} required />
                  </FloatingLabel>
                }

                <FloatingLabel className='mt-3' label="Remarks">
                  <Form.Control placeholder='Remarks' value={remarks} onChange={(e) => setRemarks(e.target.value)} required />
                </FloatingLabel>

                <ListGroup className='mt-3'>
                  {selectedEquipment.map((equipment, index) => (
                    <ListGroup.Item key={index} className='d-flex justify-content-between align-items-center'>
                      {index + 1}. {equipment.equip_id ? getEquipmentName(equipment.equip_id) : (equipment === "other" ? otherEquipment : equipment)}
                      <Button variant='outline-danger' size='sm' onClick={() => handleRemoveEquipment(equipment.equip_id)}>Remove</Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-secondary' onClick={handleHide}>Close</Button>

              <Button type='submit' variant='outline-success' disabled={isSubmitted}>
                {isSubmitted && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
                Mark as done
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      }
    </>
  );
};

export default ConfirmModal;
