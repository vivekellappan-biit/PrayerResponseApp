import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/ApplicationNavigator';
import {supabase} from '../config/supabase';
import {
  ALERT_TITLE,
  ALERT_MESSAGE,
  ALERT_CANCEL,
  ALERT_CONFIRM,
  ERROR_SEND,
} from '../constants/messages';

type Props = NativeStackScreenProps<RootStackParamList, 'Response'>;

const ResponseScreen: React.FC<Props> = ({route, navigation}) => {
  const {item} = route.params;
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    Alert.alert(ALERT_TITLE, ALERT_MESSAGE, [
      {text: ALERT_CANCEL, style: 'cancel'},
      {
        text: ALERT_CONFIRM,
        onPress: async () => {
          try {
            setLoading(true);

            const {error} = await supabase
              .from('tbl_prayer_request')
              .update({
                response: response,
              })
              .eq('id', item.id);

            if (error) throw error;

            setResponse('');
            navigation.goBack();
          } catch (error) {
            console.error('Error sending response:', error);
            Alert.alert('Error', 'Failed to send response. Please try again.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.details}>
          {item.name.trim()} From {item.from}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={response}
            onChangeText={setResponse}
            placeholder="Type your response..."
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!response.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!response.trim() || loading}>
            <Text style={styles.sendButtonText}>
              {loading ? 'Sending...' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 32,
    minHeight: 150,
    maxHeight: 250,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResponseScreen;
