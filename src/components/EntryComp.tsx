import React from 'react';
import { useStateValue } from '../state';
import {Entry} from '../types';

const EntryComp = ({entry}:{entry:Entry}) => {
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