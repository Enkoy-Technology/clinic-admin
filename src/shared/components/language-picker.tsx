"use client";

import React, { useState } from "react";
import { Select } from "@mantine/core";
import { sysLanguages } from "../utils/language";
import { Locals } from "../models/local";

export function LanguagePicker() {
  const [selected, setSelected] = useState<Locals>(sysLanguages[0]);

  return (
    <Select
      data={sysLanguages.map((item: Locals) => ({
        value: item.label,
        label: item.label,
        image: item.image,
      }))}
      w={120}
      value={selected.label}
      onChange={(label) =>
        setSelected(
          sysLanguages.find(
            (item: { label: string | null }) => item?.label === label
          )!
        )
      }
      leftSection={selected.image} // Display selected language icon
      radius="md"
      size="sm"
      variant="filled"
      styles={(theme) => ({
        input: {
          borderColor: "var(--mantine-color-primary-4)",
          borderWidth: "1px",
          borderStyle: "solid",
          paddingLeft: "2.5rem", // Ensures padding for the icon
          "&:hover": {
            borderColor: theme.colors.blue[5], // Border color on hover
          },
        },
      })}
    />
  );
}

export default LanguagePicker;
