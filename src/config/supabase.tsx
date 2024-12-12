import {createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import {API_KEY, API_URL} from '../constants/api_endpoints';

export const supabase = createClient(API_URL, API_KEY);
