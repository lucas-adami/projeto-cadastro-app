import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  fetchOptions?: () => Promise<Option[]>; 
  staticOptions?: Option[];
};

export const DropdownCustom: React.FC<Props> = ({
  label,
  value,
  onChange,
  fetchOptions,
  staticOptions = [],
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fetchOptions) {
      setLoading(true);
      fetchOptions()
        .then(setItems)
        .finally(() => setLoading(false));
    } else {
      setItems(staticOptions);
    }
  }, []);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => onChange(callback(value))}
        setItems={setItems}
        loading={loading}
        placeholder="Selecione uma opção"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    zIndex: 1000,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
});
