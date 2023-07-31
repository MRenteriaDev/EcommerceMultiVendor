import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
  items: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
}

export default function CheckboxBoxButtons({
  items,
  checked,
  onChange,
}: Props) {
  const [checkedItems, setChekedItems] = useState(checked || []);

  function handleCheked(value: string) {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newCheked: string[] = [];
    if (currentIndex === - 1) newCheked = [...checkedItems, value];
    else newCheked = checkedItems.filter((item) => item !== value);
    setChekedItems(newCheked);
    onChange(newCheked);
  }

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.indexOf(item) !== -1}
              onClick={() => handleCheked(item)}
            />
          }
          label={item}
          key={item}
        />
      ))}
    </FormGroup>
  );
}
