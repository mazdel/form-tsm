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
import { delay } from "@/utils/delay";

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
    // TODO : got error timeout 504 on vercel
    const onMessageUpdate = async (event) => {
      if (
        event.origin !== window.origin &&
        event.source.origin !== window.origin
      )
        return;
      if (!event.data.updateData) return;
      if (machineResponse.status === "loading" || machineResponse.code < 100)
        return;
      dispatch({ refreshing: true });
      await delay(5000);
      refreshMachineState({ update: +new Date() });
    };
    window.addEventListener("message", onMessageUpdate);

    if (machineResponse.code !== 200) {
      window.postMessage({ updateData: true });
    }

    return () => {
      window.removeEventListener("message", onMessageUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineResponse]);

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
