import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { AutoSizer, Column, Table } from 'react-virtualized';
import * as PlayerActions from '../../store/actions/PlayerActions';
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
  const [selected, setSelected] = useState(null);

  const clickHandler = ({ event, index, rowData }) => {
    setSelected(index);
  };

  const doubleClickHandler = async ({ event, index, rowData }) => {
    if (index !== -1) PlayerActions.start(tracks, tracks[index]._id);
  };

  const getRowClasses = useCallback(
    ({ index }) => {
      if (index === -1) return '';
      if (selected === null) return styles.track;
      return cx(styles.track, {
        [styles.selected]: selected === index,
      });
    },
    [selected]
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
          headerHeight={21}
          rowCount={tracks.length}
          rowGetter={({ index }) => tracks[index]}
        >
          {/* <Column label='' id='playing' width={width * 0.03} headerClassName={styles.trackCellHeader} className={styles.cell} /> */}
          <Column
            label='Title'
            dataKey='title'
            width={width * 0.3}
            headerClassName={styles.trackCellHeader}
            className={styles.cell}
          />
          <Column
            label='Artist'
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
