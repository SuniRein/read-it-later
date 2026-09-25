import { isPopoutMode } from '@/common/message-actions';
import { bootstrap } from './bootstrap';

void bootstrap(isPopoutMode() ? 'popout' : 'popup');
