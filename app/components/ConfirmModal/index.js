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
        fontSize: hp(22),
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: hp(12),
        textAlign: 'center',
        fontFamily: 'Outfit-Bold',
    },
    message: {
        fontSize: hp(16),
        fontWeight: '500',
        color: '#666',
        textAlign: 'center',
        marginBottom: hp(28),
        lineHeight: hp(24),
        fontFamily: 'Outfit-Regular',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: wp(12),
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    cancelButton: {
        borderColor: '#f0f0f0',
        backgroundColor: COLORS.white,
    },
    confirmButton: {
        borderColor: COLORS.orange,
        backgroundColor: COLORS.orange,
        shadowColor: COLORS.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: hp(16),
        fontWeight: '600',
        fontFamily: 'Outfit-SemiBold',
    },
    confirmButtonText: {
        color: COLORS.white,
        fontSize: hp(16),
        fontWeight: '700',
        fontFamily: 'Outfit-Bold',
    },
});

export default ConfirmModal;
