import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', paddingHorizontal: 24},
  title: {fontSize: 32, marginBottom: 30, alignSelf: 'center'},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 25,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {color: '#fff', fontSize: 18},
  registerButtonText: {color: '#fff', fontSize: 18},
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  forgrtpassword: {
    color: '#007bff',
    fontSize: 18,
    alignSelf: 'center',
  },
});

export default styles;
