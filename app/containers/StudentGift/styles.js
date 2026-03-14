import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        backgroundColor: COLORS.white,
        flex: 1,
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
        paddingBottom: hp(10),
        gap: hp(10),
        borderTopLeftRadius: wp(20),
        borderTopRightRadius: wp(20),
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingHorizontal: 16,
        paddingVertical: 0,
        marginTop: 0,
        marginBottom: hp(15),
    },
    heading: {
        fontWeight: '700',
        fontSize: hp(16),
        lineHeight: hp(22),
        color: COLORS.white,
    },
    icon: {
        height: hp(24),
        width: wp(24),
    },
    iconContainer: {
        position: 'absolute',
        left: hp(16),
    },
    inputContainer: {
        gap: hp(5),
        marginBottom: hp(15),
    },
    label: {
        fontWeight: '600',
        fontSize: hp(14),
        color: COLORS.black,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: hp(12),
        paddingVertical: hp(8),
        paddingHorizontal: hp(10),
        fontSize: hp(14),
        fontWeight: '400',
        color: COLORS.black,
    },
    textarea: {
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: hp(12),
        paddingBottom: hp(80),
        paddingHorizontal: hp(16),
        fontSize: hp(14),
        fontWeight: '400',
        color: COLORS.black,
        textAlignVertical: 'top',
    },
    chapterListContainer: {
        flex: 1,
        marginBottom: hp(20),
    },
    chapterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(8),
        gap: wp(10),
    },
    checkbox: {
        width: wp(20),
        height: hp(20),
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.orange || '#fb732b',
        borderColor: COLORS.orange || '#fb732b',
    },
    chapterName: {
        fontSize: hp(14),
        color: COLORS.black,
    },
    buttonContainer: {
        paddingBottom: 0,
    },
    button: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        height: hp(40),
        borderRadius: wp(12),
    },
    buttonText: {
        color: COLORS.black,
        fontSize: hp(15),
        fontWeight: '600',
        lineHeight: hp(22),
        marginLeft: hp(5),
    },
    errorText: {
        color: 'red',
        fontSize: hp(12),
    },
});

export default styles;
