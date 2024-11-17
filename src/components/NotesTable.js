import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import logo from '../BISA_A.I._Logo-removebg-preview.png'; 

const NotesTable = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [newNote, setNewNote] = useState({ nama_kelas: '', tugas: '', isChecked: false });
  const [editMode, setEditMode] = useState(false);
  const [editNote, setEditNote] = useState({ id: null, nama_kelas: '', tugas: '', isChecked: false });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://110.239.71.90:8000/api/notes');
      setNotes(response.data);
      setFilteredNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (editMode) {
      setEditNote({ ...editNote, [name]: inputValue });
    } else {
      setNewNote({ ...newNote, [name]: inputValue });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = notes.filter(note =>
      note.nama_kelas.toLowerCase().includes(value.toLowerCase()) ||
      note.tugas.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const handleAddNote = async () => {
    try {
      await axios.post('http://110.239.71.90:8000/api/notes', newNote);
      fetchNotes();
      setNewNote({ nama_kelas: '', tugas: '', isChecked: false });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditClick = (note) => {
    setEditMode(true);
    setEditNote(note);
  };

  const handleUpdateNote = async () => {
    if (!editNote.id) {
      console.error("Note ID is missing.");
      return;
    }

    try {
      await axios.put(`http://110.239.71.90:8000/api/notes/${editNote.id}`, editNote);
      fetchNotes();
      setEditMode(false);
      setEditNote({ id: null, nama_kelas: '', tugas: '', isChecked: false });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleCheckboxChange = async (note) => {
    try {
      const updatedNote = { ...note, isChecked: !note.isChecked };
      await axios.put(`http://110.239.71.90:8000/api/notes/${note.id}`, updatedNote);
      fetchNotes();
    } catch (error) {
      console.error('Error updating checkbox:', error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <span className="site-name">BISA AI Notes</span>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by class or task..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-input search-input"
          />
        </div>
      </nav>

      {/* Main Content */}
      <div className="table-container">
        <h1>Progress Pembelajaran</h1>

        <div className="note-form">
          <input
            type="text"
            name="nama_kelas"
            placeholder="Nama Kelas"
            value={editMode ? editNote.nama_kelas : newNote.nama_kelas}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="text"
            name="tugas"
            placeholder="Tugas"
            value={editMode ? editNote.tugas : newNote.tugas}
            onChange={handleInputChange}
            className="form-input"
          />
          {editMode ? (
            <button onClick={handleUpdateNote} className="btn-submit">Update Note</button>
          ) : (
            <button onClick={handleAddNote} className="btn-submit">Add Note</button>
          )}
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>Checklist</th>
              <th>ID</th>
              <th>Nama Kelas</th>
              <th>Tugas</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotes.map((note) => (
              <tr key={note.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={note.isChecked}
                    onChange={() => handleCheckboxChange(note)}
                  />
                </td>
                <td>{note.id}</td>
                <td>{note.nama_kelas}</td>
                <td>{note.tugas}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditClick(note)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotesTable;
