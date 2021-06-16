import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, useParams } from 'react-router-dom';
import { Section, Label, Input } from '../../components/Setting/Setting';
import Button from '../../elements/Button/Button';
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    history.back();
  };

  const handleChange = (e) => {
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
      <form className={styles.detailForm} onSubmit={handleSubmit}>
        <Section>
          <Label htmlFor='title'>Title</Label>
          <Input 
            id='title'
            name='title'
            type='text'
            onChange={handleChange}
            value={data.title}
          />
        </Section>
        <Section>
          <Label htmlFor='artist'>Artist</Label>
          <Input 
            id='artist'
            name='artist'
            type='text'
            onChange={handleChange}
            value={data.artist}
          />
        </Section>
        <Section>
          <Label htmlFor='album'>Album</Label>
          <Input 
            id='album'
            name='album'
            type='text'
            onChange={handleChange}
            value={data.album}
          />
        </Section>
        <Section>
          <Label htmlFor='genre'>Genre</Label>
          <Input 
            id='genre'
            name='genre'
            type='text'
            onChange={handleChange}
            value={data.genre}
          />
        </Section>
        <div className={styles.detailActions}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='submit'>Save</Button>
        </div>
      </form>
    </div>
  );
};

export default Detail;
