import React from "react";

import { UserStateContext } from "../../context/Context";

import { useContext } from "react";

const QuizFilter = (props) => {
  const { setFilterCheck } = useContext(UserStateContext);

  const dropdownChangeHandler = (event) => {
    props.onChangeFilter(event.target.value);
    setFilterCheck(false);
  };

  const categoryChangeHandler = (event) => {
    props.onChangeCategoryFilter(event.target.value);
    setFilterCheck(true);
  };

  return (
    <div className="flex w-full h-24 bg-yellow-100 p-5">
      <div className="w-2/3 h-full mr-10  ">
        <input
          className="w-full h-full bg-white text-center text-black text-2xl"
          variant="outlined"
          type="text"
          placeholder="검색"
          onChange={dropdownChangeHandler}
          value={props.selected}
        />
      </div>
      <div className="w-1/3 h-full">
        <select
          className="w-full h-full cursor-pointer text-center text-2xl "
          value={props.selectedCategory}
          onChange={categoryChangeHandler}
        >
          <option value="">선택</option>
          <option value="IT">IT</option>
          <option value="GAME">GAME</option>
          <option value="FUN">FUN</option>
        </select>
      </div>
    </div>
  );
};

export default QuizFilter;
