import PropTypes from "prop-types";

const MachinesLayout = ({ children, modal }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};
MachinesLayout.propTypes = {
  children: PropTypes.node.isRequired,
  modal: PropTypes.node,
};
export default MachinesLayout;
