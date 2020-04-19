import React from 'react';

class MenuButton extends React.Component{
    render() {
        return (
            <div className="menuButton">
                <button
                    className='mBtn'
                    disabled={this.props.disabled}
                >
                    {this.props.text}
                </button>
            </div>
        );
    }
}

export default MenuButton;