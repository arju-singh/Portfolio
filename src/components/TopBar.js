import React, { useState } from 'react';

const SEASONS = [
    { name: 'SUMMER', icon: 'fa-solid fa-sun' },
    { name: 'WINTER', icon: 'fa-solid fa-snowflake' },
    { name: 'AUTUMN', icon: 'fa-solid fa-leaf' },
    { name: 'SPRING', icon: 'fa-solid fa-seedling' }
];

const TopBar = ({ onLogoClick }) => {
    const [seasonIndex, setSeasonIndex] = useState(0);
    const season = SEASONS[seasonIndex];

    return (
        <div className="top-bar">
            <button className="scroll-logo" onClick={onLogoClick}>Arju Singh</button>
            <button
                className="theme-toggle"
                onClick={() => setSeasonIndex((seasonIndex + 1) % SEASONS.length)}
                aria-label="Cycle season theme"
            >
                <span className="toggle-icon"><i className={season.icon}></i></span>
                {season.name}
            </button>
        </div>
    );
};

export default TopBar;
