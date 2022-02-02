import { State } from "./state";
import { Diagnosis, Patient, PatientFull,Entry } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT_FULL";
      payload: PatientFull;
    }
  | {
    type: "SET_DIAGNOSIS_LIST";
    payload: Diagnosis[];
  }
  | {
    type: "ADD_ENTRY",
    payload: {
      patientId:string,
      entry:Entry
    }
  };


export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: action.payload
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.patientId]: {
            ...state.patients[action.payload.patientId],
            entries: (state.patients[action.payload.patientId].entries ?? []).concat(action.payload.entry),
          },
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (patientListFromApi:Patient[]):Action => {
  return { type: "SET_PATIENT_LIST", payload: patientListFromApi };
};

export const addPatient = (patient:Patient):Action => {
  return { type: "ADD_PATIENT", payload: patient };
};


export const setDiagnosisList = (data:Diagnosis[]):Action => {
  return { type: "SET_DIAGNOSIS_LIST", payload: data };
};

export const addEntry = (patientId:string,entry:Entry):Action => {
  return { type:"ADD_ENTRY", payload: {patientId:patientId,entry:entry}};
};