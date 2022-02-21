import React from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { parseDuration } from '../../lib/utils';
import styles from './TracksTable.module.css';

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
  const { tracks } = props;

  return (
    <AutoSizer>
      {({ width, height }) => (
        <Table
          rowClassName={(index) => (index !== -1 ? styles.track : '')}
          headerHeight={40}
          headerClassName={styles.tracksListHeader}
          width={width}
          height={height}
          rowHeight={30}
          headerHeight={21}
          rowCount={tracks.length}
          rowGetter={({ index }) => tracks[index]}
        >
          <Column label='' width={width * 0.03} headerClassName={styles.trackCellHeader} className={styles.cell} />
          <Column
            label='Title'
            dataKey='title'
            width={width * 0.3}
            headerClassName={styles.trackCellHeader}
            className={styles.cell}
          />
          <Column
            label='Artist'
            dataKey='title'
            width={width * 0.25}
            headerClassName={styles.trackCellHeader}
            cellDataGetter={({ rowData }) => rowData.artist[0]}
            className={styles.cell}
          />
          <Column
            label='Duration'
            dataKey='duration'
            headerClassName={styles.trackCellHeader}
            width={width * 0.05}
            className={styles.cell}
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
