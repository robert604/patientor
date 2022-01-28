import axios from "axios";
import React from "react";
import { Icon } from 'semantic-ui-react';
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Gender, PatientFull } from "../types";


const PatientDetails = () => {
  const params = useParams();
  const {id}:{id?:string} = params;
  console.log('id',id);
  const [{patientsFull},dispatch] = useStateValue();
  const patientFull = id && patientsFull[id];
  if(id && !patientFull) {
    void (async () => {
      console.log('url',`${apiBaseUrl}/patients/${id}`);
      const {data}:{data:PatientFull} = await axios.get(`${apiBaseUrl}/patients/${id}`);
      console.log('data',data);
      dispatch({type:'ADD_PATIENT_FULL',payload:data});
    })();
  }
  if(patientFull) {
    let icon;
    switch(patientFull.gender) {
      case Gender.Male:
        icon = <Icon name='mars'></Icon>;
        break;
      case Gender.Female:
        icon = <Icon name='venus'></Icon>;
        break;
      default:
        icon = <Icon name='genderless'></Icon>;
    }
    return(
      <div>
       <h2>{patientFull.name} {icon}</h2>
       <p>ssn: {patientFull.ssn}</p>
       <p>occupation: {patientFull.occupation}</p>
      </div>
    );
  }
  return null;  
};

export default PatientDetails;