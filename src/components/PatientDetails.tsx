import axios from "axios";
import React from "react";
import { Icon } from 'semantic-ui-react';
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue,addPatientFull } from "../state";
import { Gender, PatientFull } from "../types";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";

const PatientDetails = () => {
  const params = useParams();
  const {id}:{id?:string} = params;
  const [{patientsFull},dispatch] = useStateValue();
  const patientFull = id && patientsFull[id];
  if(id && !patientFull) {
    void (async () => {
      console.log('url',`${apiBaseUrl}/patients/${id}`);
      const {data}:{data:PatientFull} = await axios.get(`${apiBaseUrl}/patients/${id}`);
      console.log('data',data);
      dispatch(addPatientFull(data));
    })();
  }
  if(patientFull) {
    let iconText:SemanticICONS;
    switch(patientFull.gender) {
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
        <h2>{patientFull.name} <Icon name={iconText}></Icon></h2>
        <div>ssn: {patientFull.ssn}</div>
        <div>occupation: {patientFull.occupation}</div>      
      </div>
    );
  }
  return null;  
};

export default PatientDetails;