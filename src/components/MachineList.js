"use client";
import PropTypes from "prop-types";
import { parseIfInt } from "@/utils/parseIfInt";
import { useMachineListContext } from "@/contexts/MachineListContext";
import { useMemo, useState } from "react";

const MachineList = ({ className, ...moreProps }) => {
  const { machinesState, dispatch } = useMachineListContext();
  const { machines, metadata, filter, search } = machinesState;
  const [machineList, setMachineList] = useState(machines);

  useMemo(() => {
    let activeList = filter.machines;
    if (search.machines.length > 0) {
      activeList = search.machines;
    }
    return setMachineList(activeList);
  }, [search, filter]);

  const updateFilter = (filterBy) => {
    const activeFilter = filterBy == filter.active ? "ALL" : filterBy;
    dispatch({ search: { value: "", machines: [] } });
    if (activeFilter && activeFilter !== "ALL") {
      const filteredMachines = machines.filter(
        (machine) => machine[metadata.groupBy.header] === activeFilter,
      );
      return dispatch({
        filter: { active: activeFilter, machines: filteredMachines },
      });
    }
    return dispatch({ filter: { active: activeFilter, machines: machines } });
  };

  return (
    <section
      className={` flex flex-auto flex-col bg-inherit ${className}`}
      {...moreProps}
    >
      <div
        id="groups"
        className={`mb-2 flex flex-shrink-0 justify-around bg-inherit p-2`}
      >
        {metadata.groupBy?.groups ? (
          ["ALL", ...metadata.groupBy.groups].map((group, ind) => {
            return (
              <div
                key={ind}
                className="flex flex-col items-center justify-center px-2 font-semibold"
              >
                <button
                  className={``}
                  type="button"
                  onClick={() => updateFilter(group)}
                >
                  {group}
                </button>

                <span
                  className={`block h-0.5 w-10 rounded-full bg-violet-900 transition-all duration-200 dark:bg-white ${
                    filter.active == group ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            );
          })
        ) : (
          <div className="flex w-full animate-pulse items-center justify-around">
            <span className="mx-2 h-6 w-1/2 rounded-full bg-violet-300" />
            <span className="mx-2 h-6 w-1/2 rounded-full bg-violet-300" />
          </div>
        )}
      </div>
      <div
        id="cards"
        className={`mx-2 flex flex-shrink-0 flex-wrap justify-between gap-4 bg-inherit p-2 ${
          filter.machines.length ? "" : "animate-pulse"
        }`}
      >
        {machineList.length && metadata.highlights?.length
          ? machineList.map((machine) => {
              let { rowId, ...machineRest } = machine;

              const highlights = metadata.highlights.sort(
                (a, b) => a.seq - b.seq,
              );
              const presented = Object.entries(machineRest).reduce(
                (prevVal, [key, value], index) => {
                  const highlightIndex = highlights.findIndex(
                    (highlight) => highlight.title === key,
                  );

                  if (highlightIndex >= 0) {
                    return {
                      ...prevVal,
                      titles: [
                        ...prevVal.titles,
                        { seq: highlightIndex, key, value },
                      ].sort((a, b) => a.seq - b.seq),
                    };
                  }
                  value = parseIfInt(value);
                  if (typeof value === "number") {
                    value = value.toLocaleString("id");
                  }

                  return {
                    ...prevVal,
                    rest: [...prevVal.rest, { seq: index, key, value }].sort(
                      (a, b) => a.seq - b.seq,
                    ),
                  };
                },
                { titles: [], rest: [] },
              );

              return (
                // TODO: onCLick div mengarah ke halaman/modal khusus pengisian form
                <div
                  key={rowId}
                  className={`flex h-44 w-44 cursor-pointer flex-col overflow-hidden 
                    rounded-xl bg-gradient-to-br from-violet-900 to-fuchsia-900 
                    p-3 text-white shadow-md transition duration-200 
                    dark:from-fuchsia-700 dark:to-violet-700 
                  `}
                >
                  {presented.titles.map((title) => {
                    if (title.seq == 0) {
                      return (
                        <h2 key={title.seq} className="text-lg font-semibold ">
                          {title.value}
                        </h2>
                      );
                    }
                    return (
                      <span
                        key={title.seq}
                        className="text-base font-semibold "
                      >
                        {title.value}
                      </span>
                    );
                  })}
                  <div className="flex flex-auto flex-col justify-end">
                    {presented.rest.map((rest) => {
                      return (
                        <div
                          key={rest.seq}
                          className="mb-2 flex justify-between text-xs"
                        >
                          <span>{rest.key}</span>
                          <span>{rest.value.length ? rest.value : "-"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          : [...Array(8).keys()].map((card, idx) => {
              return (
                <div
                  key={idx}
                  className="
                  h-44 w-44 rounded-xl bg-gradient-to-br from-violet-900 to-fuchsia-500 p-2 shadow-md
                  dark:from-violet-700 dark:to-fuchsia-700  "
                ></div>
              );
            })}
      </div>
    </section>
  );
};

MachineList.propTypes = {
  className: PropTypes.string,
};

export { MachineList };
