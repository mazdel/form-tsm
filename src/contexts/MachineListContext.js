"use client";
import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";
import { useFetch } from "@/hooks/useFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const MachineListContext = createContext({});
export const useMachineListContext = () => useContext(MachineListContext);

const MachineListProvider = ({ children }) => {
  const machineReducer = (prevState, action) => {
    return { ...prevState, ...action };
  };
  const [needUpdate, setNeedUpdate] = useLocalStorage(
    "machineListNeedUpdate",
    "false",
  );

  const [machinesState, dispatch] = useReducer(machineReducer, {
    machines: [],
    settings: [],
    filter: { active: "", machines: [] },
    search: { value: "", machines: [] },
    metadata: {},
    loading: { status: "loading" },
    refreshing: false,
  });

  const [machineResponse, refreshMachineState] = useFetch("/api/v1/machines", {
    method: "GET",
  });
  const [settingResponse] = useFetch("/api/v1/machines?getSettings=yes", {
    method: "GET",
  });

  useEffect(() => {
    // TODO : loadtime need to be optimized again
    const intervalId = setInterval(() => {
      if (machineResponse.status === "loading" || machineResponse.code < 100)
        return clearInterval(intervalId);

      const directNeedUpdate =
        JSON.parse(window.localStorage.getItem("machineListNeedUpdate")) ||
        false;

      if (JSON.parse(needUpdate) === true || directNeedUpdate === true) {
        refreshMachineState({ update: +new Date() });
        dispatch({ refreshing: true });
      }
    }, 5000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needUpdate, machineResponse]);

  useMemo(() => {
    if (settingResponse.code === 200) {
      const settings = settingResponse.data.result;
      return dispatch({ settings });
    }
  }, [settingResponse, dispatch]);

  useEffect(() => {
    if (machineResponse.code === 200) {
      const { data, ...response } = machineResponse;
      const [metadata, ...result] = data.result;
      dispatch({ loading: response });
      dispatch({ refreshing: false });
      dispatch({ filter: { active: "ALL", machines: result } });

      setNeedUpdate("false");

      return dispatch({ machines: result, metadata });
    }
    return dispatch({ loading: machineResponse });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineResponse, dispatch]);

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
