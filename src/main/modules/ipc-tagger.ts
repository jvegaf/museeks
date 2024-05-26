import { ipcMain } from 'electron';

import channels from '../../shared/lib/ipc-channels';
import { Track } from '../../shared/types/museeks';
import FixTags from '../lib/tagger/tagger';

import ModuleWindow from './BaseWindowModule';

/**
 * Module in charge of returning the track with tags fixed
 */
class IPCTaggerModule extends ModuleWindow {
  async load(): Promise<void> {
    ipcMain.handle(channels.FIX_TAGS, (_e, track: Track): Promise<Track> => {
      return FixTags(track);
    });
  }
}

export default IPCTaggerModule;
