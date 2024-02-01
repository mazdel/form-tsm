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
    settings: [],
    filter: { active: "", machines: [] },
    search: { value: "", machines: [] },
    metadata: {},
  });
  const [response] = useFetch("/api/v1/machines", { method: "GET" });
  const [settingResponse] = useFetch("/api/v1/machines?getSettings=yes", {
    method: "GET",
  });
  useMemo(() => {
    if (settingResponse.code === 200) {
      const settings = settingResponse.data.result;
      return dispatch({ settings });
    }
  }, [settingResponse, dispatch]);
  useMemo(() => {
    if (response.code === 200) {
      const [metadata, ...result] = response.data.result;
      dispatch({ filter: { active: "ALL", machines: result } });

      return dispatch({ machines: result, metadata });
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
