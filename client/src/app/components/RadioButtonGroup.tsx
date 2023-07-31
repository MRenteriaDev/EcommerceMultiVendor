import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface Props {
  options: any[];
  onChange: (event: any) => void;
  selectValue: string;
}

export default function RadioButtonGroup({
  options,
  onChange,
  selectValue,
}: Props) {
  return (
    <FormControl>
      <RadioGroup onChange={onChange} value={selectValue}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
