"use client";
import PropTypes from "prop-types";
import { createContext, useContext, useReducer, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
export const MachineListContext = createContext({});

export const useMachineListContext = () => useContext(MachineListContext);

const MachineListProvider = ({ children }) => {
  const machineReducer = (prevState, action) => {
    return { ...prevState, ...action };
  };
  const [machinesState, dispatch] = useReducer(machineReducer, {
    machines: [],
    metadata: [],
    filter: { active: "", machines: [] },
    search: { value: "", machines: [] },
  });
  const [response] = useFetch("/api/v1/machines", { method: "GET" });
  const [metaResponse] = useFetch("/api/v1/machines?getMetadata=yes", {
    method: "GET",
  });
  useMemo(() => {
    if (metaResponse.code === 200) {
      const metadata = metaResponse.data.result;
      return dispatch({ metadata });
    }
  }, [metaResponse, dispatch]);
  useMemo(() => {
    if (response.code === 200) {
      const result = response.data.result;
      dispatch({ filter: { active: "ALL", machines: result } });
      return dispatch({ machines: result });
    }
  }, [response, dispatch]);

  return (
    <MachineListContext.Provider value={{ machinesState, dispatch }}>
      {children}
    </MachineListContext.Provider>
  );
};
MachineListProvider.propTypes = {
  children: PropTypes.node,
};

export { MachineListProvider };
