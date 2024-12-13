import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {timeAgo} from '../utils/timeAgo';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {supabase} from '../config/supabase';

import ErrorMessage from '../components/ErrorMessage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {formatDate} from '../utils/dateFormatter';
import {PostgrestError} from '@supabase/supabase-js';
import {RootStackParamList} from '../navigation/ApplicationNavigator';
import {PrayerRequest} from '../models/PrayerRequest';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [data, setData] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    answered: 0,
    pending: 0,
  });

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const {data: items, error} = await supabase
  //       .from('tbl_prayer_request')
  //       .select('*')
  //       .order('created_at', {ascending: false});
  //     if (error) {
  //       setError(error);
  //       throw error;
  //     }
  //     setData(items);

  //     if (items) {
  //       setStats({
  //         total: items.length,
  //         answered: items.filter(item => item.response).length,
  //         pending: items.filter(item => !item.response).length,
  //       });
  //     }
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const {data: items, error} = await supabase
        .from('tbl_prayer_request')
        .select('*')
        .order('response', {ascending: false})
        .order('created_at', {ascending: false});

      if (error) {
        setError(error);
        throw error;
      }
      setData(items);

      if (items) {
        setStats({
          total: items.length,
          answered: items.filter(item => item.response).length,
          pending: items.filter(item => !item.response).length,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatsHeader = () => (
    <View style={statsStyles.container}>
      <View style={statsStyles.statBox}>
        <Icon name="format-list-bulleted" size={24} color="#007AFF" />
        <Text style={statsStyles.number}>{stats.total}</Text>
        <Text style={statsStyles.label}>Total</Text>
      </View>
      <View style={statsStyles.statBox}>
        <Icon name="check-circle" size={24} color="#4CAF50" />
        <Text style={[statsStyles.number, {color: '#4CAF50'}]}>
          {stats.answered}
        </Text>
        <Text style={statsStyles.label}>Answered</Text>
      </View>
      <View style={statsStyles.statBox}>
        <Icon name="pending" size={24} color="#FFA000" />
        <Text style={[statsStyles.number, {color: '#FFA000'}]}>
          {stats.pending}
        </Text>
        <Text style={statsStyles.label}>Pending</Text>
      </View>
    </View>
  );

  const renderItem = ({item}: {item: PrayerRequest}) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <AnimatedTouchable
        style={[
          styles.itemContainer,
          item.response && styles.respondedContainer,
          {transform: [{scale}]},
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => navigation.navigate('Response', {item})}>
        <View style={styles.itemContent}>
          <View style={styles.headerRow}>
            <Text style={styles.messageText}>{item.message?.trim()}</Text>
            <View
              style={[
                styles.statusBadge,
                item.response
                  ? styles.statusBadgeAnswered
                  : styles.statusBadgePending,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  item.response
                    ? styles.statusTextAnswered
                    : styles.statusTextPending,
                ]}>
                {item.response ? 'ANSWERED' : 'PENDING'}
              </Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.nameText}>
              {item.name?.trim()} From {item.from?.trim()}
            </Text>
            <Text style={styles.dateText}>{timeAgo(item.updated_at)}</Text>
          </View>
        </View>
      </AnimatedTouchable>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <ErrorMessage message={error.message} onRetry={fetchData} />
      ) : (
        <FlatList
          ListHeaderComponent={<StatsHeader />}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const statsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusBadgeAnswered: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgePending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextAnswered: {
    color: '#4CAF50',
  },
  statusTextPending: {
    color: '#FFA000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  respondedContainer: {
    backgroundColor: '#F5F5F5',
  },
  itemContent: {
    padding: 16,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  detailsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 14,
    color: '#666666',
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default HomeScreen;
