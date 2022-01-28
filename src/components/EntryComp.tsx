import React from 'react';
import {Entry} from '../types';

const EntryComp = ({entry}:{entry:Entry}) => {
  return(
    <div>
      {entry.date}{' '}{entry.description}
      <ul>
        {entry.diagnosisCodes?.map((dc,i) => {
          return <li key={i}>{dc}</li>;
        })}
      </ul>
    </div>
  );
};

export default EntryComp;