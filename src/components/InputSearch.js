"use client";
import PropTypes from "prop-types";
import { useMachineListContext } from "@/contexts/MachineListContext";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputSearch = ({ className, ...moreProps }) => {
  const { machinesState, dispatch } = useMachineListContext();
  const { metadata, machines, search } = machinesState;

  const handleSearch = (find) => {
    if (find) {
      const filteredMachines = machines.filter((machine) => {
        if (metadata.highlights.length) {
          return machine[metadata.highlights[0].title]
            .toLowerCase()
            .includes(find.toLowerCase());
        }
        return false;
      });

      return dispatch({
        search: { value: find, machines: filteredMachines },
        filter: { active: "ALL", machines },
      });
    }
    return dispatch({ search: { value: find, machines: [] } });
  };

  return (
    <div id="input-search-group" className={className} {...moreProps}>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="h-6 text-violet-400"
      />
      <input
        type="text"
        className="mx-2 w-full bg-inherit text-inherit placeholder-violet-400 outline-violet-400"
        placeholder={`Cari`}
        onInput={(e) => handleSearch(e.target.value.trim())}
        value={search.value}
      />
    </div>
  );
};

InputSearch.propTypes = {
  className: PropTypes.string,
};

export { InputSearch };
