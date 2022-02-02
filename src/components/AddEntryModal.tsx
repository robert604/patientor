import React from 'react';
import {Modal,Button,Segment} from 'semantic-ui-react';
import {Formik,Form,Field} from 'formik';
import {TextField,SelectField,DiagnosisSelection,OptionForSelect,OptionForSelectNum} from '../AddPatientModal/FormField';
import { HealthCheckRating,EntryType, EntryWithoutId } from '../types';
import { useStateValue } from '../state';
import { isString,isDate } from '../utils';

const healthCheckRatingOptions: OptionForSelectNum[] = [
  { value:HealthCheckRating.Healthy, label:'Healthy'},
  { value:HealthCheckRating.LowRisk, label:'Low Risk'},
  { value:HealthCheckRating.HighRisk, label:'High Risk'},
  { value:HealthCheckRating.CriticalRisk, label:'Critical Risk'}
];

const typeOptions: OptionForSelect[] = [
  { value:EntryType.HealthCheck, label:"HealthCheck"},
  //{ value:"OccupationalHealthcare", label:"OccupationalHealthcare"},
  //{ value:"Hospital", label:"Hospital"},
];

interface Props {
  open:boolean,
  error:string | undefined,
  onCancel: () => void,
  onSubmit: (values:EntryWithoutId) => void,
}

const AddEntryModal = (props:Props) => {

  const [{ diagnoses }] = useStateValue();
  const validate = (values:any) => {
    const requiredError = "Field is required";
    const errors: { [field: string]: string } = {};
    if (!values.description) {
      errors.description = requiredError;
    }
    if (!values.date) {
      errors.date = requiredError;
    } else if(!isString(values.date) || !isDate(values.date)) {
      errors.date = 'Invalid date format';
    }
    if (!values.specialist) {
      errors.specialist = requiredError;
    }
    return errors;
  };

  return(
    <Modal open={props.open}>
      <Modal.Header>Add New Entry</Modal.Header>
      <Modal.Content>
        {props.error && <Segment inverted color="red">{`Error: ${props.error}`}</Segment>}        
        <Formik
          initialValues={{type:EntryType.HealthCheck,description:'',date:'',specialist:'',healthCheckRating:HealthCheckRating.Healthy }}
          onSubmit={props.onSubmit}
          validate={validate}>
          {({isValid,dirty,setFieldValue,setFieldTouched}) => {
            return (
              <Form className="form ui">
                <SelectField
                  label="Type"
                  name="type"
                  options={typeOptions}
                />                                 
                <Field
                  label="Description"
                  placeholder={'description'}
                  name="description"
                  component={TextField}
                />
                <Field
                  label="Date"
                  placeholder={'date'}
                  name="date"
                  component={TextField}
                />
                <Field
                  label="Specialist"
                  placeholder={'specialist'}
                  name="specialist"
                  component={TextField}
                />
                <DiagnosisSelection
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  diagnoses={Object.values(diagnoses)}
                />                                                         
                <SelectField
                  label="HealthCheckRating"
                  name="healthCheckRating"
                  options={healthCheckRatingOptions}
                />
                <Button type="submit" disabled={!dirty || !isValid} color="green">Add</Button>
                <Button type='button' onClick={props.onCancel} color="red">Cancel</Button>
              </Form>
            );
          }}
        </Formik>
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;