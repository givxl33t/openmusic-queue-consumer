const { Pool } = require('pg')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylistSongs (playlistId) {
    const query = {
      text: `SELECT playlists.*, songs.id, songs.title, songs.performer FROM playlists
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    const songs = result.rows.map(({ id, title, performer }) => ({
      id,
      title,
      performer
    }))

    return {
      playlist: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        songs
      }
    }
  }
}

module.exports = PlaylistsService
