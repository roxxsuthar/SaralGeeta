import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';
import CustomText from '../CustomText';

const ConfirmModal = ({ visible, title, message, onCancel, onConfirm, cancelText, confirmText }) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {title && <CustomText style={styles.title}>{title}</CustomText>}
                    <CustomText style={styles.message}>{message}</CustomText>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            activeOpacity={0.8}
                            onPress={onCancel}
                        >
                            <CustomText style={styles.cancelButtonText}>{cancelText || 'Cancel'}</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            activeOpacity={0.8}
                            onPress={onConfirm}
                        >
                            <CustomText style={styles.confirmButtonText}>{confirmText || 'Confirm'}</CustomText>
                        </TouchableOpacity>
                    </View>
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
    title: {
        fontSize: hp(20),
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: hp(10),
        textAlign: 'center',
    },
    message: {
        fontSize: hp(16),
        fontWeight: '500',
        color: COLORS.gray || '#666',
        textAlign: 'center',
        marginBottom: hp(24),
        lineHeight: hp(22),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: wp(15),
    },
    button: {
        flex: 1,
        paddingVertical: hp(12),
        borderRadius: hp(12),
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButton: {
        borderColor: COLORS.gray || '#666',
        backgroundColor: COLORS.white,
    },
    confirmButton: {
        borderColor: COLORS.orange || '#fb732b',
        backgroundColor: COLORS.orange || '#fb732b',
    },
    cancelButtonText: {
        color: COLORS.gray || '#666',
        fontSize: hp(16),
        fontWeight: '600',
    },
    confirmButtonText: {
        color: COLORS.white,
        fontSize: hp(16),
        fontWeight: '600',
    },
});

export default ConfirmModal;
