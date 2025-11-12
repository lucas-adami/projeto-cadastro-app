import React, { useEffect, useState } from "react";
import { List } from "react-native-paper";

type Props<T> = {
  items: T[];
  onSelect: (value: any) => void;
  selected?: T;
  getLabel?: (item: T) => string;
  getValue?: (item: T) => any;
  suggestedLabel?: string;
  suggestionStyle?: any;
  backgroundColor?: string;
};

export default function ListPicker<T>({
  items,
  onSelect,
  selected,
  getLabel,
  getValue,
  suggestedLabel,
  suggestionStyle,
  backgroundColor,
}: Props<T>) {
  const [expanded, setExpanded] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    if (selected) {
      const label = getLabel ? getLabel(selected) : String(selected);
      setSelectedLabel(label);
    }
  }, [selected, getLabel]);

  const handlePress = () => {
    if (items.length > 0) {
      setExpanded(!expanded);
    }
  };

  const handleSelect = (item: T) => {
    const label = getLabel ? getLabel(item) : String(item);
    const value = getValue ? getValue(item) : item;

    setSelectedLabel(label);
    setExpanded(false);
    onSelect(value);
  };

  let title: React.ReactNode = "Escolha uma opção";
  let titleStyle: any = undefined;

  if (items.length === 0) {
    title = "Não há itens";
  } else if (selectedLabel) {
    title = selectedLabel;
  } else if (suggestedLabel) {
    title = suggestedLabel;
    titleStyle = suggestionStyle;
  }

  return (
    <List.Section style={backgroundColor ? { backgroundColor, borderRadius: 8 } : undefined}>
      <List.Accordion
        title={title}
        titleStyle={titleStyle}
        expanded={expanded}
        onPress={handlePress}
        left={(props) => <List.Icon {...props} icon="menu-down" />}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        {items.map((item, index) => (
          <List.Item
            key={index}
            title={getLabel ? getLabel(item) : String(item)}
            onPress={() => handleSelect(item)}
            style={backgroundColor ? { backgroundColor } : undefined}
          />
        ))}
      </List.Accordion>
    </List.Section>
  );
}