"use client";
import PropTypes from "prop-types";
import Link from "next/link";
import { parseIfInt } from "@/utils/parseIfInt";
import { useMachineListContext } from "@/contexts/MachineListContext";
import { useMemo, useState, useRef, useEffect } from "react";
import { encrypt } from "@/utils/encryption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const MachineList = ({ className, ...moreProps }) => {
  const { machinesState, dispatch } = useMachineListContext();
  const { machines, settings, filter, search } = machinesState;
  const [machineList, setMachineList] = useState(machines);
  const [loadingState, setLoadingState] = useState(machinesState.loading);
  const [skeletonCount, setSkeletonCount] = useState(0);

  const cardsContainer = useRef();
  useEffect(() => {
    const container = cardsContainer.current;
    console.log(container.offsetWidth, container.getBoundingClientRect());
    if (typeof window !== "undefined") {
      const cardsCount = Math.floor(
        ((container.offsetWidth - 16) * (window.innerHeight - 16)) / 176 ** 2,
      );
      setSkeletonCount(cardsCount);
    }
  }, []);

  useMemo(() => {
    let activeList = filter.machines;
    if (search.machines.length > 0) {
      activeList = search.machines;
    }
    return setMachineList(activeList);
  }, [search, filter]);

  useMemo(() => {
    if (machinesState.loading.status == "error") {
      if (machinesState.loading.code >= 300) {
        return setLoadingState(machinesState.loading);
      }
    }
  }, [machinesState.loading]);

  const updateFilter = (filterBy) => {
    const activeFilter = filterBy == filter.active ? "ALL" : filterBy;
    dispatch({ search: { value: "", machines: [] } });
    if (activeFilter && activeFilter !== "ALL") {
      const filteredMachines = machines.filter(
        (machine) => machine[settings.groupBy.header] === activeFilter,
      );
      return dispatch({
        filter: { active: activeFilter, machines: filteredMachines },
      });
    }
    return dispatch({ filter: { active: activeFilter, machines: machines } });
  };

  return (
    <section
      className={`relative flex flex-auto flex-col bg-inherit md:h-[80svh] md:flex-row ${className}`}
      {...moreProps}
    >
      <div
        id="groups"
        className={`mb-2 flex flex-shrink-0 justify-around bg-inherit p-2 md:w-1/4 md:flex-col md:justify-start lg:w-1/6`}
      >
        {settings.groupBy?.groups ? (
          ["ALL", ...settings.groupBy.groups].map((group, ind) => {
            return (
              <div
                key={ind}
                className="flex flex-col items-center justify-center px-2 font-semibold md:py-2"
              >
                <button
                  className={``}
                  type="button"
                  onClick={() => updateFilter(group)}
                >
                  {group}
                </button>

                <span
                  className={`block h-0.5 w-10 rounded-full bg-violet-900 transition-all duration-200 md:w-full dark:bg-white ${
                    filter.active == group ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            );
          })
        ) : (
          <div className="flex w-full flex-auto animate-pulse items-center justify-around md:flex-col md:justify-start md:gap-5">
            <span className="mx-2 h-6 w-1/2 rounded-full bg-violet-300 px-2 md:w-full md:py-2" />
            <span className="mx-2 h-6 w-1/2 rounded-full bg-violet-300 px-2 md:w-full md:py-2" />
            <span className="mx-2 h-6 w-1/2 rounded-full bg-violet-300 px-2 md:w-full md:py-2" />
          </div>
        )}
      </div>
      <div
        id="cards"
        ref={cardsContainer}
        className={`mx-2 flex flex-shrink-0 flex-wrap justify-between gap-4 overflow-y-scroll bg-inherit p-2 md:flex-auto ${
          filter.machines.length ? "" : "animate-pulse"
        }`}
      >
        {machineList.length && settings.highlights?.length
          ? machineList.map((machine) => {
              let { rowId, ...machineRest } = machine;

              const highlights = settings.highlights.sort(
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

              const anchor = encrypt(
                `${JSON.stringify({
                  rowId,
                  [presented.titles[0].key]: presented.titles[0].value,
                })}`,
              );
              return (
                <Link
                  key={rowId}
                  href={`/machines/edit/${anchor}`}
                  className={`flex h-44 w-2/6 flex-auto cursor-pointer flex-col overflow-hidden rounded-xl bg-gradient-to-br from-violet-900 
                    to-fuchsia-900 p-3 text-white shadow-md
                    transition duration-200 active:scale-95 sm:h-44
                    sm:w-44 dark:from-fuchsia-800 dark:to-violet-800
                  `}
                >
                  {presented.titles.map((title) => {
                    if (title.seq == 0) {
                      return (
                        <h2 key={title.seq} className="text-lg font-semibold">
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
                </Link>
              );
            })
          : [...Array(skeletonCount ? skeletonCount : 20).keys()].map(
              (card, idx) => {
                console.log(skeletonCount);
                return (
                  <div
                    key={idx}
                    className="flex h-44 w-2/6 flex-auto cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl 
                  bg-gradient-to-br from-violet-900 to-fuchsia-900 p-3
                  text-white shadow-md transition duration-200 focus:scale-95
                  sm:h-44 sm:w-44 dark:from-fuchsia-700 dark:to-violet-700"
                  >
                    <h2 className="text-lg font-semibold">
                      {loadingState.status == "loading"
                        ? ""
                        : `${loadingState.status}-${loadingState.code}`}
                    </h2>
                  </div>
                );
              },
            )}
      </div>
      <div
        className={`
          fixed bottom-3 right-3 rounded-full bg-violet-950 p-3
          text-white opacity-70 transition-all ease-bounce-in
          dark:bg-violet-50 dark:text-violet-950
          ${machinesState.refreshing ? "scale-100" : "scale-0"}
        `}
      >
        <FontAwesomeIcon icon={faArrowsRotate} className="h-7" spin />
      </div>
    </section>
  );
};

MachineList.propTypes = {
  className: PropTypes.string,
};

export { MachineList };
