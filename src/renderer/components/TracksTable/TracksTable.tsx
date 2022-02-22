import electron from 'electron';
import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { useHistory } from 'react-router';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PlayingIndicator from '../PlayingIndicator/PlayingIndicator';
import * as LibraryActions from '../../store/actions/LibraryActions';
import * as PlaylistsActions from '../../store/actions/PlaylistsActions';
import * as PlayerActions from '../../store/actions/PlayerActions';
import * as QueueActions from '../../store/actions/QueueActions';
import { parseDuration } from '../../lib/utils';
import { PlayerStatus } from '../../../shared/types/museeks';
import styles from './TracksTable.module.css';

const { shell, remote } = electron;
const { Menu } = remote;

interface Props {
  type: string;
  playerStatus: string;
  tracks: TrackModel[];
  trackPlayingId: string | null;
  playlists: PlaylistModel[];
  currentPlaylist?: string;
  reorderable?: boolean;
  onReorder?: (playlistId: string, tracksIds: string[], targetTrackId: string, position: 'above' | 'below') => void;
}

const TracksTable: React.FC<Props> = (props: Props) => {
  const { type, playerStatus, tracks, trackPlayingId, playlists, currentPlaylist } = props;
  const [selected, setSelected] = useState([]);
  const history = useHistory();


    /**
   * Context menus
   */
     const showContextMenu = useCallback(
      (_e: React.MouseEvent, index: number) => {
        const selectedCount = selected.length;
        const track = tracks[index];
        let shownPlaylists = playlists;
  
        // Hide current playlist if needed
        if (type === 'playlist') {
          shownPlaylists = playlists.filter((elem) => elem._id !== currentPlaylist);
        }
  
        const playlistTemplate: electron.MenuItemConstructorOptions[] = [];
        let addToQueueTemplate: electron.MenuItemConstructorOptions[] = [];
  
        if (shownPlaylists) {
          playlistTemplate.push(
            {
              label: 'Create new playlist...',
              click: async () => {
                await PlaylistsActions.create('New playlist', selected);
              },
            },
            {
              type: 'separator',
            }
          );
  
          if (shownPlaylists.length === 0) {
            playlistTemplate.push({
              label: 'No playlists',
              enabled: false,
            });
          } else {
            shownPlaylists.forEach((playlist) => {
              playlistTemplate.push({
                label: playlist.name,
                click: async () => {
                  await PlaylistsActions.addTracks(playlist._id, selected);
                },
              });
            });
          }
        }
  
        if (playerStatus !== PlayerStatus.STOP) {
          addToQueueTemplate = [
            {
              label: 'Add to queue',
              click: async () => {
                await QueueActions.addAfter(selected);
              },
            },
            {
              label: 'Play next',
              click: async () => {
                await QueueActions.addNext(selected);
              },
            },
            {
              type: 'separator',
            },
          ];
        }
  
        const template: electron.MenuItemConstructorOptions[] = [
          {
            label: selectedCount > 1 ? `${selectedCount} tracks selected` : `${selectedCount} track selected`,
            enabled: false,
          },
          {
            type: 'separator',
          },
          ...addToQueueTemplate,
          {
            label: 'Add to playlist',
            submenu: playlistTemplate,
          },
          {
            type: 'separator',
          },
          {
            label: 'View Detail',
            click: () => {
              history.push(`/detail/${track._id}`);
            },
          },
          {
            label: `Search for "${track.artist[0]}" `,
            click: () => {
              // HACK
              const searchInput: HTMLInputElement | null = document.querySelector(
                `input[type="text"].${headerStyles.header__search__input}`
              );
  
              if (searchInput) {
                searchInput.value = track.artist[0];
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            },
          },
          {
            label: `Search for "${track.album}"`,
            click: () => {
              // HACK
              const searchInput: HTMLInputElement | null = document.querySelector(
                `input[type="text"].${headerStyles.header__search__input}`
              );
  
              if (searchInput) {
                searchInput.value = track.album;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            },
          },
        ];
  
        if (type === 'playlist' && currentPlaylist) {
          template.push(
            {
              type: 'separator',
            },
            {
              label: 'Remove from playlist',
              click: async () => {
                await PlaylistsActions.removeTracks(currentPlaylist, selected);
              },
            }
          );
        }
  
        template.push(
          {
            type: 'separator',
          },
          {
            label: 'Show in file manager',
            click: () => {
              shell.showItemInFolder(track.path);
            },
          },
          {
            label: 'Remove from library',
            click: () => {
              LibraryActions.remove(selected);
            },
          }
        );
  
        const context = Menu.buildFromTemplate(template);
  
        context.popup({}); // Let it appear
      },
      [currentPlaylist, history, playerStatus, playlists, selected, tracks, type]
    );
  

  const clickHandler = ({ event, index, rowData }) => {
    setSelected([rowData._id]);
  };

  const doubleClickHandler = async ({ event, index, rowData }) => {
    if (index !== -1) PlayerActions.start(tracks, tracks[index]._id);
  };

  const rightClickHandler = ({ event, index, rowData }) => {
    showContextMenu(event, index);
  };

  const getRowClasses = useCallback(
    ({ index }) => {
      if (index === -1) return styles.tracksListHeader;
      if (selected === null) return styles.track;
      return cx(styles.track, {
        [styles.selected]: selected.includes(tracks[index]._id),
      });
    },
    [selected, tracks]
  );

  const IsPlaying = useCallback(
    (rowData) => {
      if (trackPlayingId === null) return '';
      if (rowData._id === trackPlayingId) {
        return (<PlayingIndicator />);
      }
    },
    [trackPlayingId]
  );

  return (
    <AutoSizer>
      {({ width, height }) => (
        <Table
          rowClassName={getRowClasses}
          headerHeight={40}
          headerClassName={styles.tracksListHeader}
          width={width}
          height={height}
          rowHeight={30}
          onRowClick={clickHandler}
          onRowDoubleClick={doubleClickHandler}
          onRowRightClick={rightClickHandler}
          headerHeight={21}
          rowCount={tracks.length}
          rowGetter={({ index }) => tracks[index]}
        >
          <Column
            label=''
            dataKey='playing'
            id='playing'
            cellRenderer={({rowData}) => IsPlaying(rowData)}
            width={width * 0.03}
            headerClassName={styles.trackCellHeader}
            className={styles.cell}
          />
          <Column
            label='Title'
            dataKey='title'
            width={width * 0.3}
            headerClassName={styles.trackCellHeader}
            className={styles.cell}
          />
          <Column
            label='Artist'
            dataKey='artist'
            width={width * 0.25}
            headerClassName={styles.trackCellHeader}
            id='artist'
            cellDataGetter={({ rowData }) => rowData.artist[0]}
            className={styles.cell}
          />
          <Column
            label='Duration'
            dataKey='duration'
            headerClassName={styles.trackCellHeader}
            width={width * 0.05}
            className={styles.cell}
            id='duration'
            cellDataGetter={({ rowData }) => parseDuration(rowData.duration)}
          />
          <Column
            label='Album'
            dataKey='album'
            headerClassName={styles.trackCellHeader}
            width={width * 0.25}
            className={styles.cell}
          />
          <Column
            label='Genre'
            dataKey='genre'
            headerClassName={styles.trackCellHeader}
            width={width * 0.1}
            className={styles.cell}
          />
        </Table>
      )}
    </AutoSizer>
  );
};

export default TracksTable;
