import PropTypes from "prop-types";

/**
 * Component to create curved Background
 * @component
 * @param {Object} props
 * @property {string} className className to be passed to parent div
 * @property {string} fgClassName Foreground color CSS
 * @property {string} bgClassName Background color CSS
 * @returns {ReactNode}
 */
const CurvedBackground = ({
  className,
  fgClassName,
  bgClassName,
  ...moreProps
}) => {
  return (
    <div className={className} {...moreProps}>
      <div
        id={`curved-bg-mask`}
        className={`hidden h-full w-full bg-transparent 
      lg:absolute lg:z-10 lg:grid lg:auto-cols-max lg:grid-cols-2 lg:gap-0
    `}
      >
        <span className={`rounded-bl-full ${bgClassName}`}></span>
        <span className={`bg-transparent`}></span>
        <span className={`${fgClassName}`}></span>
        <span className={`rounded-tr-full ${fgClassName}`}></span>
      </div>
      <div
        id={`curved-bg`}
        className={`hidden h-full w-full bg-transparent 
      lg:absolute lg:z-0 lg:grid lg:auto-cols-max lg:grid-cols-2 lg:gap-0
    `}
      >
        <span className={`${fgClassName}`}></span>
        <span className={`bg-transparent`}></span>
      </div>
    </div>
  );
};

CurvedBackground.propTypes = {
  className: PropTypes.string.isRequired,
  fgClassName: PropTypes.string.isRequired,
  bgClassName: PropTypes.string.isRequired,
};

export { CurvedBackground };
