import React from 'react';
import {Modal,Button,Segment, Container,Grid} from 'semantic-ui-react';
import {Formik,Form,Field,useField} from 'formik';
import {TextField,SelectField,DiagnosisSelection,OptionForSelect,OptionForSelectNum} from '../AddPatientModal/FormField';
import { HealthCheckRating,EntryType, EntryWithoutId } from '../types';
import { useStateValue } from '../state';
import { isString,isDate } from '../utils';



const ConditionalView = ({fieldName,fieldValue,children}
  :{fieldName:string,fieldValue:string,children:JSX.Element}) => {
  const [field] = useField(fieldName);    
  if(field.value===fieldValue) {
    return children;
  }
  return null;
};

const healthCheckRatingOptions: OptionForSelectNum[] = [
  { value:HealthCheckRating.Healthy, label:'Healthy'},
  { value:HealthCheckRating.LowRisk, label:'Low Risk'},
  { value:HealthCheckRating.HighRisk, label:'High Risk'},
  { value:HealthCheckRating.CriticalRisk, label:'Critical Risk'}
];

const typeOptions: OptionForSelect[] = [
  { value:EntryType.HealthCheck, label:"HealthCheck"},
  { value:"OccupationalHealthcare", label:"OccupationalHealthcare"},
  { value:"Hospital", label:"Hospital"},
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
    if(values.type===EntryType.OccupationalHealthcare) {
      if(!values.employerName) {
        errors.employerName = requiredError;
      }   
      const startVal:unknown = values.sickLeaveStartDate;
      const endVal:unknown = values.sickLeaveEndDate;
      const startDate = typeof startVal==='string' ? Date.parse(startVal) : null;
      const endDate = typeof endVal==='string' ? Date.parse(endVal) : null;
      if(startVal) {
        if(!startDate) {
          errors.sickLeaveStartDate = 'Invalid date format';
        } else if(!endVal) {
          errors.sickLeaveEndDate = 'End date is also required if start date is given';
        }
      }
      if(endVal) {
        if(!endDate) {
          errors.sickLeaveEndDate = 'Invalid date format';
        } else if(!startVal) {
          errors.sickLeaveStartDate = 'Start date is also required if end date is given';
        }
      }
      if(startDate && endDate && endDate<startDate) {
        errors.sickLeaveEndDate = 'End date cannot come before start';
      }
    }
    if(values.type===EntryType.Hospital) {
      if(!values.dischargeDate) {
        errors.dischargeDate = requiredError;
      } else if(!isDate(values.dischargeDate)) {
        errors.dischargeDate = 'Invalid date format';
      }
      if(!values.dischargeCriteria) {
        errors.dischargeCriteria = requiredError;
      }      
      
    }
    return errors;
  };

  return(
    <Modal open={props.open}>
      <Modal.Header>Add New Entry</Modal.Header>
      <Modal.Content>
        {props.error && <Segment inverted color="red">{`Error: ${props.error}`}</Segment>}        
        <Formik
          initialValues={{type:EntryType.HealthCheck,description:'',date:'',specialist:'',
            healthCheckRating:HealthCheckRating.Healthy,employerName:'',sickLeaveStartDate:'',
            sickLeaveEndDate:'',dischargeDate:'',dischargeCriteria:'' }}
          onSubmit={props.onSubmit}
          validate={validate}>
          {({isValid,setFieldValue,setFieldTouched}) => {

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
                <ConditionalView fieldName='type' fieldValue={EntryType.HealthCheck}>                                                         
                  <SelectField
                    label="HealthCheckRating"
                    name="healthCheckRating"
                    options={healthCheckRatingOptions}
                  />
                </ConditionalView>
                <ConditionalView fieldName='type' fieldValue={EntryType.OccupationalHealthcare}>
                  <Container>
                    <Field
                      label='Employer Name'
                      placeholder={'employerName'}
                      name='employerName'
                      component={TextField}
                    />
                    <Grid columns='equal'>
                      <Grid.Column floated='left'>
                        <Field
                          label='Sick leave start date'
                          placeholder={'sickLeaveStartDate'}
                          name='sickLeaveStartDate'
                          component={TextField}
                        />
                      </Grid.Column>  
                      <Grid.Column floated='right'>                                        
                        <Field
                          label='Sick leave end date'
                          placeholder={'sickLeaveEndDate'}
                          name='sickLeaveEndDate'
                          component={TextField}
                        />
                      </Grid.Column>                    
                    </Grid>
                  </Container>                        
                </ConditionalView>
                <ConditionalView fieldName='type' fieldValue={EntryType.Hospital}>
                  <Container>
                    <Field
                      label='Discharge date'
                      placeholder={'dischargeDate'}
                      name='dischargeDate'
                      component={TextField}
                    />
                    <Field
                      label='Discharge criteria'
                      placeholder={'dischargeCriteria'}
                      name='dischargeCriteria'
                      component={TextField}
                    />  
                  </Container>                                  
                </ConditionalView>
                <Button type="submit" disabled={!isValid} color="green">Add</Button>
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