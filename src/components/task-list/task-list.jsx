/* eslint-disable react/react-in-jsx-scope */
import Task from '../task/task';
import PropTypes from 'prop-types';
import './task-list.css';
const TaskList = ({ moveData }) => {
  const elements = moveData.map((el) => {
    const { id, ...itemProps } = el;

    return (
      <li className="movi-list-item" key={id}>
        <Task {...itemProps} id={id} />
      </li>
    );
  });
  return <ul className="movi-list">{elements}</ul>;
};
TaskList.defaultProps = {
  moveData: [],
};

TaskList.propTypes = {
  moveData: PropTypes.array,
};
export default TaskList;
