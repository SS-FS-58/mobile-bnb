import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class CustomInput extends React.PureComponent {
  render() {

    return (
        <label className="w-100 h-100 rounded calendar-icon">
          <input placeholder="&#xf073;"
                 onClick={this.props.onClick}
                 className={this.props.className}
                 type="text"
                 onChange={this.props.onChange}
                 value={this.props.value}/>
        </label>
    )
  }
}

export const Calendar = (props) => {
  const {changeDate} = props
  const [startDate, setStartDate] = useState(new Date());
  changeDate(startDate);
  return (
      <DatePicker
          className="fas-placeholder bg-calendar form-control w-100 h-100"
          selected={startDate}
          onChange={date => {setStartDate(date);changeDate(date)}}
          customInput={<CustomInput/>}
      />
  );
};
