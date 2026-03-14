import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';
import CustomText from '../CustomText';

const SuccessModal = ({ visible, message, buttonText, onOk }) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <CustomText style={styles.message}>{message}</CustomText>
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={onOk}
                    >
                        <CustomText style={styles.buttonText}>{buttonText}</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(20),
    },
    modalContainer: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: hp(20),
        padding: hp(24),
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    message: {
        fontSize: hp(18),
        fontWeight: '600',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: hp(24),
        lineHeight: hp(26),
    },
    button: {
        backgroundColor: COLORS.orange || '#fb732b',
        paddingVertical: hp(12),
        paddingHorizontal: wp(40),
        borderRadius: hp(12),
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: hp(16),
        fontWeight: '700',
    },
});

export default SuccessModal;
