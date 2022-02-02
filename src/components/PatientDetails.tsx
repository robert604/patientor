import axios from "axios";
import React,{ useState } from "react";
import { Icon,Container,Button } from 'semantic-ui-react';
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue,addPatient, addEntry } from "../state";
import { Gender, PatientFull,Entry } from "../types";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import EntryComp from './EntryComp';
import AddEntryModal from './AddEntryModal';


const PatientDetails = () => {
  const [showEntryModal,setShowEntryModal] = useState<boolean>(false);
  const [error,setError] = useState<string|undefined>();  
  const params = useParams();
  const {id}:{id?:string} = params;
  const [{patients},dispatch] = useStateValue();
  if(!id) throw new Error('No patient id');
  const patient = patients[id] as PatientFull;

  const closeEntryModal = () => {
    setShowEntryModal(false);
    setError(undefined);    
  };
  const submitEntryClick = async (values:any) => {
    try {
      if(values && values.healthCheckRating) {
        values.healthCheckRating = Number(values.healthCheckRating);
      }
      console.log('clicked submit',values);    

      if(!id) throw new Error('No patient ID specified');
      const {data:savedEntry} = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,values
      );
      dispatch(addEntry(id,savedEntry));
      closeEntryModal();
    } catch(error:any) {
      console.error(error.response?.data || 'Unknown error when adding new entry');
      setError(error.response?.data || 'Unknown error when adding new entry');
    }
  };



  if(id && !patient) {
    void (async () => {
      //console.log('url',`${apiBaseUrl}/patients/${id}`);
      const {data}:{data:PatientFull} = await axios.get(`${apiBaseUrl}/patients/${id}`);
      //console.log('data',data);
      dispatch(addPatient(data));
    })();
  }
  if(patient) {
    let iconText:SemanticICONS;
    switch(patient.gender) {
      case Gender.Male:
        iconText = 'mars';
        break;
      case Gender.Female:
        iconText = 'venus';        
        break;
      default:
        iconText = 'genderless';        
    }
    return(
      <div>     
        <h2>{patient.name} <Icon name={iconText}></Icon></h2>
        <div>ssn: {patient.ssn}</div>
        <div>occupation: {patient.occupation}</div>
        <h3>entries</h3>
        {patient.entries.map((e,i) => {
          const style = {
            border:'solid',
            borderWidth:2,
            borderColor:'#aaaaaa',
            borderRadius:5,
            margin:5,
            padding:5
          };
          return(
            <Container key={i} style={style}>
              <EntryComp entry={e}/>
            </Container>
          );
        })}
        <Button open={showEntryModal} onClick={() => setShowEntryModal(true)}>Add Entry</Button>
        <AddEntryModal open={showEntryModal} onCancel={closeEntryModal} onSubmit={submitEntryClick} error={error}/>
      </div>
    );
  }
  return null;  
};

export default PatientDetails;