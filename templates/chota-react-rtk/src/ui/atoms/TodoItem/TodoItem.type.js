import PropTypes from "prop-types";

export const propTypes = {
  onToggleClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  theme: PropTypes.string,
};
