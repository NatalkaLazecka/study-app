import React, {useEffect, useState} from 'react';
import styles from '../styles/CalendarPage.module.css';
import {useNavigate, useSearchParams} from "react-router-dom";

export default function CalendarEventPage(){
    const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';

    const [eventId, setEventId] = useState('');
    const [title, setTitle] = useState('');
    const [describe, setDescribe] = useState('');
    const [date, setDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [categories, setACategories] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [files, setFiles] = useState([]);
    const [uploadingFile, setUploadingFile] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const res = await fetch(`${API_URL}/api/events/categories`);
                const data = await res.json();
                setACategories(data);
            }catch (err){
                setError(err.message);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        console.log('🔄 searchParams changed');
        const id = searchParams.get('id');
        const dateFromUrl = searchParams.get('date');
        const titleFromUrl = searchParams.get('title');
        const describeFromUrl = searchParams.get('describe');
        const categoryFromUrl = searchParams. get('category');
        const endDateFromUrl = searchParams.get('endDate');

        console.log('📥 URL params:', { id, dateFromUrl, titleFromUrl, describeFromUrl, categoryFromUrl, endDateFromUrl });

        if (id) {
            console.log('✅ Setting eventId to:', id);
            setEventId(id);
        } else {
            console.log('❌ No id in URL');
        }

        if (dateFromUrl) setDate(dateFromUrl);
        if (endDateFromUrl) setEndDate(endDateFromUrl);
        if (!endDateFromUrl) setEndDate(dateFromUrl);
        if (titleFromUrl) setTitle(titleFromUrl);
        if (describeFromUrl) setDescribe(describeFromUrl);
        if (categoryFromUrl) setActiveCategory(categoryFromUrl);
    }, [searchParams]);

    useEffect(() => {
        console.log('🎯 eventId state updated to:', eventId);
        if(eventId){
            console.log('📂 Fetching files for eventId:', eventId);
            fetchFiles();
        }
    }, [eventId]);

    const toggleCategory = (category) => {
        setActiveCategory(category);
    };

    const getCategoryIdByName = (name) => {
        const category = categories.find(cat => cat.nazwa.toLowerCase() === name.toLowerCase());
        return category ? category.id : null;
    };

    const fetchFiles = async () => {
        try{
            const res = await fetch(`${API_URL}/api/events/${eventId}/files`);
            const data = await res.json();
            setFiles(data);
        } catch (err){
            setError(err.message);
        }
    }

    useEffect(() => {
        if(eventId){
            fetchFiles();
        }
    }, [eventId]);

    const handleFileClick = () => {
        console.log('🔍 handleFileClick called');
        console.log('📌 Current eventId:', eventId);
        console.log('📌 eventId type:', typeof eventId);
        console.log('📌 ! eventId evaluates to:', !eventId);

        if(!eventId){
            console.log('❌ Blocked - no eventId');
            setError('Save the event first before uploading files.');
            return;
        }

        console. log('✅ Opening file picker');
        setError('');
        document.getElementById('file-input').click();
    }

    const handleFileSelect = async (e) =>{
        const file = e.target.files[0];
        if(!file) return;

        setUploadingFile(true);
        setError('');

        try{
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${API_URL}/api/events/${eventId}/files`, {
                method: 'POST',
                body: formData
            });

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            e.target.value = '';
            await fetchFiles();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploadingFile(false);
        }
    }

    const handleFileDownload = async (fileId, fileName) => {
        try{
            const res = await fetch(`${API_URL}/api/events/files/${fileId}/download`);
            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || 'Download failed');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(err.message);
        }
    }

    const handleFileDelete = async (fileId) => {
        if(!window.confirm("Are you sure you want to delete this file?")){return;}

        try{
            const res = await fetch(`${API_URL}/api/events/files/${fileId}`, {
                method: 'DELETE'
            });
            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || 'Delete failed');
            }
            await fetchFiles();
        } catch (err) {
            setError(err.message);
        }
    }

    const handleSave = async () => {
        if(!title.trim()){setError("Title is required"); return;}
        if(!date){setError("Date is required"); return;}
        if(!activeCategory){setError("Please select a category"); return;}

        setLoading(true);
        setError('');

        try{
            const categoryId = getCategoryIdByName(activeCategory);
            const eventData = {
                tytul: title.trim(),
                opis: describe.trim() || null,
                data_start: date,
                data_koncowa: endDate || null,
                priorytet: 'normal',
                rodzaj_wydarzenia_id: categoryId,
                rodzaj_powtarzania_id: null,
                student_id: null
            };

            let res;
            if(eventId){
                res = await fetch(`${API_URL}/api/events/${eventId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(eventData)
                });
            }else{
                res = await fetch(`${API_URL}/api/events`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(eventData)
                });
            }

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || 'Something went wrong');
            }

            navigate('/calendar');
        }catch (err){
            setError(err.message);
        }finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!eventId) {navigate('/calendar');return;}
        if(!window.confirm("Are you sure you want to delete this event?")){return;}

        setLoading(true);
        setError('');

        try{
            const res = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: 'DELETE'
            });

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || 'Something went wrong');
            }

            navigate('/calendar');
        }catch (err){
            setError(err.message);
        }finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className={styles['menu-bar']}>
                <div className={styles['menu-icons']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/todo')}>
                        <i className="fa-solid fa-list-check"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/calendar')}>
                        <i className="fa-regular fa-calendar-days"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/groups')}>
                        <i className="fa-solid fa-people-group"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/notifications')}>
                        <i className="fa-solid fa-question"></i>
                    </button>
                </div>

                <div className={styles['menu-user']}>
                    <button className={styles['menu-icon-btn']}
                      onClick={() => navigate('/profile')}
                    >
                        <i class="fa-regular fa-circle-user"></i>
                    </button>
                </div>
            </div>

            <div className={styles['calendar-root']}>
                <div className={styles['header-section']}>
                    <button
                        className={styles['back-button']}
                        onClick={() => navigate(-1)}
                    >
                        <span className={styles['back-text']}>stud
                            <span className={styles['back-text-y']}>y</span></span>
                        <span className={styles['back-arrow']}>&lt;</span>
                    </button>
                    <h1 className={styles['calendar-title']}>{eventId ? 'EDIT EVENT' : 'NEW EVENT'}</h1>
                    <div></div>
                </div>

                {error && (<div className={styles['err-message']}>{error}</div>)}

                <div className={styles['calendar-event-content']}>
                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Title *</p>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Describe</p>
                        <input
                            type="text"
                            value={describe}
                            onChange={(e) => setDescribe(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Start Date *</p>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>End Date</p>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['import-box']} onClick={handleFileClick}>
                        <div className={styles['import-icon']}>
                            <i className="fa-solid fa-file-import" />
                        </div>
                        <h3 className={styles['event-h3']}>
                            {uploadingFile ? 'uploading...' : 'import notes/files/etc.'}
                        </h3>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            disabled={!eventId || uploadingFile}
                        />
                    </div>

                    {files.length > 0 && (
                        <div className={styles['files-list']}>
                            {files.map((file) => (
                                <div key={file.id} className={styles['file-item']}>
                                    <div className={styles['file-icon']}>
                                        <i className="fa-solid fa-file"></i>
                                    </div>
                                    <span className={styles['file-name']}>{file.nazwa}</span>
                                    <div className={styles['file-actions']}>
                                        <button
                                            className={styles['file-btn-download']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileDownload(file.id, file.nazwa);
                                            }}
                                            title="Download"
                                        >
                                            <i className="fa-solid fa-download"></i>
                                        </button>
                                        <button
                                            className={styles['file-btn-delete']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileDelete(file.id);
                                            }}
                                            title="Delete"
                                        >
                                            <i className="fa-solid fa-x"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h2 className={styles['event-h2']}>choose category: *</h2>

                    <div className={styles['event-buttons']}>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`${styles['event-button']} ${activeCategory.includes(cat.nazwa) ? styles['event-button-active'] : ''}`}
                                    onClick={() => toggleCategory(cat.nazwa)}
                                >{cat.nazwa}</button>
                            ))
                        ) : (
                           <p>Loading categories...</p>
                        )}
                    </div>
                </div>

                <div className={styles['end-buttons']}>
                    <button className={styles['end-button']} onClick={handleSave} disabled={loading}>{loading ? 'SAVING...' : 'SAVE'}</button>
                    <button className={styles['end-button']} onClick={() => navigate(-1)} disabled={loading}>CANCEL</button>
                    <button className={styles['end-button-delete']} onClick={handleDelete} disabled={loading}>{loading ? 'DELETING...' : 'DELETE'}</button>
                </div>
            </div>
        </div>
    )
}