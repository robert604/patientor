import { State } from "./state";
import { Diagnosis, Patient, PatientFull } from "../types";

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
    case "ADD_PATIENT_FULL":
      console.log('action',action);
      return {
        ...state,
        patientsFull: {
          ...state.patientsFull,
          [action.payload.id]: action.payload
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: action.payload
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

export const addPatientFull = (data:PatientFull):Action => {
  return { type: "ADD_PATIENT_FULL", payload: data };
};

export const setDiagnosisList = (data:Diagnosis[]):Action => {
  return { type: "SET_DIAGNOSIS_LIST", payload: data };
};