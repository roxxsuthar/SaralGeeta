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
            supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
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
        marginBottom: hp(30),
        lineHeight: hp(28),
        fontFamily: 'Outfit-SemiBold',
    },
    button: {
        backgroundColor: COLORS.orange,
        height: 55,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: hp(17),
        fontWeight: '700',
        fontFamily: 'Outfit-Bold',
    },
});

export default SuccessModal;
