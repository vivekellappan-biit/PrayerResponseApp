import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/ApplicationNavigator';
import {supabase} from '../config/supabase';
import {timeAgo} from '../utils/timeAgo';
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
    // Alert.alert(ALERT_TITLE, ALERT_MESSAGE, [
    //   {text: ALERT_CANCEL, style: 'cancel'},
    //   {
    //     text: ALERT_CONFIRM,
    //     onPress: async () => {
    //       try {
    //         setLoading(true);
    //         const {error} = await supabase
    //           .from('tbl_prayer_request')
    //           .update({
    //             response: response,
    //           })
    //           .eq('id', item.id);

    //         if (error) throw error;
    //         setResponse('');
    //         navigation.goBack();
    //       } catch (error) {
    //         console.error('Error sending response:', error);
    //         Alert.alert('Error', ERROR_SEND);
    //       } finally {
    //         setLoading(false);
    //       }
    //     },
    //   },
    // ]);
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
      Alert.alert('Error', ERROR_SEND);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.messageHeader}>
            <Icon name="mail" size={24} color="#007AFF" />
            <Text style={styles.messageLabel}>Prayer Request</Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.userInfo}>
              <Icon name="person" size={16} color="#666666" />
              <Text style={styles.details}>
                {item.name.trim()} From {item.from}
              </Text>
            </View>
            <View style={styles.timeInfo}>
              <Icon name="access-time" size={16} color="#666666" />
              <Text style={styles.timeText}>{timeAgo(item.updated_at)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.responseSection}>
          <Text style={styles.responseLabel}>Your Response</Text>
          <TextInput
            style={styles.input}
            value={response}
            onChangeText={setResponse}
            placeholder="Type your response here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            editable={!loading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!response.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!response.trim() || loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon
                  name="send"
                  size={20}
                  color="#FFFFFF"
                  style={styles.sendIcon}
                />
                <Text style={styles.sendButtonText}>Send Response</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 16,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  responseSection: {
    padding: 16,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    minHeight: 200,
    lineHeight: 24,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResponseScreen;
