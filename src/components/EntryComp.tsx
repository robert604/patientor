import React from 'react';
import { useStateValue } from '../state';
import {Entry,HealthCheckEntry,OccupationalHealthcareEntry,HospitalEntry, HealthCheckRating} from '../types';
import {Icon} from 'semantic-ui-react';

const assertNever = (x: never):never => {
  throw new Error("Unexpected type: " + typeof x);
};

const HealthCheckRatingIcon = ({rating}:{rating:HealthCheckRating}) => {
  switch(rating) {
    case HealthCheckRating.Healthy:
      return <Icon style={{color:'green'}} name='heart'/>;
    case HealthCheckRating.LowRisk:
      return <Icon style={{color:'yellow'}} name='heart'/>;
    case HealthCheckRating.HighRisk:
      return <Icon style={{color:'orange'}} name='heart'/>;
    case HealthCheckRating.CriticalRisk:
      return <Icon style={{color:'red'}} name='heart'/>;
    default:
      return assertNever(rating);
  }
};

const HealthCheckEntryComp = ({entry}:{entry:HealthCheckEntry}) => {
  const [{diagnoses},] = useStateValue();
  return (
    <div>
      <h3>{entry.date}{' '}<Icon name='user md' /></h3>
      {entry.description}
      <div><HealthCheckRatingIcon rating={entry.healthCheckRating}/></div>
      <ul>
        {entry.diagnosisCodes?.map((dc,i) => {
          const diagnosis = diagnoses.find(d => d.code===dc);
          return(
            <li key={i}>
              {dc}{' '}{diagnosis?.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const OccupationalHealthcareEntryComp = ({entry}:{entry:OccupationalHealthcareEntry}) => {
  const [{diagnoses},] = useStateValue();
  const style = {
    color:'red'
  };
  return (
    <div>
      <h3>{entry.date}{' '}<Icon style={style} name='first aid' />{' '}{entry.employerName}</h3>
      {entry.description}
      <ul>
        {entry.diagnosisCodes?.map((dc,i) => {
          const diagnosis = diagnoses.find(d => d.code===dc);
          return <li key={i}>{dc}{' '}{diagnosis?.name}</li>;
        })}
      </ul>
    </div>
  );
};

const HospitalEntryComp = ({entry}:{entry:HospitalEntry}) => {
  const [{diagnoses},] = useStateValue();
  return (
    <div>
      <h3>{entry.date}{' '}<Icon name='hospital outline' /></h3>
      {entry.description}
      <ul>
        {entry.diagnosisCodes?.map((dc,i) => {
          const diagnosis = diagnoses.find(d => d.code===dc);
          return <li key={i}>{dc}{' '}{diagnosis?.name}</li>;
        })}
      </ul>
    </div>
  );
};

const EntryComp = ({entry}:{entry:Entry}) => {
  switch(entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryComp entry={entry}/>;
    case "Hospital":
      return <HospitalEntryComp entry={entry}/>;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryComp entry={entry}/>;
    default:
      return assertNever(entry);
  }

  const [{diagnoses},] = useStateValue();
  return(
    <div>
      {entry.date}{' '}{entry.description}
      <ul>
        {entry.diagnosisCodes?.map((dc,i) => {
          const diagnosis = diagnoses.find(d => d.code===dc);
          return <li key={i}>{dc}{' '}{diagnosis?.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default EntryComp;