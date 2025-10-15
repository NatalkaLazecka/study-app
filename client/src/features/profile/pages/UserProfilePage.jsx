import {useState, useEffect} from 'react';
import {User, Upload, Save} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from '../styles/UserProfile.module.css';
import {useNavigate} from 'react-router-dom';

export default function UserProfilePage() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [userInfo, setUserInfo] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '',
        address: '',
        nation: '',
        gender: '',
        language: '',
        dob: null,
        twitter: '',
        facebook: '',
        linkedin: '',
        google: '',
        slogan: '',
    });

    useEffect(() => {
        document.body.setAttribute('data-theme', 'dark');
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInfoChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        alert('Data saved!');
    };

    return (
        <div className={styles['profile-root']}>
            {/* Navigation Bar */}
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
                    <button
                        className={styles['menu-icon-btn']}
                        onClick={() => navigate('/profile')}
                    >
                        <i className="fa-regular fa-circle-user"></i>
                    </button>
                </div>
            </div>

            <div className={styles['profile-maincard']}>
                {/* LEFT COLUMN */}
                <div className={styles['profile-left']}>
                    <div className={styles['profile-avatar-row']}>
                        <div className={styles['profile-image-container']}>
                            {image ? (
                                <img src={image} alt="Profile" className={styles['profile-image']}/>
                            ) : (
                                <div className={styles['profile-image-placeholder']}>
                                    <User size={48}/>
                                </div>
                            )}
                        </div>
                        <label className={styles['profile-upload-btn']}>
                            <Upload size={20}/>
                            <input
                                type="file"
                                style={{display: 'none'}}
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                    <div className={styles['profile-form-left']}>
                        <div className={styles['profile-row']}>
                            <div>
                                <label className={styles['profile-sublabel']}>First Name</label>
                                <input
                                    name="firstName"
                                    value={userInfo.firstName}
                                    onChange={handleInfoChange}
                                    className={styles['profile-input']}
                                    placeholder="First name"
                                />
                            </div>
                            <div>
                                <label className={styles['profile-sublabel']}>Last Name</label>
                                <input
                                    name="lastName"
                                    value={userInfo.lastName}
                                    onChange={handleInfoChange}
                                    className={styles['profile-input']}
                                    placeholder="Last name"
                                />
                            </div>
                        </div>
                        <div>
                            <label className={styles['profile-sublabel']}>Email</label>
                            <input
                                name="email"
                                value={userInfo.email}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label className={styles['profile-sublabel']}>Phone</label>
                            <input
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="Phone"
                            />
                        </div>
                        <div>
                            <label className={styles['profile-sublabel']}>Address</label>
                            <input
                                name="address"
                                value={userInfo.address}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="Address"
                            />
                        </div>
                        <div>
                            <label className={styles['profile-sublabel']}>Nation</label>
                            <input
                                name="nation"
                                value={userInfo.nation}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className={styles['profile-right']}>
                    <div className={styles['profile-row']}>
                        <div>
                            <label className={styles['profile-sublabel']}>Gender</label>
                            <select
                                name="gender"
                                value={userInfo.gender}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_say">Prefer not to say</option>
                            </select>
                        </div>
                        <div>
                            <label className={styles['profile-sublabel']}>Language</label>
                            <select
                                name="language"
                                value={userInfo.language}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="Language"
                                >
                                <option value="">Select language</option>
                                <option value="english">English</option>
                                <option value="polish">Polish</option>
                            </select>


                        </div>
                    </div>
                    <div>
                        <label className={styles['profile-sublabel']}>Date of Birth</label>
                        <DatePicker
                            selected={userInfo.dob}
                            onChange={(date) => setUserInfo({...userInfo, dob: date})}
                            dateFormat="yyyy-MM-dd"
                            className={styles['profile-input']}
                            placeholderText="Select date"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                        />
                    </div>
                    <div className={styles['profile-row']}>
                        <div>
                            <label className={styles['profile-sublabel']}>Twitter</label>
                            <input
                                name="twitter"
                                value={userInfo.twitter}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="twitter.com/..."
                            />
                        </div>
                        <div>
                            <label className={styles['profile-sublabel']}>LinkedIn</label>
                            <input
                                name="linkedin"
                                value={userInfo.linkedin}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="linkedin.com/in/..."
                            />
                        </div>
                    </div>
                    <div className={styles['profile-row']}>
                        <div>
                            <label className={styles['profile-sublabel']}>Facebook</label>
                            <input
                                name="facebook"
                                value={userInfo.facebook}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className={styles['profile-sublabel']}>Google</label>
                            <input
                                name="google"
                                value={userInfo.google}
                                onChange={handleInfoChange}
                                className={styles['profile-input']}
                                placeholder="Google account"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={styles['profile-sublabel']}>Slogan</label>
                        <input
                            name="slogan"
                            value={userInfo.slogan}
                            onChange={handleInfoChange}
                            className={styles['profile-input']}
                            placeholder="Your slogan"
                        />
                    </div>
                    <div className={styles['profile-btns-row']}>
                        <button
                            className={`${styles['profile-btn']} ${styles['profile-btn-secondary']}`}
                            onClick={() => navigate('/home')}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${styles['profile-btn']} ${styles['profile-btn-primary']}`}
                            onClick={handleSave}
                        >
                            <Save size={18}/>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}