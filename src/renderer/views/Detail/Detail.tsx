import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, useParams } from 'react-router-dom';

import { Config } from '../../../shared/types/museeks';
import * as Nav from '../../elements/Nav/Nav';
import { config } from '../../lib/app';
import { RootState } from '../../store/reducers';
import appStyles from '../../App.module.css';

import styles from './Detail.module.css';

const Detail: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const tracks = useSelector((state: RootState) => state.library.tracks.library);
  const [data, setData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
  });
  const handleSubmit = e => {
    e.preventDefault();
    console.log(data);
    history.back();
  };

  const handleChange = e => {
    e.preventDefault();
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.back();
  };

  useEffect(() => {
    const song = tracks.find((tr) => tr._id === trackId);
    setData({
      title: song.title,
      artist: song.artist[0],
      album: song.album,
      genre: song.genre[0],
    });
    return () => {
      setData({
        title: '',
        artist: '',
        album: '',
        genre: '',
      });
    };
  }, [trackId, tracks]);

  return (
    <div className={`${appStyles.view} ${styles.viewDetail}`}>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input name={'title'} type='text' value={data.title} className={styles.detailInput} onChange={handleChange} />
        </label>
        <label>
          Artist
          <input
            name={'artist'}
            type='text'
            value={data.artist}
            className={styles.detailInput}
            onChange={handleChange}
          />
        </label>
        <label>
          Album
          <input name={'album'} type='text' value={data.album} className={styles.detailInput} onChange={handleChange} />
        </label>
        <label>
          Genre
          <input name={'genre'} type='text' value={data.genre} className={styles.detailInput} onChange={handleChange} />
        </label>
        <button type='submit'>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default Detail;
