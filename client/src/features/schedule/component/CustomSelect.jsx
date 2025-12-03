import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import styles from '../styles/ScheduleComponent.module.css'

const CustomOption = (props) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleEdit = (e) => {
        e.stopPropagation();
        if(props.selectProps.onEditOption){
            props.selectProps.onEditOption(props.data);
        }
        setShowMenu(false);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (props.selectProps.onDeleteOption) {
            props.selectProps.onDeleteOption(props.data);
        }
        setShowMenu(false);
    }

    return(
        <div className={styles['custom-option-wrapper']}>
            <components.Option {...props}>
                <div className={styles['custom-option-content']}>
                    <span>{props.label}</span>

                    {props.selectProps.isEditable && (
                        <div className={styles['custom-option-menu-container']}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className={styles['custom-option-menu-btn']}
                            >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>

                            {showMenu && (
                                <div className={styles['custom-option-dropdown']}>
                                    <button
                                        onClick={handleEdit}
                                        className={styles['custom-option-dropdown-item']}
                                    >
                                        <i className="fa-solid fa-pencil"></i> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className={styles['custom-option-dropdown-item']}
                                    >
                                        <i className="fa-solid fa-trash"></i> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </components.Option>
        </div>
    );
}


// Custom Select Component //
export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "-- Select --",
    isDisabled = false,
    isSearchable = true,
    isClearable = true,
    onCreateOption,
    onEditOption,
    onDeleteOption,
    isEditable = false,
}){
    const selectOption = options.find(opt => opt.value === value) || null;

    const customStyles = {
        control: (base, state) => ({
            ...base,
            border: '2px solid #fdfdfd',  // var(--white)
            padding: '0',
            color: '#fdfdfd',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            height: 'clamp(30px, 5vh, 35px)',
            width: '320px',
            fontFamily: "'Source Code Pro', monospace",
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: state.isFocused
                ? '0 0 15px rgba(232, 91, 191, 0.6), inset 0 0 10px rgba(232, 91, 191, 0.2)'
                : 'none',
            // animation: state.isFocused ?  'dashRotate 2s linear infinite' : 'none',
            '&:hover': {
                border: '2px solid #e85bbf',  // var(--pink)
                boxShadow: '0 0 15px rgba(232, 91, 191, 0.6), inset 0 0 10px rgba(232, 91, 191, 0.2)',
            },
        }),
        valueContainer: (base) => ({
            ...base,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
        }),
        input: (base) => ({
            ...base,
            color: '#fdfdfd',
            fontFamily: "'Source Code Pro', monospace",
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            margin: 0,
            padding: 0,
        }),
        placeholder: (base) => ({
            ...base,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: "'Source Code Pro', monospace",
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            display: 'flex',
            alignItems: 'center',
        }),
        singleValue: (base) => ({
            ...base,
            color: '#fdfdfd',
            fontFamily: "'Source Code Pro', monospace",
            fontSize: 'clamp(14px, 1.5vw, 16px)',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#f6d3f4',  // var(--light)
            border: '2px solid #e85bbf',  // var(--pink)
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(232, 91, 191, 0.4)',
            marginTop: '4px',
            overflow: 'hidden',
            zIndex: 9999,
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
            maxHeight: '200px',
            backgroundColor: 'transparent',
            '::-webkit-scrollbar': {
                width: '8px',
            },
            '::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.05)',
            },
            '::-webkit-scrollbar-thumb': {
                background: '#e85bbf',
                borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb:hover': {
                background: '#b854b4',
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#c5c5c5'
                : state.isFocused
                    ? '#fdfdfd'  // var(--white)
                    : '#f6d3f4',  // var(--light)
            color: '#0c0c0c',  // var(--black)
            fontFamily: "'Source Code Pro', monospace",
            fontSize: '14px',
            padding: '2px 10px',
            cursor: 'pointer',
            fontWeight: state.isSelected ? 'bold' : 'normal',
            transition: 'all 0.2s ease',
            '&:active': {
                backgroundColor: '#c5c5c5',
            },
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: '#c5c5c5',  // var(--pink)
            transition: 'all 0.3s ease',
            transform: state.selectProps.menuIsOpen ?  'rotate(180deg)' : 'rotate(0deg)',
            padding: '0 clamp(8px, 1.5vw, 10px)',
            '&:hover': {
                color: '#b854b4',
            },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#FF5C5C',  // var(--red)
            padding: 'clamp(4px, 1vw, 8px)',
            '&:hover': {
                color: '#e85bbf',
            },
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: '#0c0c0c',
            fontFamily: "'Source Code Pro', monospace",
            fontSize: '14px',
            padding: '10px',
        }),
        loadingMessage: (base) => ({
            ...base,
            color: '#0c0c0c',
            fontFamily: "'Source Code Pro', monospace",
            fontSize: '14px',
        }),
    }

    return(
        <CreatableSelect
            value={selectOption}
            onChange={(opt) => onChange(opt ?  opt.value : '')}
            onCreateOption={onCreateOption}
            options={options}
            styles={customStyles}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isSearchable={isSearchable}
            isClearable={isClearable}
            formatCreateLabel={(inputValue) => (
                <><i className="fa-solid fa-plus"/>
                    {` Create "${inputValue}"`}
                </>
            )}
            noOptionsMessage={() => "No options available"}
            components={{ Option: CustomOption }}
            isEditable={isEditable}
            onEditOption={onEditOption}
            onDeleteOption={onDeleteOption}
        />
    )
}