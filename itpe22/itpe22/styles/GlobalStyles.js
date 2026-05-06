import { StyleSheet } from 'react-native';

export const GRAY = '#c0c0c0';
export const DARK_GRAY = '#808080';
export const BLACK = '#000000';
export const WHITE = '#ffffff';
export const BLUE = '#000080';
export const LIGHT_BLUE = '#1084d0';
export const RED = '#ff0000';
export const GREEN = '#00aa00';

export const styles = StyleSheet.create({
  desktopBg: {
    flex: 1,
    backgroundColor: '#008080',
  },
  titleBar: {
    backgroundColor: BLUE,
    padding: 4,
    paddingLeft: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBarText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  titleBarButtons: {
    flexDirection: 'row',
    gap: 2,
  },
  titleBarBtn: {
    backgroundColor: GRAY,
    width: 20,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WHITE,
    borderBottomColor: BLACK,
    borderRightColor: BLACK,
  },
  titleBarBtnText: {
    color: BLACK,
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuBar: {
    backgroundColor: GRAY,
    flexDirection: 'row',
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: DARK_GRAY,
  },
  menuItem: {
    color: BLACK,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  loginContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  registerContent: {
    padding: 20,
    paddingVertical: 40,
  },
  loginWindow: {
    padding: 0,
    overflow: 'hidden',
  },
  windowTitle: {
    backgroundColor: BLUE,
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 4,
    paddingLeft: 8,
    fontFamily: 'Courier',
  },
  formGroup: {
    padding: 12,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Courier',
    marginBottom: 4,
    color: BLACK,
  },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: DARK_GRAY,
    borderBottomColor: BLACK,
    borderRightColor: BLACK,
    padding: 6,
    fontSize: 12,
    fontFamily: 'Courier',
  },
  inputError: {
    borderColor: RED,
    borderBottomColor: RED,
    borderRightColor: RED,
  },
  inputDisabled: {
    backgroundColor: GRAY,
    color: DARK_GRAY,
  },
  errorText: {
    color: RED,
    fontSize: 10,
    fontFamily: 'Courier',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    gap: 8,
  },
  button: {
    minWidth: 70,
    borderWidth: 1,
    borderColor: WHITE,
    borderBottomColor: BLACK,
    borderRightColor: BLACK,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonFace: {
    backgroundColor: GRAY,
    padding: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 10,
    padding: 12,
    paddingTop: 0,
    color: DARK_GRAY,
    fontFamily: 'Courier',
  },
  footer: {
    textAlign: 'center',
    color: GRAY,
    fontSize: 10,
    marginTop: 20,
    fontFamily: 'Courier',
  },
  registerLink: {
    padding: 12,
    paddingTop: 0,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: BLUE,
    textDecorationLine: 'underline',
  },
  homeContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  statusBox: {
    padding: 0,
    overflow: 'hidden',
  },
  statusTitle: {
    backgroundColor: DARK_GRAY,
    color: WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    paddingLeft: 8,
    fontFamily: 'Courier',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: DARK_GRAY,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WHITE,
    borderBottomColor: BLACK,
    borderRightColor: BLACK,
  },
  statNum: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WHITE,
    fontFamily: 'Courier',
  },
  statDesc: {
    fontSize: 10,
    color: GRAY,
    fontFamily: 'Courier',
  },
  welcomeBox: {
    padding: 0,
    overflow: 'hidden',
  },
  welcomeText: {
    backgroundColor: DARK_GRAY,
    color: WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    paddingLeft: 8,
    fontFamily: 'Courier',
  },
  subText: {
    padding: 12,
    fontSize: 12,
    color: BLACK,
    fontFamily: 'Courier',
  },
  featureBox: {
    padding: 0,
    overflow: 'hidden',
  },
  featureTitle: {
    backgroundColor: DARK_GRAY,
    color: WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    paddingLeft: 8,
    fontFamily: 'Courier',
  },
  featureItem: {
    padding: 8,
    paddingLeft: 12,
    fontSize: 10,
    color: BLACK,
    fontFamily: 'Courier',
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
  },
  statusBar: {
    backgroundColor: GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: WHITE,
  },
  statusBarText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: BLACK,
  },
  listContent: {
    padding: 16,
    gap: 8,
    paddingBottom: 40,
  },
  taskItem: {
    padding: 0,
    overflow: 'hidden',
  },
  taskRow: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  checkbox: {
    fontSize: 14,
    fontFamily: 'Courier',
    marginRight: 8,
    width: 24,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: DARK_GRAY,
  },
  taskMeta: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: DARK_GRAY,
    marginTop: 2,
  },
  reminderItem: {
    padding: 0,
    overflow: 'hidden',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  reminderTitle: {
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  reminderDate: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: DARK_GRAY,
    marginTop: 2,
  },
  switchContainer: {
    backgroundColor: DARK_GRAY,
    padding: 4,
    paddingHorizontal: 8,
  },
  switchOff: {
    backgroundColor: '#aa0000',
  },
  switchLabel: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: WHITE,
  },
  profileContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  profileBox: {
    padding: 0,
    overflow: 'hidden',
  },
  avatarBox: {
    backgroundColor: DARK_GRAY,
    padding: 20,
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 12,
    paddingBottom: 4,
  },
  profileEmail: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: DARK_GRAY,
    textAlign: 'center',
    paddingBottom: 12,
  },
  optionsBox: {
    padding: 0,
    overflow: 'hidden',
  },
  optionBtn: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: DARK_GRAY,
  },
  optionText: {
    fontSize: 12,
    fontFamily: 'Courier',
  },
  logoutBtn: {
    backgroundColor: '#aa0000',
  },
  logoutText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  versionBox: {
    padding: 0,
    overflow: 'hidden',
  },
  versionTitle: {
    backgroundColor: DARK_GRAY,
    color: WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    paddingLeft: 8,
    fontFamily: 'Courier',
  },
  versionItem: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: BLACK,
    padding: 8,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
  },
  tabBar: {
    backgroundColor: GRAY,
    borderTopWidth: 2,
    borderTopColor: WHITE,
    paddingTop: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Courier',
  },
  tabIcon: {
    fontSize: 16,
  },
  bevelOuter: {
    backgroundColor: DARK_GRAY,
    borderWidth: 1,
    borderColor: WHITE,
    borderBottomColor: BLACK,
    borderRightColor: BLACK,
  },
  bevelInner: {
    backgroundColor: GRAY,
    borderWidth: 1,
    borderColor: DARK_GRAY,
    borderBottomColor: WHITE,
    borderRightColor: WHITE,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008080',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: 'Courier',
    color: BLACK,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: DARK_GRAY,
    textAlign: 'center',
  },
});