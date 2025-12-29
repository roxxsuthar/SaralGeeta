/**
 *
 * SelectInput
 *
 */

import React, { memo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { IMAGES } from '../../constants';
import { COLORS } from '../../constants';
import defaultStyles from './styles'; // You’ll create styles separately like LoadingScreen

function SelectInput({ label, options, onSelect, loading, value }) {
  const inputRef = useRef(null);
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0 });
  const [visible, setVisible] = useState(false);

  const handleSelect = (option) => {
    onSelect(option);
    setVisible(false);
  };

  const getLabel = useCallback(() => {
    const selected = options?.find((ele) => ele?.value == value);
    return selected?.label || '';
  }, [options, value]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          inputRef?.current?.measureInWindow((x, y, width, height) => {
            setInputLayout({ x, y: y + height - 1, width });
            setVisible(true);
          });
        }}
        activeOpacity={0.7}
        ref={inputRef}
      >
        <View style={[defaultStyles.inputContainer]}>
          <TextInput
            style={defaultStyles.input}
            placeholder={label}
            placeholderTextColor={COLORS.gray}
            value={getLabel()}
            editable={false}
            pointerEvents="none"
          />
          <IMAGES.ChevronDown style={defaultStyles.icon} />
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={defaultStyles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View
            style={[
              defaultStyles.modalContent,
              {
                position: 'absolute',
                top: inputLayout.y,
                left: inputLayout.x,
                width: inputLayout.width,
              },
            ]}
          >
            {loading ? (
              <Text style={defaultStyles.loadingText}>Loading...</Text>
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={defaultStyles.option}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={defaultStyles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

SelectInput.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ),
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  }),
  loading: PropTypes.bool,
};

SelectInput.defaultProps = {
  label: 'Select',
  options: [],
  value: null,
  loading: false,
};

export default memo(SelectInput);
